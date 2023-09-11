import { Router, Request, Response, NextFunction } from 'express'
import { exerciseQueryValidationRules, validate } from '../validators/validationServices';
import { Op } from 'sequelize';
import { models } from '../db'
import verify from '../middleware/verifyToken'
import { ensureAdmin, ensureUser } from '../middleware/ensureRole'
import { RequestWithUser } from '../types/auth'
import i18n from 'i18n';

const router: Router = Router()

const {
    Exercise,
    Program,
	UserExercise
} = models;

export default () => {
    // Get all exercises
    router.get('/exercises', exerciseQueryValidationRules(), validate, verify, ensureUser, async (req: RequestWithUser, res: Response, _next: NextFunction) => {
		try {
            const page = parseInt(req.query.page as string) || 1; // Default to page 1 if not provided
            const limit = parseInt(req.query.limit as string) || 10; // Default to 10 items per page if not provided
            const offset = (page - 1) * limit;
        
            const whereConditions: any = {};
        
            // Filter by programID
            if (req.query.programID) {
                whereConditions.programID = req.query.programID;
            }
        
            // Full-text search on exercise name
            if (req.query.search) {
                whereConditions.name = {
                    [Op.iLike]: `%${req.query.search}%` // Using iLike for case-insensitive search
                };
            }
        
            const exercises = await Exercise.findAll({
                where: whereConditions,
                limit: limit,
                offset: offset,
                include: [{
                    model: Program,
                    as: 'program'
                }]
            });
        
            return res.json({
                data: exercises,
                message: i18n.__('get_exercises_success')
            });
        } catch (error) {
            _next(error);
        }
	});

    // Create an exercise
    router.post('/exercises', verify, ensureAdmin, async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const exercise = await Exercise.create(req.body);
            return res.json({
                exercise,
                message: i18n.__('exercises_created')
            });
        } catch (error) {
            _next(error);
        }
    });

    // Update an exercise
    router.put('/exercises/:id', verify, ensureAdmin, async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { id } = req.params;
            await Exercise.update(req.body, { where: { id } });
            return res.json({ message: i18n.__('exercises_updated') });
        } catch (error) {
            _next(error);
        }
    });

    // Delete an exercise
    router.delete('/exercises/:id', verify, ensureAdmin, async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { id } = req.params;
            await Exercise.destroy({ where: { id } });
            return res.json({ message: i18n.__('exercises_deleted') });
        } catch (error) {
            _next(error);
        }
    });

	// Track exercises completed
    router.post('/track-exercise', verify, ensureUser, async (req: RequestWithUser, res: Response, _next: NextFunction) => {
        try {
            const { exerciseId, duration } = req.body;
            const completedExercise = await UserExercise.create({
                userId: req.user!.id,
                exerciseId,
                duration,
                datetime: new Date()
            });
            return res.json(completedExercise);
        } catch (error) {
            _next(error);
        }
    });

    // See list of completed exercises in profile
    router.get('/completed-exercises', verify, ensureUser, async (req: RequestWithUser, res: Response, _next: NextFunction) => {
        try {
            const completedExercises = await UserExercise.findAll({
            where: { userId: req.user!.id },
            include: [Exercise]
            });
            return res.json(completedExercises);
        } catch (error) {
            _next(error);
        }
    });

    // Remove tracked exercise from completed exercises list
    router.delete('/completed-exercises/:id', verify, ensureUser, async (req: RequestWithUser, res: Response, _next: NextFunction) => {
        try {
            const { id } = req.params;
            await UserExercise.destroy({ where: { id, userId: req.user!.id } });
            return res.json({ message: i18n.__('exercises_track_removed') });
        } catch (error) {
            _next(error);
        }
    });

    return router;
}
