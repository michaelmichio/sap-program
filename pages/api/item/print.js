import db from '@/libs/db'

export default async function handler(req, res) {
    
    if(req.method !== 'POST') return res.status(405).end();

    const { start, end } = req.body;

    const items = await db('item_logs').where('created_at', '>=', start + 'T00:00:00Z').where('created_at', '<', end + 'T23:59:59Z');

    res.status(200);
    res.json({
        message: 'Data report',
        data: items
    });

}