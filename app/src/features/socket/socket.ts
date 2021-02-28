import io from 'socket.io-client';
import { notification } from 'antd';
import { CancelablePromise } from '../../utils';
import {
    CreateRoomRequest,
    JoinRoomRequest,
    PlayItemI,
    ProgressReportI,
    Response,
    ResponseWithData,
    UserInRoomI
} from './interface';

export class Socket {
    private readonly socket: SocketIOClient.Socket;
    private roomName?: string;
    private username?: string;
    private isMaster?: boolean;

    constructor() {
        this.socket = io.connect('http://localhost:3001');
        this.roomName = undefined;
        this.isMaster = undefined;

        this.socket.on('connect', () => {
            if (this.username) {
                this.setUsername(this.username)
                    .catch(() => notification.error({
                        message: 'Could not set your username',
                    }));
            }
        });
        this.socket.on('disconnect', () => {
            this.roomName = undefined;
        });

    }

    private async waitForConnection() {
        return new Promise(resolve => {
            if (this.socket.connected) {
                return resolve();
            }
            this.socket.connect();
            this.socket.once('connect', () => {
                resolve();
            })
        })
    }

    ping(): CancelablePromise<number> {
        return new CancelablePromise<number>(async (resolve) => {
            await this.waitForConnection();
            const startTest = new Date().getTime();
            this.socket.once('latency', () => {
                resolve(new Date().getTime() - startTest);
            });
            this.socket.emit('latency');
        });
    }

    async setUsername(username: string): Promise<Response> {
        await this.waitForConnection();
        return new Promise<Response>((resolve, reject) => {
            this.socket.once('user:name', (resp: Response) => {
                if (resp.status) {
                    this.username = username;
                    return resolve(resp);
                }
                return reject(resp);
            });
            this.socket.emit('user:name', {username});
        });
    }

    async createRoom(req: CreateRoomRequest): Promise<Response> {
        await this.waitForConnection();
        return new Promise<Response>((resolve, reject) => {
            this.socket.once('room:create', (resp: Response) => {
                if (resp.status) {
                    this.roomName = req.room_name;
                    this.isMaster = true;
                    return resolve(resp);
                }
                return reject(resp);
            });
            this.socket.emit('room:create', req);
        });
    }

    async leaveRoom(): Promise<Response> {
        await this.waitForConnection();
        return new Promise<Response>((resolve, reject) => {
            this.socket.once('room:leave', (resp: Response) => {
                if (resp.status) {
                    this.roomName = undefined;
                    this.isMaster = undefined;
                    return resolve(resp);
                }
                return reject(resp);
            });
            this.socket.emit('room:leave');
        });
    }

    async joinRoom(req: JoinRoomRequest): Promise<Response> {
        await this.waitForConnection();
        return new Promise<Response>((resolve, reject) => {
            this.socket.once('room:join', (resp: Response) => {
                if (resp.status) {
                    this.roomName = req.room_name;
                    this.isMaster = false;
                    return resolve(resp);
                }
                return reject(resp);
            });
            this.socket.emit('room:join', req);
        });
    }

    async listUserInRoom(): Promise<ResponseWithData<UserInRoomI>> {
        await this.waitForConnection();
        return new Promise((resolve, reject) => {
            this.socket.once('room:list', (resp: ResponseWithData<UserInRoomI>) => {
                if (resp.status) {
                    return resolve(resp);
                }
                return reject(resp);
            });
            this.socket.emit('room:list');
        });
    }

    async sendMessage(message: string): Promise<Response> {
        await this.waitForConnection();
        return new Promise((resolve, reject) => {
            this.socket.once('room:chat', (resp: Response) => {
                if (resp.status) {
                    return resolve(resp);
                }
                return reject(resp);
            });
            this.socket.emit('room:chat', {message});
        });
    }

    async playItem(serverId: string, itemId: string, itemName: string): Promise<ResponseWithData<PlayItemI>> {
        await this.waitForConnection();
        return new Promise((resolve, reject) => {
            this.socket.once('room:play', (resp: ResponseWithData<PlayItemI>) => {
                if (resp.status) {
                    return resolve(resp);
                }
                return reject(resp);
            });
            this.socket.emit('room:play', {server_id: serverId, item_id: itemId, item_name: itemName});
        });
    }

    async playStarted(): Promise<Response> {
        await this.waitForConnection();
        return new Promise((resolve, reject) => {
            this.socket.once('play:start', (resp: Response) => {
                if (resp.status) {
                    return resolve(resp);
                }
                return reject(resp);
            });
            this.socket.emit('play:start');
        });
    }

    async reportProgress(videoElem: HTMLVideoElement): Promise<Response> {
        await this.waitForConnection();
        const reportMsg: ProgressReportI = {
            isMuted: videoElem.muted,
            isPaused: videoElem.paused,
            positionTicks: Math.round(videoElem.currentTime * 1000),
            volumeLevel: Math.round(videoElem.volume * 100),
        };
        return new Promise((resolve, reject) => {
           this.socket.once('play:report', (resp: Response) => {
               if (resp.status) {
                   return resolve(resp);
               }
               return reject(resp);
           });
           this.socket.emit('play:report', reportMsg);
        });
    }

    getCurrentRoom(): string | undefined {
        return this.roomName;
    }

    getIsMaster(): boolean | undefined {
        return this.isMaster;
    }

    setCurrentRoom(roomName: string | undefined) {
        this.roomName = roomName;
    }

    getSocket(): SocketIOClient.Socket {
        return this.socket;
    }
}
