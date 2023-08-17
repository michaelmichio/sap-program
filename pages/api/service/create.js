import db from '@/libs/db'

export default async function handler(req, res) {
    
    if(req.method !== 'POST') return res.status(405).end();

    const { name, price, orderId } = req.body;
    
    const createService = await db('services').insert({
        name,
        price,
        orderId
    });

    res.status(200);
    res.json({
        message: 'Service registered successfully'
    });

}