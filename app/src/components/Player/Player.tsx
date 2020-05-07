import React, { useContext, useRef, useMemo, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import HLS from 'hls.js';
import { notification, Row, Col } from 'antd';
import { EmbyCtx } from '../../features/emby/embyCtx';
import { useRoomInfo } from '../../features/socket/hooks';
import styles from './Player.module.scss';

export function Player() {
    const { authenticator, playerContext } = useContext(EmbyCtx);
    const { connected } = useRoomInfo();
    const hls = useMemo(() => (new HLS()), []);
    const videoRef = useRef(null);

    const emby = useMemo(() => {
        try {
            return authenticator.getEmby();
        } catch (e) {
            return null;
        }
    }, [authenticator]);

    useEffect(() => {
        const playerCtx = playerContext.getContext();
        if (!connected || !emby || !playerCtx || !HLS.isSupported()) {
            return;
        }
        (async () => {
            hls.attachMedia(videoRef.current!);
            const item = await emby.getItem(playerCtx.itemId);
            if (item.MediaSources.length === 0) {
                // TODO handle error
                return;
            }
            const mediaId = item.MediaSources[0].Id;
            const playbackInfo = await emby.playbackInfo(playerCtx.itemId, 1, 3, mediaId);

        })();
    }, [connected, emby, playerContext, hls, videoRef]);

    if (!connected) {
        return <Redirect to="/" />
    }
    if (!emby) {
        return <Redirect to="/servers" />
    }
    if (!playerContext.getContext()) {
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
