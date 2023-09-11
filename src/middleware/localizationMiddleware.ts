import i18n from 'i18n';
import { Request, Response, NextFunction } from 'express';

i18n.configure({
    locales: ['en', 'sk'],
    directory: './locales',
    defaultLocale: 'en',
    autoReload: true,
    updateFiles: false
});

export const localizationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const lang = (req.headers as any)['language'];
    if (lang === 'en') {
        i18n.setLocale([req, res.locals], 'en');
    } else {
        i18n.setLocale([req, res.locals], 'sk');
    }
    next();
};