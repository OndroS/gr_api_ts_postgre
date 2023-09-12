import { Request } from 'express';

export interface UserPayload {
    id: number;
    username: string;
    role: string;
}

export interface RequestWithUser extends Request {
    user?: UserPayload;
}