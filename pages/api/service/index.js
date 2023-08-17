import db from '@/libs/db'

export default async function handler(req, res) {
    
    if(req.method !== 'GET') return res.status(405).end();

    const services = await db('services');

    res.status(200);
    res.json({
        message: 'Services data',
        data: services
    });

}