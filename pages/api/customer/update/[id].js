import db from '@/libs/db'

export default async function handler(req, res) {
    
    if(req.method !== 'PUT') return res.status(405).end();

    const { id } = req.query;
    const { name, address, phone } = req.body;

    const update = await db('customers').where({ id }).update({ name, address, phone });

    res.status(200);
    res.json({
        message: 'Customer updated successfully'
    });

}