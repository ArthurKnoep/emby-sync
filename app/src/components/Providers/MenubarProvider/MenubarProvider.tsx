import React, { ReactNode } from 'react';
import { defaultValue, MenubarCtx } from '../../../features/menubar';

interface Props {
    children: ReactNode
}

export function MenubarProvider({ children }: Props) {
    return (
        <MenubarCtx.Provider value={defaultValue}>
            {children}
        </MenubarCtx.Provider>
    )
}
