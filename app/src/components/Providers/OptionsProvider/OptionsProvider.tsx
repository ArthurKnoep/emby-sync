import React, { ReactNode } from 'react';
import { defaultValue, OptionsCtx } from '../../../features/options';

interface Props {
    children: ReactNode
}

export function OptionsProvider({ children }: Props) {
    return (
        <OptionsCtx.Provider value={defaultValue}>
            {children}
        </OptionsCtx.Provider>
    )
}
