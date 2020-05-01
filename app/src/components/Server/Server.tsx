import React, { useContext, useMemo } from 'react';
import { Col, Row } from 'antd';
import { Redirect } from 'react-router-dom';
import { Steps } from '../Steps';
import { useRoomInfo } from '../../features/socket/hooks';
import { EmbyCtx } from '../../features/emby/embyCtx';
import { Libraries } from './Libraries';
import { Resume } from './Resume';
import { NextUp } from './NextUp';
import { LastMovies } from './LastMovies';

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

    if (!connected) {
        return <Redirect to="/" />
    }
    if (!emby) {
        return <Redirect to="/servers" />
    }
    return (
        <Row>
            <Col span={14} offset={5}>
                <Steps current={2} />
            </Col>
            <Col span={18} offset={1}>
                <Libraries />
                <Resume />
                <NextUp />
                <LastMovies />
            </Col>
        </Row>
    );
}
