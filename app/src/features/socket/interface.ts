export interface Response {
    status: boolean
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
        room_name: string
    }
}

export interface UserInRoomI {
    status: true
    users: [{
        username: string
        uuid: string
    }]
}
