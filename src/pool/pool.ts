import { Server, Socket } from 'socket.io'
import { v4 as uuid} from 'uuid';
import {
    IsRoomMaster,
    NotInARoomError, NotRoomMaster, PoolError,
    RoomAlreadyExistError,
    RoomBadPasswordError,
    RoomNotFoundError,
    UserAlreadyInRoomError, UsernameNotSetError,
    UserNotFoundError
} from './error';

enum RoomState {
    IDLE,
    WAIT_SYNC,
    PLAYING,
}

enum UserState {
    IDLE,
    PLAY,
}

interface UserI {
    socket: Socket
    connexionDate: Date
    username?: string
    uuid: string
    currentRoom: string,
    state: UserState,
    lastReport?: {
        date: Date,
        data: ProgressI,
    },
}

interface RoomI {
    name: string
    needPassword: boolean
    password: string
    admin_user_id: string
    state: RoomState
    itemName: string
}

interface PoolI {
    users: {[index: string]: UserI}
    rooms: {[index: string]: RoomI}
}

interface UserInRoom {
    username: string;
    uuid: string;
    is_admin: boolean;
}

interface Item {
    server_id: string;
    item_id: string;
    item_name: string;
}

interface ProgressI {
    positionTicks: number;
    isMuted: boolean;
    isPaused: boolean;
    volumeLevel: number;
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
            uuid: uuid(),
            connexionDate: new Date(),
            currentRoom: '',
            state: UserState.IDLE,
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
            password: "",
            admin_user_id: user.socket.id,
            state: RoomState.IDLE,
            itemName: "",
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
        user.socket.broadcast.to(roomName).emit('room:update', {
            type: 'join',
            data: {
                username: user.username,
                uuid: user.uuid
            }
        });
    }

    leaveRoom(userId: string) {
        const user = this.getUserAndThrow(userId);
        if (!user.currentRoom) {
            return;
        }
        const roomName = user.currentRoom;
        user.currentRoom = '';
        user.socket.broadcast.to(roomName).emit('room:update', {
            type: 'leave',
            data: {
                username: user.username,
                uuid: user.uuid
            }
        });
        user.socket.leave(roomName, () => {
            this.io.in(roomName).clients((err, users) => {
                if (!err && users.length === 0) {
                    delete this.pool.rooms[roomName];
                }
            });
        });
    }

    async listRoom(userId: string): Promise<UserInRoom[]> {
        return new Promise((resolve, reject) => {
            const user = this.getUserAndThrow(userId);
            if (!user.currentRoom) {
                return reject(new NotInARoomError());
            }
            const room = this.getRoom(user.currentRoom);
            if (!room) {
                return reject(new RoomNotFoundError());
            }
            const roomName = user.currentRoom;
            this.io.in(roomName).clients((err, users) => {
                if (err) {
                    return reject(new PoolError("Could not list users in room"))
                }
                const usersProm: UserInRoom[] = [];
                users.forEach(elem => {
                    const user = this.getUser(elem);
                    if (user) {
                        usersProm.push({
                            username: user.username,
                            uuid: user.uuid,
                            is_admin: user.socket.id === room.admin_user_id
                        });
                    }
                });
                resolve(usersProm);
            })
        });
    }

    sendMessage(userId: string, message: string) {
        const user = this.getUserAndThrow(userId);
        if (!user.currentRoom) {
            throw new NotInARoomError();
        }
        user.socket.broadcast.to(user.currentRoom).emit('room:message', {
            uuid: user.uuid,
            date: new Date(),
            username: user.username,
            message
        });
    }

    startPlayItem(userId: string, item: Item): Promise<number> {
        return new Promise((resolve, reject) => {
            const user = this.getUserAndThrow(userId);
            if (!user.currentRoom) {
                return reject(new NotInARoomError());
            }
            const room = this.getRoom(user.currentRoom);
            if (!room) {
                return reject(new RoomNotFoundError());
            }
            if (userId !== room.admin_user_id) {
                return reject(new NotRoomMaster());
            }
            room.state = RoomState.WAIT_SYNC;
            room.itemName = item.item_name;
            user.state = UserState.PLAY;
            user.lastReport = {
                date: new Date(),
                data: {
                    positionTicks: 0,
                    isMuted: false,
                    isPaused: true,
                    volumeLevel: 100,
                }
            }
            user.socket.broadcast.to(user.currentRoom).emit('room:onplay', item);
            this.io.in(room.name).clients((err, clients) => {
                if (err) {
                    return reject(new PoolError("Could not list users in room"))
                }
                let nbClient = 0;
                clients.forEach(client => {
                    if (client !== user.socket.id) {
                        nbClient += 1;
                    }
                });
                resolve(nbClient);
            });
        });
    }

    notifyItemLoaded(userId: string) {
        const user = this.getUserAndThrow(userId);
        if (!user.currentRoom) {
            throw new NotInARoomError();
        }
        const room = this.getRoom(user.currentRoom);
        if (!room) {
            throw new RoomNotFoundError();
        }
        if (userId === room.admin_user_id) {
            throw new IsRoomMaster();
        }
        const admin = this.getUserAndThrow(room.admin_user_id);
        admin.socket.emit('play:onloaded', {uuid: user.uuid, username: user.username});
    }

    playStarted(userId: string) {
        const user = this.getUserAndThrow(userId);
        if (!user.currentRoom) {
            throw new NotInARoomError();
        }
        const room = this.getRoom(user.currentRoom);
        if (!room) {
            throw new RoomNotFoundError();
        }
        if (userId !== room.admin_user_id) {
            throw new NotRoomMaster();
        }
        room.state = RoomState.PLAYING;
        user.lastReport = {
            date: new Date(),
            data: {
                positionTicks: 0,
                isMuted: false,
                isPaused: false,
                volumeLevel: 100,
            }
        }
        user.socket.broadcast.to(room.name).emit('play:started');
    }

    playReported(userId: string, report: ProgressI) {
        const user = this.getUserAndThrow(userId);
        if (!user.currentRoom) {
            throw new NotInARoomError();
        }
        user.state = UserState.PLAY;
        user.lastReport = {
            date: new Date(),
            data: report,
        };
    }

    playStopped(userId: string) {
        const user = this.getUserAndThrow(userId);
        if (!user.currentRoom) {
            throw new NotInARoomError();
        }
        const room = this.getRoom(user.currentRoom);
        if (!room) {
            throw new RoomNotFoundError();
        }
        user.state = UserState.IDLE;
        user.lastReport = undefined;
        if (userId === room.admin_user_id) {
            room.state = RoomState.IDLE;
            room.itemName = '';
            user.socket.broadcast.to(room.name).emit('play:stopped');
        }
    }

    pauseUnpause(userId: string, state: boolean) {
        const user = this.getUserAndThrow(userId);
        if (!user.currentRoom) {
            throw new NotInARoomError();
        }
        const room = this.getRoom(user.currentRoom);
        if (!room) {
            throw new RoomNotFoundError();
        }
        if (userId !== room.admin_user_id) {
            throw new NotRoomMaster();
        }
        user.socket.broadcast.to(room.name).emit(state ? 'play:unpaused' : 'play:paused')
    }
}
