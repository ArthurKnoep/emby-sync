import React, { ReactNode, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Layout as LayoutAnt, Menu, notification } from 'antd';
import styles from './Layout.module.scss';
import { Latency } from './Latency';
import { useRoomInfo } from '../../features/socket/hooks';
import { RoomBox } from './RoomBox';
import { SocketCtx } from '../../features/socket';
import { EmbyCtx } from '../../features/emby/embyCtx';

const { Header, Content, Footer } = LayoutAnt;

interface Props {
    children: ReactNode;
    isAuthenticated: boolean
}

export function Layout({ children, isAuthenticated }: Props) {
    const { authenticator } = useContext(EmbyCtx);
    const { connected: roomConnected } = useRoomInfo();
    const { socket } = useContext(SocketCtx);
    const leaveRoom = () => {
        authenticator.leaveServer();
        socket.leaveRoom()
            .catch(err => notification.error({
                message: 'Could not leave room',
                description: err.message || 'Unknown error'
            }));
    };

    return (
        <LayoutAnt className={styles.layout}>
            <Header>
                <Menu theme="dark" mode="horizontal">
                    {
                        (isAuthenticated)
                            ? (<Menu.Item style={{float: 'right'}}><Link to="/logout">Log Out</Link></Menu.Item>)
                            : (<Menu.Item style={{float: 'right'}}><Link to="/">Login</Link></Menu.Item>)
                    }
                    {
                        (roomConnected)
                        && <Menu.Item onClick={leaveRoom} style={{float: 'right'}}>Leave room</Menu.Item>
                        }
                </Menu>
            </Header>
            <Content className={styles.content}>
                {children}
                <RoomBox />
            </Content>
            <Footer style={{textAlign: 'center'}}>
                EmbySync, 2020
                <Latency />
            </Footer>
        </LayoutAnt>
    )
}
