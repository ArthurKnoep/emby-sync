import React, { ReactNode } from 'react';
import { EmbyCtx } from '../../../features/emby/embyCtx';
import { Authenticator } from '../../../features/emby/connect';
import { PlayerContext } from '../../../features/emby/playerContext';

interface Props {
    children: ReactNode;
}

export function AuthenticatorProvider({ children }: Props) {
    return (
        <EmbyCtx.Provider value={
            {
                authenticator: new Authenticator(),
                playerContext: new PlayerContext(),
            }}
        >
            {children}
        </EmbyCtx.Provider>
    )
}
