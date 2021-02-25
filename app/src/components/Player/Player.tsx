import React, { useContext, useRef, useMemo, useEffect, useCallback, } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import HLS from 'hls.js';
import { notification, Row, Col } from 'antd';
import { EmbyCtx } from '../../features/emby';
import { Player as PlayerController } from '../../features/player';
import { useRoomInfo } from '../../features/socket/hooks';
import { OptionsCtx } from '../../features/options';
import { SocketCtx } from '../../features/socket';
import { useRedirectBackButton } from '../../features/menubar';
import styles from './Player.module.scss';

export function Player() {
    const { authenticator, playerContext } = useContext(EmbyCtx);
    const { socket } = useContext(SocketCtx);
    const { options } = useContext(OptionsCtx);
    const history = useHistory();
    const { connected, info } = useRoomInfo();
    const emby = useMemo(() => {
        try {
            return authenticator.getEmby();
        } catch (e) {
            return null;
        }
    }, [authenticator]);
    useRedirectBackButton(`/servers/${emby?.getServerId()}`);
    const playerController = useMemo(() => {
        if (emby && info) {
            return new PlayerController(emby, socket, options);
        }
    }, [emby, socket, options, info]);
    const videoRef = useRef<HTMLVideoElement>(null);

    // init item playback
    useEffect(() => {
        const playerCtx = playerContext.getContext();
        if (!connected || !playerCtx || !playerController || !HLS.isSupported()) {
            return;
        }
        playerController.attachVideoElement(videoRef.current!);
        (async () => {
            try {
                await playerController.initPlayback(playerCtx);
            } catch (e) {
                console.error(e);
            }
        })();
    }, [connected, playerContext, playerController, videoRef]);

    // handle player stop
    useEffect(() => () => {
        playerController?.stopPlayback();
    }, [playerController]);

    // handle master stop
    const handleMasterStop = useCallback(() => {
        playerController?.stopPlayback();
        history.push(`/servers/${emby?.getServerId()}`);
    }, [emby, playerController, history]);
    useEffect(() => {
        if (!socket.getIsMaster()) {
            socket.getSocket().on('play:stopped', handleMasterStop);
            return () => {
                socket.getSocket().off('play:stopped', handleMasterStop);
            };
        }
    }, [socket, handleMasterStop]);

    if (!connected) {
        return <Redirect to="/" />
    }
    if (!emby) {
        return <Redirect to="/servers" />
    }
    if (!playerContext.getContext() || !playerController) {
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
            </Col>
        </Row>
    )
}
