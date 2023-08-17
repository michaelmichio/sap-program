import db from '@/libs/db'

export default async function handler(req, res) {
    
    if(req.method !== 'POST') return res.status(405).end();

    const { nomorPolisi, jenisKendaraan, nomorRangka, nomorMesin, nomorSPK, printCount, customerId, userId } = req.body;
    
    const d = new Date();
    const id = '2' + ('0' + d.getYear()).slice(-2) + ('0' + d.getMonth()).slice(-2) + ('0' + d.getDate()).slice(-2) + ('0' + d.getHours()).slice(-2) + ('0' + d.getMinutes()).slice(-2) + ('0' + d.getSeconds()).slice(-2);
    
    const createCustomer = await db('orders').insert({
        id,
        nomorPolisi,
        jenisKendaraan,
        nomorRangka,
        nomorMesin,
        nomorSPK,
        printCount,
        customerId,
        userId
    });

    res.status(200);
    res.json({
        message: 'Order registered successfully'
    });

}