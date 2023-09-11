import { Request } from 'express';

export interface UserPayload {
    id: number;
    username: string;
    role: string;
    // ... other properties
}

export interface RequestWithUser extends Request {
    user?: UserPayload;
}