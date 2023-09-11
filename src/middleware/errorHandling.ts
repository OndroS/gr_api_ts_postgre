import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';
import fs from 'fs';
import i18n from 'i18n';

export const errorHandlingMiddleware = (err: AppError,req: Request, res: Response, next: NextFunction) => {
    console.error(err.message); // Log the error message to the console

    // Write the error to a log file 
    fs.appendFileSync('error.log', `${new Date().toISOString()} - ${err}\n`);

    // Send a generic error message to the client
    res.status(err.statusCode || 500).json({
        message: i18n.__('server_error')
    });
};