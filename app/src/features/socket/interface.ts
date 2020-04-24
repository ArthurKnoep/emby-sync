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
