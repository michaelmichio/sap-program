import db from '@/libs/db'

export default async function handler(req, res) {
    
    if(req.method !== 'PUT') return res.status(405).end();

    const { id } = req.query;
    const { nomorPolisi, jenisKendaraan, nomorRangka, nomorMesin, nomorSPK, printCount } = req.body;

    const update = await db('orders').where({ id }).update({ nomorPolisi, jenisKendaraan, nomorRangka, nomorMesin, nomorSPK, printCount });

    const updatedData = await db('orders').where({ id });

    const itemData = await db('ss').where({ orderId: id });

    res.status(200);
    res.json({
        message: 'Order updated successfully',
        data: updatedData
    });

}