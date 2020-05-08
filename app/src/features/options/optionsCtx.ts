import { createContext } from 'react';
import { Options } from './options';

interface Context {
    options: Options
}

export const defaultValue: Context = {
    options: new Options()
}

export const OptionsCtx = createContext<Context>(defaultValue);
