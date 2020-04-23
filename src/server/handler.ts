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

            socket.on('ping', this.handlePing(socket));

            socket.on('room:create', this.handleCreateRoom(socket));
            socket.on('room:join', this.handleJoinRoom(socket));
            socket.on('room:leave', this.handleLeaveRoom(socket));

            socket.on('disconnect', () => {
                this.pool.delUser(socket.id);
            })
        });
    }

    handlePing(socket: Socket) {
        return () => {
            socket.emit('pong', {status: true});
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
            return socket.emit('room:create', {status: true});
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
            return socket.emit('room:join', {status: true});
        };
    }

    handleLeaveRoom(socket: Socket) {
        return () => {
            try {
                this.pool.leaveRoom(socket.id)
            } catch (e) {
                return socket.emit('room:leave', errorToInterface(e))
            }
            return socket.emit('room:leave', {status: true});
        };
    }
}
