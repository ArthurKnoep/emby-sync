import { useContext, useCallback, useEffect, useState } from 'react';
import { ConnectCtx } from './connectCtx';

export function useIsAuthenticated() {
    const { authenticator } = useContext(ConnectCtx);
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