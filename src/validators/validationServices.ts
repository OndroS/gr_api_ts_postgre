import { body, query, param, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const registerValidationRules = (): Array<ValidationChain> => {
  return [
    body('email').isEmail().withMessage('Must be a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ];
}

export const exerciseQueryValidationRules = (): Array<ValidationChain> => {
  return [
    query('page').optional().isInt({ gt: 0 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ gt: 0 }).withMessage('Limit must be a positive integer'),
    query('programID').optional().isInt({ gt: 0 }).withMessage('ProgramID must be a positive integer'),
  ];
}

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors: Array<{ [key: string]: string }> = [];
  errors.array().map(err => extractedErrors.push({ validationError: err.msg }));

  return res.status(400).json({
    errors: extractedErrors,
  });
}





