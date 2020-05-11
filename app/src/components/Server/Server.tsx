import React, { useContext, useMemo } from 'react';
import { Col, notification, Row } from 'antd';
import { Redirect, useHistory } from 'react-router-dom';
import { Steps } from '../Steps';
import { useRoomInfo } from '../../features/socket/hooks';
import { EmbyCtx } from '../../features/emby/embyCtx';
import { Libraries } from './Libraries';
import { Resume } from './Resume';
import { NextUp } from './NextUp';
import { LastItems } from './LastItems';
import { SocketCtx } from '../../features/socket';

export function Server() {
    const { authenticator, playerContext } = useContext(EmbyCtx);
    const { socket } = useContext(SocketCtx);
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
        (async () => {
            try {
                const resp = await socket.playItem(authenticator.getEmby().getServerId(), itemId);
                playerContext.setContext({
                    serverId: authenticator.getEmby().getServerId(),
                    itemId
                });
                playerContext.setNbUserToWait(resp.data.user_to_wait);
                history.push(`/servers/${authenticator.getEmby().getServerId()}/items/${itemId}/play`);
            } catch (e) {
                notification.error({
                    message: 'Could not play item',
                    description: e.message
                })
            }
        })();
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
                <LastItems title="Last movies" collectionType="movies" onItemStartPlay={handleItemClick} />
                <LastItems title="Last Series" collectionType="tvshows" onItemStartPlay={handleItemClick} />
            </Col>
        </Row>
    );
}
