import React from 'react';
import classNames from 'classnames';
import { Typography } from 'antd';
import styles from './RoomBox.module.scss';
import { useRoomInfo } from '../../../features/socket/hooks';
import { UserList } from './UserList';
import { Chat } from './Chat';

export function RoomBox() {
    const {connected, info} = useRoomInfo();
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
