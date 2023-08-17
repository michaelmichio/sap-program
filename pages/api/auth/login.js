import db from '@/libs/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {

    if(req.method !== 'POST') return res.status(405).end();

    const { username, password } = req.body;

    const checkUser = await db('users').where({ username }).first();
    if(!checkUser) return res.status(401).end();

    const checkPassword = await bcrypt.compare(password, checkUser.password);
    if(!checkPassword) return res.status(401).end();

    const userData = await db('users').select('name').where({ username }).first();

    const token = jwt.sign({
        id: checkUser.id,
        username: checkUser.username
    }, process.env.JWT_PRIVATE_KEY, {
        expiresIn: '7d'
    });

    res.status(200);
    res.json({
        message: 'Login successfully',
        token,
        userData
    });
    
}