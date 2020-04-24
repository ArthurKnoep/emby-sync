export class PoolError extends Error {
    constructor(msg: string) {
        super();
        this.name = "PoolError";
        this.message = msg;
    }
}

export class UserNotFoundError extends PoolError {
    constructor() {
        super("The user could not be found");
        this.name = "UserNotFound";
    }
}

export class UsernameNotSetError extends PoolError {
    constructor() {
        super("The user name hasn't been set, use user:name before");
        this.name = "UsernameNotSet";
    }
}

export class UserAlreadyInRoomError extends PoolError {
    constructor() {
        super("User is already in a room, please leave before");
        this.name = "UserAlreadyInRoom";
    }
}

export class RoomNotFoundError extends PoolError {
    constructor() {
        super("The room could not be found");
        this.name = "RoomNotFound";
    }
}

export class RoomAlreadyExistError extends PoolError {
    constructor() {
        super("The room already exist");
        this.name = "RoomAlreadyExist";
    }
}

export class RoomBadPasswordError extends PoolError {
    constructor() {
        super("Bad room password");
        this.name = "RoomBadPassword";
    }
}

export class NotInARoomError extends PoolError {
    constructor() {
        super("The user is not in a room");
        this.name = "NotInARoom";
    }
}
