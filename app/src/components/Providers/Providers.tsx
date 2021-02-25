import React, { ReactChild } from 'react';
import { AuthenticatorProvider } from './AuthenticatorProvider';
import { SocketProvider } from './SocketProvider';
import { OptionsProvider } from './OptionsProvider';
import { MenubarProvider } from './MenubarProvider';

interface Props {
    children: ReactChild;
}

export function Providers({ children }: Props) {
    return (
        <AuthenticatorProvider>
            <SocketProvider>
                <OptionsProvider>
                    <MenubarProvider>
                        {children}
                    </MenubarProvider>
                </OptionsProvider>
            </SocketProvider>
        </AuthenticatorProvider>
    )
}
