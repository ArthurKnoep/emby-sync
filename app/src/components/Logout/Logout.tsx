import React, { useContext } from 'react';
import { notification, Spin } from 'antd';
import { Redirect } from 'react-router-dom';
import { EmbyCtx } from '../../features/emby/embyCtx';
import { SocketCtx } from '../../features/socket';

export function Logout() {
    const { authenticator } = useContext(EmbyCtx);
    const { socket } = useContext(SocketCtx);

    if (authenticator.isLogin()) {
        socket.leaveRoom()
            .then(() => {
                setTimeout(() => authenticator.logout(), 100);
            })
            .catch(err => {
                notification.error({
                    message: 'Could not logout',
                    description: err.message || 'Unknown error'
                })
            });
        return <Spin />;
    }
    return <Redirect to="/login" />
}
