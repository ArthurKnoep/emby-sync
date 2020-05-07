import { createContext } from 'react';
import { Authenticator } from './connect';
import { PlayerContext } from './playerContext';

interface Context {
    authenticator: Authenticator
    playerContext: PlayerContext
}

export const EmbyCtx = createContext<Context>({
    authenticator: new Authenticator(),
    playerContext: new PlayerContext(),
});
