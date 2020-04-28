import React, { useContext, useEffect, useMemo } from 'react';
import { Col, Row } from 'antd';
import { Steps } from '../Steps';
import { Redirect } from 'react-router-dom';
import { useRoomInfo } from '../../features/socket/hooks';
import { EmbyCtx } from '../../features/emby/embyCtx';

export function Server() {
    const { authenticator } = useContext(EmbyCtx);
    const { connected } = useRoomInfo();
    const emby = useMemo(() => {
        try {
            return authenticator.getEmby();
        } catch (e) {
            return null;
        }
    }, [authenticator]);

    useEffect(() => {
        if (connected && emby)
        emby.getLibraries()
            .then(rst => console.log(rst))
    }, [connected, emby]);

    if (!connected) {
        return <Redirect to="/" />
    }
    if (!emby) {
        return <Redirect to="/servers" />
    }
    return (
        <Row>
            <Col span={14} offset={5}>
                <Steps current={2}/>
            </Col>
            <Col span={18} offset={1}>
                oui
            </Col>
        </Row>
    );
}
