import { UserPayload, RequestWithUser } from '../types/auth';
import { Request as ExpressRequest, Response, NextFunction } from 'express';

export function ensureAdmin(req: RequestWithUser, res: Response, next: NextFunction) {
    const user = req.user;

    if (!user || user.role !== 'ADMIN') { // Assuming role is part of the JWT payload
        return res.status(403).json({ message: 'Access forbidden: Admins only' });
    }

    next();
}

export function ensureUser(req: RequestWithUser, res: Response, next: NextFunction) {
    const user = req.user;

    if (!user || (user.role !== 'USER' && user.role !== 'ADMIN')) {
        return res.status(403).json({ message: 'Access forbidden: Users or Admins only' });
    }

    next();
}