import { Server, Socket } from 'socket.io'
import {
    RoomAlreadyExistError,
    RoomBadPasswordError,
    RoomNotFoundError,
    UserAlreadyInRoomError, UsernameNotSetError,
    UserNotFoundError
} from './error';

interface UserI {
    socket: Socket
    connexionDate: Date
    username?: string
    currentRoom: string
}

interface RoomI {
    name: string
    needPassword: boolean
    password: string
}

interface PoolI {
    users: {[index: string]: UserI}
    rooms: {[index: string]: RoomI}
}

export class Pool {
    private readonly pool: PoolI;
    private readonly io: Server;

    constructor(io: Server) {
        this.io = io;
        this.pool = {
            users: {},
            rooms: {}
        };
        setInterval(() => {
            console.log(this.pool);
        }, 2000);
    }

    addUser(socket: Socket) {
        this.pool.users[socket.id] = {
            socket,
            connexionDate: new Date(),
            currentRoom: ''
        };
    }

    delUser(userId: string) {
        const user = this.getUser(userId);
        if (user && user.currentRoom) {
            this.leaveRoom(userId);
        }
        delete this.pool.users[userId];
    }

    private getUser(userId: string): UserI | undefined {
        return this.pool.users[userId];
    }

    private getUserAndThrow(userId: string): UserI {
        const user = this.getUser(userId);
        if (!user) {
            throw new UserNotFoundError();
        }
        if (!user.username) {
            throw new UsernameNotSetError();
        }
        return user;
    }

    private getRoom(roomName: string): RoomI | undefined {
        return this.pool.rooms[roomName];
    }

    setUserName(userId: string, username: string) {
        const user = this.getUser(userId);
        if (!user) {
            throw new UserNotFoundError();
        }
        user.username = username
    }

    createRoom(userId: string, roomName: string, password?: string) {
        const user = this.getUserAndThrow(userId);
        if (user.currentRoom) {
            throw new UserAlreadyInRoomError();
        }
        if (this.getRoom(roomName)) {
            throw new RoomAlreadyExistError();
        }
        const room: RoomI = {
            name: roomName,
            needPassword: false,
            password: ""
        };
        if (password && password !== '') {
            room.needPassword = true;
            room.password = password;
        }
        user.currentRoom = roomName;
        user.socket.join(roomName);
        this.pool.rooms[roomName] = room;
        return null;
    }

    joinRoom(userId: string, roomName: string, password?: string) {
        const user = this.getUserAndThrow(userId);
        if (user.currentRoom) {
            throw new UserAlreadyInRoomError();
        }
        const room = this.getRoom(roomName);
        if (!room) {
            throw new RoomNotFoundError();
        }
        if (room.needPassword && (!password || password !== room.password)) {
            throw new RoomBadPasswordError();
        }
        user.currentRoom = roomName;
        user.socket.join(roomName);
    }

    leaveRoom(userId: string) {
        const user = this.getUserAndThrow(userId);
        if (!user.username) {
            throw new UsernameNotSetError();
        }
        if (!user.currentRoom) {
            return;
        }
        const roomName = user.currentRoom;
        user.currentRoom = '';
        user.socket.leave(roomName, () => {
            this.io.in(roomName).clients((err, users) => {
                console.log(err, users);
                if (!err && users.length === 0) {
                    delete this.pool.rooms[roomName];
                }
            });

        });
    }
}
