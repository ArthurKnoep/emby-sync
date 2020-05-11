export interface Response {
    status: boolean
}

export interface ResponseWithData<T> {
    status: boolean
    data: T
}

export interface CreateRoomRequest {
    room_name: string
    room_password?: string
}

export interface JoinRoomRequest {
    room_name: string
    room_password?: string
}

export interface RoomI {
    connected: boolean
    info?: {
        is_master: boolean
        room_name: string
    }
}

export interface UserInRoomI {
    users: [{
        username: string
        uuid: string
        is_admin: boolean
    }]
}

export interface Message {
    uuid: string;
    date: Date,
    username: string;
    message: string;
}

export interface PlayItemI {
    user_to_wait: number;
}

export interface OnLoadedI {
    uuid: string;
    username: string;
}
