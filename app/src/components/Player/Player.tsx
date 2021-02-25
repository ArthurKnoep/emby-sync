import React, { useContext, useRef, useMemo, useEffect, useCallback, useState } from 'react';
import { Redirect } from 'react-router-dom';
import HLS from 'hls.js';
import { notification, Row, Col } from 'antd';
import { EmbyCtx } from '../../features/emby';
import { Player as EmbyPlayer } from '../../features/emby/player';
import { useRoomInfo } from '../../features/socket/hooks';
import { OptionsCtx } from '../../features/options';
import { SocketCtx } from '../../features/socket';
import { OnLoadedI } from '../../features/socket/interface';
import { useRedirectBackButton } from '../../features/menubar';
import styles from './Player.module.scss';

export function Player() {
    const { authenticator, playerContext } = useContext(EmbyCtx);
    const { socket } = useContext(SocketCtx);
    const { options } = useContext(OptionsCtx);
    const { connected, info } = useRoomInfo();
    const [loaded, setLoaded] = useState<OnLoadedI[]>([]);
    const hasLoaded = useRef<boolean>(false);
    const emby = useMemo(() => {
        try {
            return authenticator.getEmby();
        } catch (e) {
            return null;
        }
    }, [authenticator]);
    useRedirectBackButton(`/servers/${emby?.getServerId()}`);
    const player = useMemo(() => {
        if (emby) {
            return new EmbyPlayer(emby, options);
        }
    }, [emby, options]);
    const videoRef = useRef<HTMLVideoElement>(null);

    const play = useCallback(async () => {
        if (info?.is_master) {
            try {
                await socket.playStarted();
            } catch (e) {}
        }
        try {
            await videoRef.current?.play();
        } catch (e) {
            console.log('could not autostart play, retry with mute');
            if (videoRef.current !== null) {
                videoRef.current.muted = true;
            }
            try {
                await videoRef.current?.play();
            } catch (e) {
                console.log('could not autostart play, need to be start at the end');
            }
        }
    }, [info, videoRef, socket]);

    useEffect(() => {
        const playerCtx = playerContext.getContext();
        if (!connected || !emby || !playerCtx || !player || !HLS.isSupported()) {
            return;
        }
        player.attachMedia(videoRef.current!);
        (async () => {
            if (info?.is_master) {
                player.startWaitingForUser(playerContext.getNbUserToWait());
            }
            try {
                console.log('start load item');
                await player.initPlay(playerCtx, () => {
                    hasLoaded.current = true;
                    if (!info?.is_master) {
                        socket.getSocket().emit('play:loaded');
                        console.log('the video has been loaded');
                    } else {
                        if (player.hasWaitedForEveryone()) {
                            play().catch(() => {});
                        }
                    }
                });
            } catch (e) {
                console.error(e);
            }
        })();
    }, [connected, socket, emby, player, playerContext, videoRef, info, play]);

    const handleUserLoaded = useCallback((msg: OnLoadedI) => {
        if (player && player.userFinishedLoaded(msg)) {
            setLoaded([...loaded, msg]);
        }
        if (player && player.hasWaitedForEveryone()) {
            play().catch(() => {});
        }
    }, [loaded, setLoaded, player, play])

    useEffect(() => {
        if (info?.is_master && playerContext.getNbUserToWait() > 0) {
            socket.getSocket().on('play:onloaded', handleUserLoaded);
            return () => {
                socket.getSocket().off('play:onloaded', handleUserLoaded);
            }
        }
    }, [info, socket, handleUserLoaded, playerContext]);

    const handlePlayStarted = useCallback(() => {
        play().catch(() => {});
    }, [play]);

    useEffect(() => {
        if (!info?.is_master) {
            socket.getSocket().on('play:started', handlePlayStarted);
            return () => {
                socket.getSocket().on('play:started', handlePlayStarted);
            }
        }
    }, [info, socket, handlePlayStarted])

    if (!connected) {
        return <Redirect to="/" />
    }
    if (!emby) {
        return <Redirect to="/servers" />
    }
    if (!playerContext.getContext() || !player) {
        return <Redirect to={`/servers/${emby.getServerId()}`} />
    }
    if (!HLS.isSupported()) {
        notification.error({
            message: 'Your browser do not support HLS',
            duration: 0
        });
        return <Redirect to="/" />
    }
    return (
        <Row>
            <Col className={styles.playerContainer} span={18} offset={1}>
                <video className={styles.video} ref={videoRef} controls />
                {
                    (info?.is_master)
                    && (
                        <span>{loaded.length} / {playerContext.getNbUserToWait()}</span>
                    )
                }
            </Col>
        </Row>
    )
}
