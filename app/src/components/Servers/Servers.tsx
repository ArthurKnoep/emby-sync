import React, { useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Card, Col, Row, Spin, Typography } from "antd";
import { Steps } from "../Steps";
import { EmbyCtx } from '../../features/emby/embyCtx';
import { ServerI } from '../../features/emby/interface';
import styles from './Servers.module.scss';
import { SocketCtx } from '../../features/socket';
import { useRoomInfo } from '../../features/socket/hooks';

export function Servers() {
    const { authenticator } = useContext(EmbyCtx);
    const { socket } = useContext(SocketCtx);
    const { connected } = useRoomInfo();
    const [servers, setServers] = useState<ServerI[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (connected) {
            authenticator.listServer()
                .then(serversApi => {
                    setServers(serversApi);
                    setIsLoading(false);
                })
        }
    }, [connected, authenticator, socket]);
    if (!connected) {
        return <Redirect to="/" />
    }
    return (
        <Row>
            <Col span={14} offset={5}>
                <Steps current={1}/>
                <div className={styles.container}>
                    <Card
                        title="Servers"
                    >
                        <Row gutter={[16, 16]}>
                        {
                            (isLoading) &&
                                <Col span={24} className={styles.loader}>
                                    <Spin />
                                </Col>
                        }
                        {
                            servers.map(server => (
                                <Col key={server.Id} span={6}>
                                    <Card className={styles.serverCard}>
                                        <Typography.Title className={styles.serverName} level={4} ellipsis>
                                            {server.Name}
                                        </Typography.Title>
                                        <Typography.Paragraph ellipsis type="secondary">
                                            {server.Url}
                                        </Typography.Paragraph>
                                    </Card>
                                </Col>
                            ))
                        }
                        </Row>
                    </Card>
                </div>
            </Col>
        </Row>
    )
}
