import db from "@/libs/db";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method Not Allowed." });
    }

    const {
        kode_barang,
        nama_barang,
        kategori,
        jumlah,
        harga_beli,
        harga_jual,
        diskon,
        ppn,
        cost,
        sales,
        invoice_penjualan_id
    } = req.body;

    try {
        const newPenjualan = {
            kode_barang,
            nama_barang,
            kategori,
            jumlah,
            harga_beli,
            harga_jual,
            diskon,
            ppn,
            cost,
            sales,
            invoice_penjualan_id
        };

        const insertedPenjualan = await db("penjualan").insert(newPenjualan);

        return res.status(201).json({
            message: "Penjualan data created successfully.",
            data: insertedPenjualan
        });
    } catch (error) {
        console.error("Error creating penjualan data:", error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
}
