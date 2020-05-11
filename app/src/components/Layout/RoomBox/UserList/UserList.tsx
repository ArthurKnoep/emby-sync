import React, { useCallback, useContext, useEffect, useState } from 'react';
import { List, notification } from 'antd';
import { StarFilled } from '@ant-design/icons';
import { SocketCtx } from '../../../../features/socket';
import styles from './UserList.module.scss';

interface User {
    username: string;
    uuid: string;
    is_admin: boolean
}

export function UserList() {
    const [userList, setUserList] = useState<User[]>([]);
    const { socket } = useContext(SocketCtx);

    const handleRoomUpdate = useCallback(msg => {
        if (msg.type === 'join') {
            setUserList([...userList, {username: msg.data.username, uuid: msg.data.uuid, is_admin: false}])
        } else if (msg.type === 'leave') {
            setUserList(userList.filter(elem => elem.uuid !== msg.data.uuid))
        }
    }, [setUserList, userList]);

    const createNotification = (msg: string) => {
        notification.error({
            message: 'Could not list user in room',
            description: msg
        })
    };

    useEffect(() => {
        socket.getSocket().on('room:update', handleRoomUpdate);
        return () => {
            socket.getSocket().off('room:update', handleRoomUpdate);
        }
    }, [socket, handleRoomUpdate]);

    useEffect(() => {
        socket.listUserInRoom()
            .then(resp => {
                let u: User[] = [];
                resp.data.users.forEach(elem => {
                    u.push({
                        username: elem.username,
                        uuid: elem.uuid,
                        is_admin: elem.is_admin,
                    })
                });
                setUserList(u);
            })
            .catch(err => createNotification(err.message || "Unknown error"));
    }, [socket, setUserList]);

    return (
        <List
            className={styles.list}
            itemLayout="horizontal"
            dataSource={userList}
            bordered
            locale={{
                emptyText: 'No users'
            }}
            renderItem={item => (
                <List.Item>
                    {item.username}
                    {
                        (item.is_admin)
                        && (
                            <>
                                &nbsp;
                                <StarFilled />
                            </>
                        )
                    }
                </List.Item>
            )}
        />
    )
}
