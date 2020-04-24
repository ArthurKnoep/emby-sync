import { createContext } from 'react';
import { Socket } from './socket';

interface Context {
    socket: Socket
}

export const defaultValue: Context = {
    socket: new Socket(),
};

export const SocketCtx = createContext<Context>(defaultValue);
