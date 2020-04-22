import React, { useContext, useEffect } from 'react';
import { ConnectCtx } from '../../features/emby/connectCtx';
import { Layout } from '../Layout';

export function Home() {
    const { authenticator } = useContext(ConnectCtx);
    useEffect(() => {
        authenticator.listServer()
            .then(servers => console.log(servers));
    }, [authenticator]);

    return (
        <Layout>
            Home
        </Layout>
    )
}