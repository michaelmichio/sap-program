import db from '@/libs/db';

export default async function handler(req, res) {
    
    if(req.method !== 'PUT') return res.status(405).end();

    const { id } = req.query;
    const { stock, orderId, itemId } = req.body;

    const getItem = await db('items').where({ id }).first();

    const update = await db('items').where({ id }).update({ stock: getItem.stock - stock});

    const createItemLog = await db('item_logs').insert({
        item_code: getItem.code,
        item_name: getItem.name,
        initial_qty: getItem.stock,
        qty: stock * -1,
        price: getItem.price,
        total_price: getItem.price * stock,
        updated_qty: getItem.stock - stock,
        ss_id: itemId,
        order_id: orderId,
        purchase_id: '',
        type: 'keluar'
    });

    res.status(200);
    res.json({
        message: 'Item stock subtracted successfully'
    });

}