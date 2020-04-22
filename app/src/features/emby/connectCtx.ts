import { createContext } from 'react';
import { Authenticator } from './connect';

interface Context {
    authenticator: Authenticator
}

export const ConnectCtx = createContext<Context>({
    authenticator: new Authenticator()
})