import React, { ReactNode } from 'react';
import { defaultValue, SocketCtx } from '../../../features/socket';

interface Props {
    children: ReactNode
}

export function SocketProvider({ children }: Props) {
    const { Provider } = SocketCtx;
    return (
        <Provider value={defaultValue}>
            {children}
        </Provider>
    )
}
