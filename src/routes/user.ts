import { Router, Request, Response, NextFunction } from 'express'
import { models } from '../db'
import verify from '../middleware/verifyToken'
import { ensureAdmin, ensureUser } from '../middleware/ensureRole'
import { RequestWithUser } from '../types/auth'

const router: Router = Router()

const {
    User
} = models;

export default () => {
    // Get all users
    router.get('/users', verify, ensureAdmin, async (_req: Request, res: Response) => {
        const users = await User.findAll();
        return res.json(users);
    });

    // Get user detail
    router.get('/users/:id', verify, ensureAdmin, async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = await User.findByPk(id);
        return res.json(user);
    });

    // Update a user
    router.put('/users/:id', verify, ensureAdmin, async (req: Request, res: Response) => {
        const { id } = req.params;
        await User.update(req.body, { where: { id } });
        return res.json({ message: 'User updated' });
    });

    // Get all users (id, nickName)
    router.get('/all', verify, ensureUser, async (_req: Request, res: Response) => {
        const users = await User.findAll({
            attributes: ['id', 'nickName']
        });
        return res.json(users);
    });

    // Get own profile data
    router.get('/profile', verify, ensureUser, async (req: RequestWithUser, res: Response) => {
        const user = await User.findByPk(req.user!.id, {
            attributes: ['name', 'surname', 'age', 'nickName']
        });
        return res.json(user);
    });

    return router;
}
