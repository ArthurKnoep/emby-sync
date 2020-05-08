import React, { ReactChild } from 'react';
import { AuthenticatorProvider } from './AuthenticatorProvider';
import { SocketProvider } from './SocketProvider';
import { OptionsProvider } from './OptionsProvider';

interface Props {
    children: ReactChild;
}

export function Providers({ children }: Props) {
    return (
        <AuthenticatorProvider>
            <SocketProvider>
                <OptionsProvider>
                    {children}
                </OptionsProvider>
            </SocketProvider>
        </AuthenticatorProvider>
    )
}
