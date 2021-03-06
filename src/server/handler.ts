import { Server, Socket } from 'socket.io';
import { Pool } from '../pool';
import { errorToInterface, InvalidArgE } from './error';

export class Handler {
    private io: Server;
    private pool: Pool;

    constructor(io: Server, pool: Pool) {
        this.io = io;
        this.pool = pool;
    }

    handle() {
        this.io.on('connection', socket => {
            this.pool.addUser(socket);

            socket.on('latency', this.handlePing(socket));

            socket.on('user:name', this.handleSetUserName(socket));

            socket.on('room:create', this.handleCreateRoom(socket));
            socket.on('room:join', this.handleJoinRoom(socket));
            socket.on('room:leave', this.handleLeaveRoom(socket));
            socket.on('room:list', this.handleListUser(socket));
            socket.on('room:chat', this.handleChat(socket));
            socket.on('room:play', this.handlePlay(socket));

            socket.on('play:loaded', this.handleItemLoaded(socket));
            socket.on('play:start', this.handlePlayStart(socket));
            socket.on('play:report', this.handlePlayReport(socket));
            socket.on('play:stop', this.handlePlayStop(socket));
            socket.on('play:pause', this.handlePlayPause(socket, false));
            socket.on('play:unpause', this.handlePlayPause(socket, true))

            socket.on('disconnect', () => {
                this.pool.delUser(socket.id);
            })
        });
    }

    handlePing(socket: Socket) {
        return () => {
            socket.emit('latency', {status: true});
        }
    }

    handleSetUserName(socket: Socket) {
        return msg => {
            if (!msg.username) {
                return socket.emit('user:name', InvalidArgE)
            }
            try {
                this.pool.setUserName(socket.id, msg.username)
            } catch (e) {
                return socket.emit('user:name', errorToInterface(e))
            }
            return socket.emit('user:name', {status: true});
        }
    }

    handleCreateRoom(socket: Socket) {
        return msg => {
            if (!msg.room_name) {
                return socket.emit('room:create', InvalidArgE)
            }
            try {
                this.pool.createRoom(socket.id, msg.room_name, msg.room_password)
            } catch (e) {
                return socket.emit('room:create', errorToInterface(e))
            }
            return socket.emit('room:create', {status: true, room_name: msg.room_name});
        };
    }

    handleJoinRoom(socket: Socket) {
        return msg => {
            if (!msg.room_name) {
                return socket.emit('room:join', InvalidArgE)
            }
            try {
                this.pool.joinRoom(socket.id, msg.room_name, msg.room_password)
            } catch (e) {
                return socket.emit('room:join', errorToInterface(e))
            }
            return socket.emit('room:join', {status: true, room_name: msg.room_name});
        };
    }

    handleLeaveRoom(socket: Socket) {
        return () => {
            try {
                this.pool.leaveRoom(socket.id);
            } catch (e) {
                return socket.emit('room:leave', errorToInterface(e))
            }
            return socket.emit('room:leave', {status: true});
        };
    }

    handleListUser(socket: Socket) {
        return () => {
            this.pool.listRoom(socket.id)
                .then(userList => socket.emit('room:list', {status:true, data: {users: userList}}))
                .catch(err => socket.emit('room:list', errorToInterface(err)))
        };
    }

    handleChat(socket: Socket) {
        return msg => {
            if (!msg.message || msg.message.length > 512) {
                return socket.emit('room:chat', InvalidArgE)
            }
            try {
                this.pool.sendMessage(socket.id, msg.message);
            } catch (e) {
                return socket.emit('room:chat', errorToInterface(e));
            }
            return socket.emit('room:chat', {status: true});
        };
    }

    handlePlay(socket: Socket) {
        return msg => {
            if (!msg.server_id || !msg.item_id) {
                return socket.emit('room:play', InvalidArgE)
            }
            this.pool.startPlayItem(socket.id, msg)
                .then(nbUser => socket.emit('room:play', {status: true, data: {user_to_wait: nbUser}}))
                .catch(e => socket.emit('room:play', errorToInterface(e)));
        }
    }

    handleItemLoaded(socket: Socket) {
        return () => {
            try {
                this.pool.notifyItemLoaded(socket.id);
            } catch (e) {
                return socket.emit('play:loaded', errorToInterface(e));
            }
            return socket.emit('play:loaded', {status: true});
        }
    }

    handlePlayStart(socket: Socket) {
        return () => {
            try {
                this.pool.playStarted(socket.id);
            } catch (e) {
                return socket.emit('play:start', errorToInterface(e));
            }
            return socket.emit('play:start', {status: true});
        }
    }

    handlePlayReport(socket: Socket) {
        return msg => {
            try {
                this.pool.playReported(socket.id, msg);
            } catch (e) {
                return socket.emit('play:report', errorToInterface(e));
            }
            return socket.emit('play:report', {status: true})
        }
    }

    handlePlayStop(socket: Socket) {
        return () => {
            try {
                this.pool.playStopped(socket.id);
            } catch (e) {
                return socket.emit('play:stop', errorToInterface(e));
            }
            return socket.emit('play:stop', {status: true});
        }
    }

    handlePlayPause(socket: Socket, state: boolean) {
        return () => {
            try {
                this.pool.pauseUnpause(socket.id, state);
            } catch (e) {
                return socket.emit(state ? 'play:unpause' : 'play:pause', errorToInterface(e));
            }
            return socket.emit(state ? 'play:unpause' : 'play:pause', {status: true});
        };
    }
}
