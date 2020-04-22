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
