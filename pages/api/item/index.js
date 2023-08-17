import db from '@/libs/db'

export default async function handler(req, res) {
    
    if(req.method !== 'GET') return res.status(405).end();

    const items = await db('items').orderBy('name', 'asc');

    res.status(200);
    res.json({
        message: 'Items data',
        data: items
    });

}