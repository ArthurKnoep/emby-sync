import React, { ReactChild } from 'react';
import { AuthenticatorProvider } from './AuthenticatorProvider';

interface Props {
    children: ReactChild;
}

export function Providers({ children }: Props) {
    return (
        <AuthenticatorProvider>
            {children}
        </AuthenticatorProvider>
    )
}