import React, { ReactNode } from 'react';
import { ConnectCtx } from '../../../features/emby/connectCtx';
import { Authenticator } from '../../../features/emby/connect';

interface Props {
    children: ReactNode;
}

export function AuthenticatorProvider({ children }: Props) {
    return (
        <ConnectCtx.Provider value={{authenticator: new Authenticator()}}>
            {children}
        </ConnectCtx.Provider>
    )
}