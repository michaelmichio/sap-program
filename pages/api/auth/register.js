import db from '@/libs/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {

    // jika request bukan post, return gagal
    if(req.method !== 'POST') return res.status(405).end();

    // data yang diterima
    const { username, password, name, admkey } = req.body;

    // jika admin key salah, return gagal
    if(admkey !== process.env.ADM_KEY) return res.status(403).end();

    // jika sudah pernah terdaftar, return gagal
    const registeredUser = await db('users').where({ username: username.toLowerCase() }).first();
    if(registeredUser) return res.status(409).end();

    // ubah data sesuai standar
    const username2 = username;
    const name2 = name;
    // lakukan hash untuk password
    const salt = bcrypt.genSaltSync(10);
    const password2 = bcrypt.hashSync(password, salt);
    // role id
    const roleId = '1';

    // insert data ke database
    const register = await db('users').insert({
        username: username2,
        password: password2,
        name: name2,
        roleId: roleId
    });

    // return sukses
    res.status(200);
    res.json({
        message: 'User registered successfully'
    });
    
}