import db from '@/libs/db'

export default async function handler(req, res) {
    
    if(req.method !== 'POST') return res.status(405).end();

    const { name, address, phone } = req.body;
    
    const d = new Date();
    const id = '1' + ('0' + d.getYear()).slice(-2) + ('0' + d.getMonth()).slice(-2) + ('0' + d.getDate()).slice(-2) + ('0' + d.getHours()).slice(-2) + ('0' + d.getMinutes()).slice(-2) + ('0' + d.getSeconds()).slice(-2);
    
    const createCustomer = await db('customers').insert({
        id,
        name,
        address,
        phone
    });

    res.status(200);
    res.json({
        message: 'Customer registered successfully'
    });

}