import db from '@/libs/db';

export default async function handler(req, res) {
    
    if(req.method !== 'GET') return res.status(405).end();

    const orders = await db('orders')
    .select(
        'orders.id as orderId',
        'orders.nomorPolisi',
        'orders.jenisKendaraan',
        'orders.nomorRangka',
        'orders.nomorMesin',
        'orders.nomorSPK',
        'orders.printCount',
        'orders.customerId',
        'orders.userId',
        'orders.created_at as orderCreatedAt',
        'orders.updated_at as orderUpdatedAt',
        'customers.name as customerName',
        'customers.address as customerAddress',
        'customers.phone as customerPhone',
        'customers.created_at as customerCreatedAt',
        'customers.updated_at as customerUpdatedAt',
        db('ssgroups').count('*').whereRaw('?? = ??', ['orders.id', 'ssgroups.orderId']).as('jumlahSS'),
        db('ss').sum('itemTotalPrice').whereRaw('?? = ??', ['orders.id', 'ss.orderId']).as('totalBiayaSS'),
        db('services').sum('price').whereRaw('?? = ??', ['orders.id', 'services.orderId']).as('totalBiayaService')
    )
    .join('customers', {'customers.id': 'orders.customerId'})
    .orderBy('orderId', 'desc');

    res.status(200);
    res.json({
        message: 'Orders data',
        data: orders
    });

}