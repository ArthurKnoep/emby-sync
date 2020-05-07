import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { EmbyCtx } from '../../features/emby/embyCtx';

export function Player() {
    const { playerContext } = useContext(EmbyCtx);

    if (!playerContext.getContext()) {
        return <Redirect to="/" />
    }
    return (
        <span>Player</span>
    )
}
