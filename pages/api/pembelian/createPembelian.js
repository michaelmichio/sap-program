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
        harga,
        gross,
        diskon,
        ppn,
        total_harga,
        invoice_pembelian_id
    } = req.body;

    try {
        const newPembelian = {
            kode_barang,
            nama_barang,
            kategori,
            jumlah,
            harga,
            gross,
            diskon,
            ppn,
            total_harga,
            invoice_pembelian_id
        };

        const insertedPembelian = await db("pembelian").insert(newPembelian);

        return res.status(201).json({
            message: "Pembelian data created successfully.",
            data: insertedPembelian
        });
    } catch (error) {
        console.error("Error creating pembelian data:", error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
}
