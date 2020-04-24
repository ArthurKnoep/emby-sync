import io from 'socket.io-client';
import { notification } from 'antd';
import { CancelablePromise } from '../../utils';
import { CreateRoomRequest, JoinRoomRequest, Response } from './interface';

export class Socket {
    private readonly socket: SocketIOClient.Socket;
    private roomName?: string;
    private username?: string;

    constructor() {
        this.socket = io.connect('http://localhost:3001');
        this.roomName = undefined;

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
        })
    }

    async createRoom(req: CreateRoomRequest): Promise<Response> {
        await this.waitForConnection();
        return new Promise<Response>((resolve, reject) => {
            this.socket.once('room:create', (resp: Response) => {
                if (resp.status) {
                    this.roomName = req.room_name;
                    return resolve(resp);
                }
                return reject(resp);
            });
            this.socket.emit('room:create', req);
        })
    }

    async leaveRoom(): Promise<Response> {
        await this.waitForConnection();
        return new Promise<Response>((resolve, reject) => {
            this.socket.once('room:leave', (resp: Response) => {
                if (resp.status) {
                    this.roomName = undefined;
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
                    return resolve(resp);
                }
                return reject(resp);
            });
            this.socket.emit('room:join', req);
        })
    }

    getCurrentRoom(): string | undefined {
        return this.roomName;
    }

    getSocket(): SocketIOClient.Socket {
        return this.socket;
    }
}
