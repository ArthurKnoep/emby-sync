import React, { ReactNode, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout as LayoutAnt, Menu, notification } from 'antd';
import { Latency } from './Latency';
import { useRoomInfo } from '../../features/socket/hooks';
import { RoomBox } from './RoomBox';
import { SocketCtx } from '../../features/socket';
import { EmbyCtx } from '../../features/emby';
import { Event, MenubarCtx, useMenubarConfiguration } from '../../features/menubar';
import { Options } from './Options';
import { LeftOutlined } from '@ant-design/icons';
import styles from './Layout.module.scss';

const {Header, Content, Footer} = LayoutAnt;

interface Props {
    children: ReactNode;
    isAuthenticated: boolean
}

export function Layout({children, isAuthenticated}: Props) {
    const {menubarController} = useContext(MenubarCtx);
    const menubarConfig = useMenubarConfiguration();
    const {authenticator} = useContext(EmbyCtx);
    const {connected: roomConnected} = useRoomInfo();
    const {socket} = useContext(SocketCtx);
    const [optionsShow, setOptionsShow] = useState<boolean>(false);

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
            <Header className={styles.header}>
                <Menu theme="dark" mode="horizontal" selectable={false}>
                    <Menu.Item
                        icon={<LeftOutlined />}
                        onClick={(evt) => menubarController.emit(Event.BACK_BUTTON_CLICK, evt)}
                        disabled={!menubarConfig.enableBackButton}
                    />
                    <Menu.Item onClick={() => setOptionsShow(true)}>Options</Menu.Item>
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
                <Options visible={optionsShow} onClose={() => setOptionsShow(false)} />
            </Header>
            <Content className={styles.content}>
                {children}
                <RoomBox />
            </Content>
            <Footer className={styles.footer}>
                EmbySync, {(new Date()).getFullYear()}
                <Latency />
            </Footer>
        </LayoutAnt>
    )
}
