import React, { ReactChild } from 'react';
import { AuthenticatorProvider } from './AuthenticatorProvider';
import { SocketProvider } from './SocketProvider';

interface Props {
    children: ReactChild;
}

export function Providers({ children }: Props) {
    return (
        <AuthenticatorProvider>
            <SocketProvider>
                {children}
            </SocketProvider>
        </AuthenticatorProvider>
    )
}
