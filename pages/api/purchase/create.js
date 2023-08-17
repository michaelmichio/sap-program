import db from '@/libs/db'

export default async function handler(req, res) {
    
    if(req.method !== 'POST') return res.status(405).end();

    const { document_id, date, supplier, item_code, qty, price, disc, ppn } = req.body;

    const registeredDocumentId = await db('purchases').where({ document_id: document_id }).first();
    if(registeredDocumentId) return res.status(409).end();
    
    const createPurchase = await db('purchases').insert({
        document_id: document_id,
        date: date,
        supplier: supplier,
        item_code: item_code,
        qty: qty,
        price: price,
        gross: qty * price,
        disc: disc,
        ppn: ppn,
        total: ((qty * price) - (disc * (qty * price)) + (((qty * price) - (disc * (qty * price))) * ppn))
    });

    const getItem = await db('items').where({ code: item_code }).first();

    const update = await db('items').where({ code: item_code }).update({ stock: (getItem.stock + qty * 1)});

    const purchaseId = await db('purchases').select('id').where({ document_id: document_id }).first();

    const createItemLog = await db('item_logs').insert({
        item_code: getItem.code,
        item_name: getItem.name,
        initial_qty: getItem.stock,
        qty: qty,
        price: price,
        total_price: price * qty,
        updated_qty: (getItem.stock + qty * 1),
        ss_id: purchaseId,
        order_id: '',
        purchase_id: document_id,
        type: 'masuk'
    });

    res.status(200);
    res.json({
        message: 'Purchase registered successfully'
    });

}