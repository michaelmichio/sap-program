import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "@/libs/db";
import { JWT_PRIVATE_KEY } from "@/utils/constants";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method Not Allowed." });
    }
    
    const { username, password } = req.body;
    
    try {
        const user = await authenticateUser(username, password);
        
        if (!user) {
            return res.status(401).json({ success: false, error: "Data pengguna tidak ditemukan." }); // message: "Invalid credentials"
        }
        
        const token = generateAuthToken(user);
        return res.status(200).json({ success: true, token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Gagal terhubung ke database." }); // message: "Internal Server Error"
    }
}

async function authenticateUser(username, password) {
    const user = await getUserByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return null;
    }
    
    return user;
}

async function getUserByUsername(username) {
    return await db('users').where({ username }).first();
}

function generateAuthToken(user) {
    const tokenPayload = {
        username: user.username,
        name: user.name,
    };
    const tokenOptions = {
        expiresIn: '7d',
    };
    return jwt.sign(tokenPayload, JWT_PRIVATE_KEY, tokenOptions);
}
