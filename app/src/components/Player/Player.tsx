import React, { useContext, useRef, useMemo, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import HLS from 'hls.js';
import { notification, Row, Col } from 'antd';
import { EmbyCtx } from '../../features/emby/embyCtx';
import { Player as EmbyPlayer } from '../../features/emby/player';
import { useRoomInfo } from '../../features/socket/hooks';
import styles from './Player.module.scss';

export function Player() {
    const { authenticator, playerContext } = useContext(EmbyCtx);
    const { connected } = useRoomInfo();
    const emby = useMemo(() => {
        try {
            return authenticator.getEmby();
        } catch (e) {
            return null;
        }
    }, [authenticator]);
    const player = useMemo(() => {
        if (emby) {
            return new EmbyPlayer(emby);
        }
    }, [emby]);
    const videoRef = useRef(null);


    useEffect(() => {
        const playerCtx = playerContext.getContext();
        if (!connected || !emby || !playerCtx || !player || !HLS.isSupported()) {
            return;
        }
        player.attachMedia(videoRef.current!);
        (async () => {
            try {
                await player.initPlay(playerCtx, () => {
                    console.log('the video has been loaded');
                });
            } catch (e) {
                console.error(e);
            }
        })();
    }, [connected, emby, player, playerContext, videoRef]);

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
            </Col>
        </Row>
    )
}
