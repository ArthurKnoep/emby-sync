import { createContext } from 'react';
import { Menubar } from './menubar';

interface Context {
    menubarController: Menubar
}

export const defaultValue: Context = {
    menubarController: new Menubar(),
};

export const MenubarCtx = createContext<Context>(defaultValue);
