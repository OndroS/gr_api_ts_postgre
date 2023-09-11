import { Router, Request, Response, NextFunction } from "express";
import verify from "../middleware/verifyToken";
import { ensureAdmin, ensureUser } from "../middleware/ensureRole";

import { models } from "../db";

const router: Router = Router();

const { Program } = models;

export default () => {
  router.get("/", verify, ensureUser, async (_req: Request, res: Response, _next: NextFunction) => {
    const programs = await Program.findAll();
    return res.json({
      data: programs,
      message: "List of programs",
    });
  });

  // Create an exercise
  router.post('/', verify, ensureAdmin, async (req: Request, res: Response) => {
	const exercise = await Program.create(req.body);
	return res.json(exercise);
});

// Update an exercise
router.put('/:id', verify, ensureAdmin, async (req: Request, res: Response) => {
	const { id } = req.params;
	await Program.update(req.body, { where: { id } });
	return res.json({ message: 'Program updated' });
});

  return router;
};
