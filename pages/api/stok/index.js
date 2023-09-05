import db from "@/libs/db";

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: "Method Not Allowed." });
    }

    try {
        const dataBarang = await db
            .select('barang.id', 'barang.kode', 'barang.nama', 'barang.harga_beli', 'barang.harga_jual_terbaru', 'barang.jumlah', 'barang.kategori', 'barang.pembelian_id', 'barang.tanggal_perubahan', db.raw('SUM(same_code_barang.jumlah) as total_jumlah'))
            .from('barang')
            .leftJoin('barang as same_code_barang', 'barang.kode', 'same_code_barang.kode')
            .groupBy('barang.id', 'barang.kode', 'barang.nama', 'barang.harga_beli', 'barang.harga_jual_terbaru', 'barang.jumlah', 'barang.kategori', 'barang.pembelian_id', 'barang.tanggal_perubahan')
            .orderBy('barang.created_at', 'asc'); // Urutkan berdasarkan kolom 'tanggal_perubahan'

        return res.status(200).json({
            data: dataBarang
        });
    } catch (error) {
        console.error("Error fetching customers:", error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
}
