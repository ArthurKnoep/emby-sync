import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { EmbyCtx } from '../../features/emby/embyCtx';

export function Logout() {
    const { authenticator } = useContext(EmbyCtx);
    if (authenticator.isLogin()) {
        // TODO find a better way to handle the logout
        setTimeout(() => authenticator.logout(), 100);
        return null;
    }
    return <Redirect to="/login" />;
}
