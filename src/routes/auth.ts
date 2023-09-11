import { Router, Request, Response, NextFunction } from 'express';
import { models } from '../db';
// import bcrypt from 'bcrypt';
import CryptoJS from 'crypto-js'
import jwt from 'jsonwebtoken';

const router: Router = Router();

const {
    User
} = models;

export default () => {
    // Registration Endpoint
    router.post('/register', async (req: Request, res: Response, _next: NextFunction) => {
        const { name, surname, nickName, email, age, role, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
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
            message: 'User registered successfully',
            userId: user.id
        });
    });

    // Login Endpoint
    router.post('/login', async (req: Request, res: Response, _next: NextFunction) => {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Decrypt the stored password using CryptoJS and SECRET_KEY
        const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY!);
        const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

        if (password !== decryptedPassword) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY as string, {
            expiresIn: '1h'
        });

        return res.json({
            message: 'Logged in successfully',
            token
        });
    });

    return router;
}