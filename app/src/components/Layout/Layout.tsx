import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Layout as LayoutAnt, Menu, Row, Col } from 'antd';
import styles from './Layout.module.scss';
import { Latency } from './Latency';
import { useRoomInfo } from '../../features/socket/hooks';
import { RoomBox } from './RoomBox';

const { Header, Content, Footer } = LayoutAnt;

interface Props {
    children: ReactNode;
    isAuthenticated: boolean
}

export function Layout({ children, isAuthenticated }: Props) {
    const { connected: roomConnected, info } = useRoomInfo();
    return (
        <LayoutAnt className={styles.layout}>
            <Header>
                <Menu theme="dark" mode="horizontal">
                    {
                        (isAuthenticated)
                            ? (<Menu.Item style={{float: 'right'}}><Link to="/logout">Log Out</Link></Menu.Item>)
                            : (<Menu.Item style={{float: 'right'}}><Link to="/">Login</Link></Menu.Item>)
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
