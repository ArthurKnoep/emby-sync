import React, { ReactNode } from 'react';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';
import { useIsAuthenticated } from '../../features/emby/hook';
import { Login } from '../Login';
import { Home } from '../Home/Home';

enum AuthState {
    AUTH = 0b01,
    NOT_AUTH = 0b10
}

interface RouteI {
    path: string;
    auth: AuthState;
    shouldRedirectAfterLogin?: boolean;
    component: ReactNode;
}

const routes: RouteI[] = [
    {
        path: '/',
        auth: AuthState.AUTH,
        shouldRedirectAfterLogin: true,
        component: <Home />
    },
    {
        path: '/login',
        auth: AuthState.NOT_AUTH,
        component: <Login />
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
    const authState = isLogin ? AuthState.AUTH : AuthState.NOT_AUTH;
    return (
        <BrowserRouter>
            <Switch>
                {
                    routes.map(route => (
                        <Route key={route.path} exact path={route.path} component={() => {
                            if ((route.auth & authState) !== 0) {
                                return <>{route.component}</>;
                                //@ts-ignore
                            } else if (authState === AuthState.NOT_AUTH) {
                                return <Redirect key={route.path} to={(route.shouldRedirectAfterLogin) ? `/login?redirect_to=${encodeURIComponent(route.path)}` : '/login'} />;
                            }
                            return <DefaultRedirect authState={authState} />;
                        }} />
                    ))
                }
                <DefaultRedirect authState={authState} />
            </Switch>
        </BrowserRouter>
    )
}