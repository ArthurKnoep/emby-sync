import axios from 'axios';
import path from 'path';
import { EventEmitter } from 'events';
import { Device } from './device';
import { APPLICATION_NAME, APPLICATION_VERSION, Emby } from './emby';
import { ExchangeI, LoginInfoI, PingServerI, ServerI } from './interface';

const EMBY_SYNC_LOGIN_INFO = 'emby_sync_login_info';

export class Authenticator extends EventEmitter {
    private loginInfo: LoginInfoI | null;
    private device: Device;
    private emby: Emby | null;

    constructor() {
        super();
        this.loginInfo = null;
        this.emby = null;
        this.device = new Device();
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
                'X-Application': `${APPLICATION_NAME}/${APPLICATION_VERSION}`
            }
        })
            .then(resp => {
                this.loginInfo = (resp.data as LoginInfoI);
                window.localStorage.setItem(EMBY_SYNC_LOGIN_INFO, JSON.stringify(resp.data));
                this.emit('login:update', {status: true});
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
                'X-Application': `${APPLICATION_NAME}/${APPLICATION_VERSION}`,
                'X-Connect-UserToken': this.loginInfo?.AccessToken
            }
        })
            .then(resp => (resp.data as ServerI[]))
    }

    async pingServer(server: ServerI): Promise<PingServerI> {
        const url = new URL(server.Url);
        url.pathname = path.join(url.pathname, "/emby/system/info/public");
        return axios.get(url.toString()).then(resp => resp.data);
    }

    async exchangeToken(server: ServerI): Promise<ExchangeI> {
        const url = new URL(server.Url);
        url.pathname = path.join(url.pathname, "/emby/Connect/Exchange");
        return axios.get(url.toString(), {
            params: {
                format: 'json',
                ConnectUserId: this.loginInfo?.User.Id
            },
            headers: {
                'X-Emby-Client': APPLICATION_NAME,
                'X-Emby-Client-Version': APPLICATION_VERSION,
                'X-Emby-Device-Id': this.device.getDeviceId(),
                'X-Emby-Device-Name': this.device.getDeviceName(),
                'X-Emby-Token': server.AccessKey
            }
        }).then(resp => {
            this.emby = new Emby(server.Url, resp.data.AccessToken, resp.data.LocalUserId, server.Name);
            return resp.data;
        });
    }

    getEmby(): Emby {
        if (this.emby === null) {
            throw new Error("Not authenticated");
        }
        return this.emby;
    }

    isLogin(): boolean {
        return (!!this.loginInfo && !!this.loginInfo.AccessToken);
    }

    getUsername(): string | null {
        if (!this.loginInfo) {
            return null;
        }
        return this.loginInfo.User.DisplayName;
    }

    leaveServer() {
        this.emby = null;
    }

    logout() {
        window.localStorage.removeItem(EMBY_SYNC_LOGIN_INFO);
        this.loginInfo = null;
        this.emby = null;
        this.emit('login:update', {status: false});
    }
}
