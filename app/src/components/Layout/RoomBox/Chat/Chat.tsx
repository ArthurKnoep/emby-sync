import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Comment, Input, notification } from 'antd';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import styles from './Chat.module.scss';
import { useUserInfo } from '../../../../features/emby/hook';
import { SocketCtx } from '../../../../features/socket';

enum MessageType {
    JOIN,
    LEAVE,
    MESSAGE
}

interface Message {
    type: MessageType,
    uuid: string,
    date: Date,
    username: string,
    data?: any
}

export function Chat() {
    const { socket } = useContext(SocketCtx);
    const userInfo  = useUserInfo();
    const [messagePending, setMessagePending] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);

    const sendMessage = useCallback(message => {
        if (message.length === 0) {
            return;
        }
        setMessagePending("");
        socket.sendMessage(message)
            .then(() => {
                setMessages([...messages, {
                    type: MessageType.MESSAGE,
                    uuid: uuid(),
                    date: new Date(),
                    username: userInfo?.username || '',
                    data: message
                }])
            })
            .catch(err => {
                setMessagePending(message);
                notification.error({
                    message: 'Could not send the message',
                    description: err.message || 'Unknown error'
                });
            });
    }, [messages, setMessages, userInfo, setMessagePending, socket]);

    const handleRoomUpdate = useCallback((msg) => {
        setMessages([...messages, {
            type: msg.type === 'join' ? MessageType.JOIN : MessageType.LEAVE,
            username: msg.data.username,
            uuid: uuid(),
            date: new Date()
        }]);
    }, [messages, setMessages]);

    const handleMessageReceive = useCallback((msg) => {
        setMessages([...messages, {
            type: MessageType.MESSAGE,
            username: msg.username,
            uuid: uuid(),
            date: new Date(msg.date),
            data: msg.message,
        }]);
    }, [messages, setMessages]);

    useEffect(() => {
        socket.getSocket().on('room:update', handleRoomUpdate);
        socket.getSocket().on('room:message', handleMessageReceive);
        return () => {
            socket.getSocket().off('room:update', handleRoomUpdate);
            socket.getSocket().off('room:message', handleMessageReceive);
        }
    }, [socket, handleRoomUpdate, handleMessageReceive]);

    return (
        <div className={styles.container}>
            <div className={styles.messageContainer}>
                {
                    messages.sort((a, b) => b.date.getTime() - a.date.getTime()).map(message => {
                        if (message.type === MessageType.MESSAGE) {
                            return (
                                <Comment
                                    key={message.uuid}
                                    content={message.data}
                                    author={message.username}
                                    datetime={moment(message.date).format('HH:mm')}
                                />
                            );
                        }
                        if (message.type === MessageType.JOIN) {
                            return <div key={message.uuid} className={styles.joinLeave}>{message.username} has joined the room</div>;
                        }
                        if (message.type === MessageType.LEAVE) {
                            return <div key={message.uuid} className={styles.joinLeave}>{message.username} has leaved the room</div>;
                        }
                        return null;
                    })
                }
            </div>
            <div className={styles.inputContainer}>
                <Input.Search
                    value={messagePending}
                    onChange={value => setMessagePending(value.target.value)}
                    placeholder="Send a message..."
                    onSearch={sendMessage}
                    enterButton="Send"
                />
            </div>
        </div>
    )
}
