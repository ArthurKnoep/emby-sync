import React, { ReactNode, useContext, useEffect } from 'react';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';
import { useIsAuthenticated, useUserInfo } from '../../features/emby/hook';
import { Layout } from '../Layout';
import { Login } from '../Login';
import { Home } from '../Home';
import { Logout } from '../Logout';
import { Rooms } from "../Rooms";
import { Servers } from "../Servers";
import { SocketCtx } from '../../features/socket';
import { Server } from '../Server';
import { Player } from '../Player';

enum AuthState {
    AUTH = 0b01,
    NOT_AUTH = 0b10
}

interface RouteI {
    key: string;
    path: string | string[];
    auth: AuthState;
    shouldRedirectAfterLogin?: boolean;
    component: ReactNode;
}

const routes: RouteI[] = [
    {
        key: 'home',
        path: '/',
        auth: AuthState.AUTH,
        shouldRedirectAfterLogin: false,
        component: <Home />
    },
    {
        key: 'rooms',
        path: '/rooms',
        auth: AuthState.AUTH,
        shouldRedirectAfterLogin: true,
        component: <Rooms />
    },
    {
        key: 'servers',
        path: '/servers',
        auth: AuthState.AUTH,
        shouldRedirectAfterLogin: true,
        component: <Servers />
    },
    {
        key: 'server',
        path: '/servers/:serverId',
        auth: AuthState.AUTH,
        shouldRedirectAfterLogin: true,
        component: <Server />
    },
    {
        key: 'play',
        path: '/servers/:serverId/items/:itemId/play',
        auth: AuthState.AUTH,
        shouldRedirectAfterLogin: true,
        component: <Player />
    },
    {
        key: 'login',
        path: '/login',
        auth: AuthState.NOT_AUTH,
        component: <Login />
    },
    {
        key: 'logout',
        path: '/logout',
        auth: AuthState.AUTH | AuthState.NOT_AUTH,
        component: <Logout />
    }
];

interface DefaultRedirectProps {
    authState: AuthState
}

function DefaultRedirect({ authState }: DefaultRedirectProps) {
    return <Redirect to={authState === AuthState.NOT_AUTH ? '/login' : '/'} />;
}

export function Router() {
    const isLogin = useIsAuthenticated();
    const userInfo = useUserInfo();
    const { socket } = useContext(SocketCtx);
    const authState = isLogin ? AuthState.AUTH : AuthState.NOT_AUTH;

    const getRedirectTo = (path: string | string[]): string => {
        if (Array.isArray(path)) {
            return encodeURIComponent(path[0]);
        } else {
            return encodeURIComponent(path);
        }
    };

    useEffect(() => {
        if (isLogin && userInfo) {
            socket.setUsername(userInfo.username)
                .catch(err => {
                    console.error(err);
                })
        }
    }, [isLogin, userInfo, socket]);

    return (
        <BrowserRouter>
            <Layout isAuthenticated={isLogin}>
                <Switch>
                    {
                        routes.map(route => (
                            <Route key={route.key} exact path={route.path} component={() => {
                                if ((route.auth & authState) !== 0) {
                                    return <>{route.component}</>;
                                    //@ts-ignore
                                } else if (authState === AuthState.NOT_AUTH) {
                                    return <Redirect to={(route.shouldRedirectAfterLogin) ? `/login?redirect_to=${getRedirectTo(route.path)}` : '/login'} />;
                                }
                                return <DefaultRedirect authState={authState} />;
                            }} />
                        ))
                    }
                    <DefaultRedirect authState={authState} />
                </Switch>
            </Layout>
        </BrowserRouter>
    )
}
