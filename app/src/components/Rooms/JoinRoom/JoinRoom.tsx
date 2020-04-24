import React, { useContext, useState } from 'react';
import { Button, Checkbox, Form, Input, notification } from 'antd';
import { Store } from 'rc-field-form/lib/interface';
import { SocketCtx } from '../../../features/socket';
import { useHistory } from 'react-router-dom';

const { Item } = Form;

export function JoinRoom() {
    const { socket } = useContext(SocketCtx);
    const history = useHistory();
    const [usePassword, setUsePassword] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const createNotification = (msg: string) => {
        notification.error({
            message: 'Could not join room',
            description: msg
        })
    };

    const joinRoom = (values: Store) => {
        setIsLoading(true);
        socket.joinRoom({
            room_name: values.room_name,
            room_password: values.room_password
        })
            .then(() => {
                setIsLoading(false);
                history.push('/servers');
            })
            .catch(err => {
                if (err.code === 'UserAlreadyInRoom') {
                    socket.leaveRoom()
                        .then(() => joinRoom(values))
                        .catch(err => {
                            setIsLoading(false);
                            createNotification(err.message || "Unknown error");
                            console.error(err);
                        })
                } else {
                    setIsLoading(false);
                    createNotification(err.message || "Unknown error");
                    console.error(err);
                }
            });
    };

    return (
        <Form
            labelCol={{span: 5}}
            wrapperCol={{span: 16}}
            name="join_room"
            onFinish={joinRoom}
        >
            <Item
                label="Room name"
                name="room_name"
                rules={[{required: true, message: 'Please enter the room name'}]}
            >
                <Input />
            </Item>
            <Item
                wrapperCol={{offset: 5, span: 16}}
            >
                <Checkbox checked={usePassword} onChange={e => setUsePassword(e.target.checked)} >Require a password</Checkbox>
            </Item>
            {
                (usePassword)
                && (
                    <Item
                        label="Room password"
                        name="room_password"
                        rules={[{required: true, message: 'Please enter the room password'}]}
                    >
                        <Input />
                    </Item>
                )
            }
            <Item
                wrapperCol={{offset: 5, span: 16}}
            >
                <Button type="primary" htmlType="submit" loading={isLoading}>
                    Join
                </Button>
            </Item>
        </Form>
    )
}
