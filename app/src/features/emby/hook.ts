import { useContext, useCallback, useEffect, useState } from 'react';
import { EmbyCtx } from './embyCtx';

export function useIsAuthenticated() {
    const { authenticator } = useContext(EmbyCtx);
    const [state, setState] = useState<boolean>(authenticator.isLogin());

    const login = useCallback(evt => setState(evt.status), []);

    useEffect(() => {
        authenticator.on('login:update', login);
        return () => {
            authenticator.off('login:update', login);
        };
    }, [authenticator, login]);

    return state;
}

export interface UserInfo {
    username: string
}

export function useUserInfo(): UserInfo | null {
    const isLogin = useIsAuthenticated();
    const { authenticator } = useContext(EmbyCtx);

    if (!isLogin) {
        return null
    }
    const username = authenticator.getUsername();
    if (!username) {
        return null;
    }
    return { username };
}
