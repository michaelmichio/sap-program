import db from '@/libs/db'

export default async function handler(req, res) {
    
    if(req.method !== 'POST') return res.status(405).end();

    const { items } = req.body;

    for (let i = 0; i < items.length; i++) {
        const code = items[i].kode;
        const name = items[i].nama;
        const price = items[i].harga;
        const stock = items[i].jumlah;

        const registeredItem = await db('items').where({ code: code }).first();
        if(!registeredItem) {
            const createItem = await db('items').insert({
                code,
                name,
                price,
                stock
            });
        }
        else {
            const updateItem = await db('items').where({ id: registeredItem.id })
            .update({
                name,
                price: parseFloat(price),
                // stock: parseFloat(registeredItem.stock) + parseFloat(stock)
                stock: parseFloat(registeredItem.stock) + parseFloat(stock)
            });
        }
    }

    res.status(200);
    res.json({
        message: 'Items registered successfully'
    });

}