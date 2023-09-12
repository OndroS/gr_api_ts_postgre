import { Router, Request, Response, NextFunction } from 'express'
import { models } from '../db'
import verify from '../middleware/verifyToken'
import { ensureAdmin, ensureUser } from '../middleware/ensureRole'
import { RequestWithUser } from '../types/auth'
import i18n from 'i18n'

const router: Router = Router()

const {
    User
} = models;

export default () => {
    // Get all users
    router.get('/', verify, ensureAdmin, async (_req: Request, res: Response, _next: NextFunction) => {
        try {
            const users = await User.findAll();
            return res.json(users);
        } catch (error) {
            _next(error);
        }
    });

    // Get user detail
    router.get('/:id', verify, ensureAdmin, async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id);
            return res.json(user);
        } catch (error) {
            _next(error);
        }
    });

    // Update a user
    router.put('/:id', verify, ensureAdmin, async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { id } = req.params;
            await User.update(req.body, { where: { id } });
            return res.json({ message: i18n.__('user_updated') });
        } catch (error) {
            _next(error);
        }
    });

    // Get all users (id, nickName)
    router.get('/users/all', verify, ensureUser, async (_req: Request, res: Response, _next: NextFunction) => {
        try {
            const users = await User.findAll({
                attributes: ['id', 'nickName']
            });
            return res.json(users);
        } catch (error) {
            _next(error);
        }
    });

    // Get own profile data
    router.get('/user/profile', verify, ensureUser, async (req: RequestWithUser, res: Response, _next: NextFunction) => {
        try {
            const user = await User.findByPk(req.user!.id, {
                attributes: ['name', 'surname', 'age', 'nickName']
            });
            return res.json(user);
        } catch (error) {
            _next(error);
        }
    });

    return router;
}
