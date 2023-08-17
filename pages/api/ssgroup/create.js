import db from '@/libs/db'

export default async function handler(req, res) {
    
    if(req.method !== 'POST') return res.status(405).end();

    const { nomorKuitansi, orderId } = req.body;

    const id = nomorKuitansi;
    
    const createSSGroup = await db('ssgroups').insert({
        id,
        orderId
    });

    res.status(200);
    res.json({
        message: 'SS Group registered successfully'
    });

}