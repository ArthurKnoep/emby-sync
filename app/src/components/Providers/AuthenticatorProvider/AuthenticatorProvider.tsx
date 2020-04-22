import React, { ReactNode } from 'react';
import { EmbyCtx } from '../../../features/emby/embyCtx';
import { Authenticator } from '../../../features/emby/connect';

interface Props {
    children: ReactNode;
}

export function AuthenticatorProvider({ children }: Props) {
    return (
        <EmbyCtx.Provider value={{authenticator: new Authenticator()}}>
            {children}
        </EmbyCtx.Provider>
    )
}
