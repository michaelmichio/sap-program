import bcrypt from "bcryptjs";
import db from "@/libs/db";
import { ADMIN_KEY } from "@/utils/constants";

const MIN_USERNAME_LENGTH = 4;
const MAX_USERNAME_LENGTH = 18;
const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 18;
const MIN_NAME_LENGTH = 3;
const MAX_NAME_LENGTH = 18;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).end();
        return;
    }
    
    const { username, password, name, adminkey } = req.body;
    
    if (adminkey !== ADMIN_KEY) {
        res.status(403).json({
            error: 'Admin key salah.',
        });
        return;
    }
    
    try {
        validateUserData(username, password, name);
        
        const userExists = await checkUserExists(username);
        
        if (userExists) {
            res.status(409).json({
                error: 'Username sudah digunakan.',
            });
            return;
        }
        
        const passwordHash = await hashPassword(password);
        
        await createUser(username, passwordHash, name);
        
        res.status(200).json({
            message: 'User registered successfully.',
        });
    } catch (errorMessage) {
        console.error('Error during user registration:', errorMessage);
        res.status(500).json({
            error: String(errorMessage), // Internal server error.
        });
    }
}

async function checkUserExists(username) {
    const user = await db('users').where({ username }).first();
    return !!user;
}

async function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}

async function createUser(username, passwordHash, name) {
    await db('users').insert({
        username,
        password: passwordHash,
        name,
        role: "karyawan",
    });
}

function validateUserData(username, password, name) {
    if (!isValidUsername(username)) {
        throw new Error('Format username tidak valid.'); // Invalid username format.
    }
    
    if (!isValidPassword(password)) {
        throw new Error('Format password tidak valid.'); // Invalid password format.
    }
    
    if (!isValidName(name)) {
        throw new Error('Format nama tidak valid.'); // Invalid name format.
    }
}

function isValidUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9]{4,18}$/;
    return usernameRegex.test(username);
}

function isValidPassword(password) {
    return password.length >= MIN_PASSWORD_LENGTH && password.length <= MAX_PASSWORD_LENGTH;
}

function isValidName(name) {
    const nameRegex = /^[A-Z][a-zA-Z]*( [A-Z][a-zA-Z]*)*$/;
    return nameRegex.test(name) && name.length >= MIN_NAME_LENGTH && name.length <= MAX_NAME_LENGTH;
}
