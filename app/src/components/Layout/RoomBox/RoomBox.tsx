import React, { useCallback, useContext, useEffect } from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { notification, Typography } from 'antd';
import styles from './RoomBox.module.scss';
import { useRoomInfo } from '../../../features/socket/hooks';
import { UserList } from './UserList';
import { Chat } from './Chat';
import { EmbyCtx } from '../../../features/emby/embyCtx';
import { SocketCtx } from '../../../features/socket';

export function RoomBox() {
    const {connected, info} = useRoomInfo();
    const {socket} = useContext(SocketCtx);
    const {authenticator, playerContext} = useContext(EmbyCtx);
    const history = useHistory();

    const handlePlayItem = useCallback((msg) => {
        function startPlayItem(itemId: string) {
            playerContext.setContext({
                serverId: authenticator.getEmby().getServerId(),
                itemId
            });
            history.push(`/servers/${authenticator.getEmby().getServerId()}/items/${itemId}/play`);
        }

        (async () => {
            try {
                const e = authenticator.getEmby()
                if (e.getServerId() === msg.server_id) {
                    return startPlayItem(msg.item_id);
                }
            } catch (e) {
            }
            try {
                const serverList = await authenticator.listServer();
                for (const s of serverList) {
                    if (s.Id === msg.server_id) {
                        await authenticator.exchangeToken(s);
                        return startPlayItem(msg.item_id);
                    }
                }
                notification.error({
                    message: 'Could not play the item',
                    description: 'You do not have access to the Emby server'
                })
            } catch (e) {
                notification.error({
                    message: 'Could not play the item',
                    description: 'Unable to connect to the server'
                });
            }
        })();
    }, [authenticator, history, playerContext]);

    useEffect(() => {
        if (connected && info?.is_master === false) {
            socket.getSocket().on('room:onplay', handlePlayItem);
            return () => {
                socket.getSocket().off('room:onplay', handlePlayItem);
            }
        }
    }, [connected, info, socket, handlePlayItem]);
    return (
        <div className={classNames({
            [styles.chatBox]: true,
            [styles.hide]: !connected
        })}
        >
            <div className={styles.roomName}>
                <Typography.Title level={4}>{info?.room_name}</Typography.Title>
            </div>
            {
                (connected)
                && (
                    <>
                        <UserList />
                        <Chat />
                    </>
                )
            }
        </div>
    );
}
