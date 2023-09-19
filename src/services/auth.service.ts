import CryptoJS from 'crypto-js';
import { models } from '../db';

const { User } = models;

export const registerNewUser = async (userData: any) => {
    const { name, surname, nickName, email, age, role, password } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new Error(i18n.__('user_already_exist'));
    }

    // Encrypt the password using CryptoJS and SECRET_KEY
    const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY!).toString();

    // Create the user
    return await User.create({
        name,
        surname,
        nickName,
        email,
        age,
        role,
        password: encryptedPassword
    });
};