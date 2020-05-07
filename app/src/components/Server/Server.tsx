import React, { useContext, useMemo } from 'react';
import { Col, Row } from 'antd';
import { Redirect, useHistory } from 'react-router-dom';
import { Steps } from '../Steps';
import { useRoomInfo } from '../../features/socket/hooks';
import { EmbyCtx } from '../../features/emby/embyCtx';
import { Libraries } from './Libraries';
import { Resume } from './Resume';
import { NextUp } from './NextUp';
import { LastItems } from './LastItems';

export function Server() {
    const { authenticator, playerContext } = useContext(EmbyCtx);
    const { connected } = useRoomInfo();
    const history = useHistory();
    const emby = useMemo(() => {
        try {
            return authenticator.getEmby();
        } catch (e) {
            return null;
        }
    }, [authenticator]);

    const handleItemClick = (itemId: string) => {
        playerContext.setContext({
            serverId: authenticator.getEmby().getServerId(),
            itemId
        });
        history.push(`/servers/${authenticator.getEmby().getServerId()}/items/${itemId}/play`);
    };

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
                <Resume onItemClick={handleItemClick} />
                <NextUp />
                <LastItems title="Last movies" collectionType="movies" />
                <LastItems title="Last Series" collectionType="tvshows" />
            </Col>
        </Row>
    );
}
