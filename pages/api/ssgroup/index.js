import db from '@/libs/db'

export default async function handler(req, res) {
    
    if(req.method !== 'GET') return res.status(405).end();

    const ssgroups = await db('ssgroups');

    res.status(200);
    res.json({
        message: 'SS Group data',
        data: ssgroups
    });

}