import React, { useCallback, useContext, useEffect, useState } from 'react';
import { List, notification } from 'antd';
import { SocketCtx } from '../../../../features/socket';

interface User {
    username: string;
    uuid: string;
}

export function UserList() {
    const [userList, setUserList] = useState<User[]>([]);
    const { socket } = useContext(SocketCtx);

    const handleRoomUpdate = useCallback(msg => {
        console.log(msg);
        if (msg.type === 'join') {
            setUserList([...userList, {username: msg.data.username, uuid: msg.data.uuid}])
        } else if (msg.type === 'leave') {
            setUserList(userList.filter(elem => elem.uuid !== msg.data.uuid))
        }
    }, [userList, setUserList]);

    const createNotification = (msg: string) => {
        notification.error({
            message: 'Could not list user in room',
            description: msg
        })
    };

    useEffect(() => {
        socket.listUserInRoom()
            .then(resp => {
                let u: User[] = [];
                resp.users.forEach(elem => {
                    u.push({
                        username: elem.username,
                        uuid: elem.uuid,
                    })
                });
                setUserList(u);
            })
            .catch(err => createNotification(err.message || "Unknown error"));
        socket.getSocket().on('room:update', handleRoomUpdate);
        return () => {
            socket.getSocket().off('room:update', handleRoomUpdate);
        }
    }, [socket, userList, setUserList, handleRoomUpdate]);
    return (
        <List
            itemLayout="horizontal"
            dataSource={userList}
            bordered
            locale={{
                emptyText: 'No users'
            }}
            renderItem={item => (
                <List.Item>
                    {item.username}
                </List.Item>
            )}
        />
    )
}
