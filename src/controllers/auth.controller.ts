import { Request, Response, NextFunction } from 'express';
import { registerNewUser } from '../services/auth.service';
import i18n from 'i18n';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await registerNewUser(req.body);
        return res.status(201).json({
            message: i18n.__('registration_success'),
            userId: user.id
        });
    } catch (error) {
        next(error);
    }
};