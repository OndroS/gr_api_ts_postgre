import { Router, Request, Response, NextFunction } from 'express'
import { models } from '../db'
import verify from '../middleware/verifyToken'
import { ensureAdmin, ensureUser } from '../middleware/ensureRole'
import { RequestWithUser } from '../types/auth'

const router: Router = Router()

const {
    Exercise,
    Program,
	UserExercise
} = models;

export default () => {
    // Get all exercises
    router.get('/exercises', verify, ensureUser, async (_req: Request, res: Response) => {
        const exercises = await Exercise.findAll({
            include: [{
                model: Program,
                as: 'program'
            }]
        });

        return res.json({
            data: exercises,
            message: 'List of exercises'
        });
    });

    // Create an exercise
    router.post('/exercises', verify, ensureAdmin, async (req: Request, res: Response) => {
        const exercise = await Exercise.create(req.body);
        return res.json(exercise);
    });

    // Update an exercise
    router.put('/exercises/:id', verify, ensureAdmin, async (req: Request, res: Response) => {
        const { id } = req.params;
        await Exercise.update(req.body, { where: { id } });
        return res.json({ message: 'Exercise updated' });
    });

    // Delete an exercise
    router.delete('/exercises/:id', verify, ensureAdmin, async (req: Request, res: Response) => {
        const { id } = req.params;
        await Exercise.destroy({ where: { id } });
        return res.json({ message: 'Exercise deleted' });
    });

	// Track exercises completed
    router.post('/track-exercise', verify, ensureUser, async (req: RequestWithUser, res: Response) => {
        const { exerciseId, duration } = req.body;
        const completedExercise = await UserExercise.create({
            userId: req.user!.id,
            exerciseId,
            duration,
            datetime: new Date()
        });
        return res.json(completedExercise);
    });

    // See list of completed exercises in profile
    router.get('/completed-exercises', verify, ensureUser, async (req: RequestWithUser, res: Response) => {
        const completedExercises = await UserExercise.findAll({
            where: { userId: req.user!.id },
            include: [Exercise]
        });
        return res.json(completedExercises);
    });

    // Remove tracked exercise from completed exercises list
    router.delete('/completed-exercises/:id', verify, ensureUser, async (req: RequestWithUser, res: Response) => {
        const { id } = req.params;
        await UserExercise.destroy({ where: { id, userId: req.user!.id } });
        return res.json({ message: 'Exercise removed from completed list' });
    });

    return router;
}
