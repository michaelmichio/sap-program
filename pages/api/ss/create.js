import db from '@/libs/db'

export default async function handler(req, res) {
    
    if(req.method !== 'POST') return res.status(405).end();

    const { itemId, itemCode, itemName, itemCount, itemPrice, itemTotalPrice, ssGroupId, orderId } = req.body;

    const createSS = await db('ss').insert({
        itemId,
        itemCode,
        itemName,
        itemCount,
        itemPrice,
        itemTotalPrice,
        ssGroupId,
        orderId
    });

    const id2 = await db('ss').max('id as maxId').first();

    res.status(200);
    res.json({
        message: 'SS registered successfully',
        data: id2
    });

}