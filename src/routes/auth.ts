import { Router, Request, Response, NextFunction } from 'express';
import { registerValidationRules, validate } from '../validators/validationServices';
import { models } from '../db';
import CryptoJS from 'crypto-js'
import jwt from 'jsonwebtoken';
import i18n from 'i18n';

const router: Router = Router();

const {
    User
} = models;

export default () => {
    // Registration Endpoint
    router.post('/register', registerValidationRules(), validate, async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { name, surname, nickName, email, age, role, password } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: i18n.__('user_already_exist')});
            }

            // Encrypt the password using CryptoJS and SECRET_KEY
            const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY!).toString();

            // Create the user
            const user = await User.create({
                name,
                surname,
                nickName,
                email,
                age,
                role,
                password: encryptedPassword
            });

            return res.status(201).json({
                message: i18n.__('registration_success'),
                userId: user.id
            });
        } catch (error) {
            _next(error);
        }
    });

    // Login Endpoint
    router.post('/login', async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { email, password } = req.body;

            // Check if user exists
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(400).json({ message: i18n.__('auth_error') });
            }

            // Decrypt the stored password using CryptoJS and SECRET_KEY
            const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY!);
            const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

            if (password !== decryptedPassword) {
                return res.status(400).json({ message: i18n.__('auth_error') });
            }

            // Generate JWT token
            const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY as string, {
                expiresIn: '1h'
            });

            return res.json({
                message: i18n.__('auth_success'),
                token,
                role: user.role
            });
        } catch (error) {
            _next(error);
        }
    });

    return router;
}