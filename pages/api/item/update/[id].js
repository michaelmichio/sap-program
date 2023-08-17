import db from '@/libs/db'

export default async function handler(req, res) {
    
    if(req.method !== 'PUT') return res.status(405).end();

    const { id } = req.query;
    const { code, name, price, stock } = req.body;

    const getInitialStock = await db('items').select('stock').where({ id });
    const initialStock = Object.values(JSON.parse(JSON.stringify(getInitialStock)));

    const getInitialPrice = await db('items').select('price').where({ id });
    const initialPrice = Object.values(JSON.parse(JSON.stringify(getInitialPrice)));

    const update = await db('items').where({ id }).update({ code, name, price, stock });

    if(stock != initialStock[0].stock) {
        const createItemEditQtyLog = await db('item_edit_qty_logs').insert({
            item_code: code,
            item_name: name,
            initial_qty: initialStock[0].stock,
            qty: stock - initialStock[0].stock,
            updated_qty: stock
        });
    }

    if(price - initialPrice[0].price != 0) {
        const createItemEditPriceLog = await db('item_edit_price_logs').insert({
            item_code: code,
            item_name: name,
            initial_price: initialPrice[0].price,
            price: price - initialPrice[0].price,
            updated_price: price
        });
    }

    res.status(200);
    res.json({
        message: 'Item updated successfully'
    });

}