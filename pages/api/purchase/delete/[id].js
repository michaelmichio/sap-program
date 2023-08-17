import db from '@/libs/db'

export default async function handler(req, res) {
    
    if(req.method !== 'DELETE') return res.status(405).end();

    const { id } = req.query;

    const getPurchase = await db('purchases').where({ id }).first();
    const getItem = await db('items').where({ code: getPurchase.item_code }).first();
    const update = await db('items').where({ code: getPurchase.item_code }).update({ stock: getItem.stock - getPurchase.qty });

    const deleteRow = await db('purchases').where({ id }).del();

    const deleteItemLog = await db('item_logs').where({ ss_id: id }).del();

    res.status(200);
    res.json({
        message: 'Purchases deleted successfully'
    });

}