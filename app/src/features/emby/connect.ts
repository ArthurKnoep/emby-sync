import axios from 'axios';
import { EventEmitter } from 'events';
import { APPLICATION_NAME } from './emby';
import { LoginInfoI, ServerI } from './interface';

const EMBY_SYNC_LOGIN_INFO = 'emby_sync_login_info';

export class Authenticator extends EventEmitter {
    private loginInfo: LoginInfoI | null;

    constructor() {
        super();
        this.loginInfo = null;
        const loginInfo = window.localStorage.getItem(EMBY_SYNC_LOGIN_INFO);
        if (loginInfo !== null) {
            try {
                this.loginInfo = JSON.parse(loginInfo);
            } catch (e) {
                console.warn('Invalid login info');
                window.localStorage.removeItem(EMBY_SYNC_LOGIN_INFO);
            }
        }
    }

    async connect(username: string, password: string): Promise<LoginInfoI> {
        const bodyFormData = new FormData();
        bodyFormData.set('nameOrEmail', username);
        bodyFormData.set('rawpw', password);
        return axios.post('https://connect.emby.media/service/user/authenticate', bodyFormData, {
            headers: {
                'X-Application': APPLICATION_NAME
            }
        })
            .then(resp => {
                this.emit('login:update', {status: true});
                this.loginInfo = resp.data;
                window.localStorage.setItem(EMBY_SYNC_LOGIN_INFO, JSON.stringify(resp.data));
                return (resp.data as LoginInfoI);
            })
    }

    async listServer(): Promise<ServerI[]> {
        if (!this.isLogin()) {
            return Promise.reject(new Error('Not authenticated'));
        }
        return axios.get('https://connect.emby.media/service/servers', {
            params: {
                'userId': this.loginInfo?.User.Id
            },
            headers: {
                'X-Application': APPLICATION_NAME,
                'X-Connect-UserToken': this.loginInfo?.AccessToken
            }
        })
            .then(resp => (resp.data as ServerI[]))
    }

    isLogin(): boolean {
        return (!!this.loginInfo && !!this.loginInfo.AccessToken);
    }

    logout() {
        window.localStorage.removeItem(EMBY_SYNC_LOGIN_INFO);
        this.emit('login:update', {status: false});
    }
}