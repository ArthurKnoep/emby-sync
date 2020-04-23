import { PoolError } from '../pool';

export interface ErrI {
    status: false;
    code: string;
    message: string;
}

export const InvalidArgE: ErrI = {
    status: false,
    code: "InvalidArg",
    message: "Invalid argument"
};

export function errorToInterface(err: Error): ErrI {
    if (err.name && err.message) {
        return {
            status: false,
            code: err.name,
            message: err.message
        };
    }
    return {
        status: false,
        code: "UnkError",
        message: "Unknown error"
    }
}
