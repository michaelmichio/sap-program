import db from "@/libs/db"; // Impor modul koneksi database

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: "Method Not Allowed." });
    }

    try {
        // Mengambil data invoice_penjualan dan melakukan JOIN dengan customers dan users
        const invoices = await db("invoice_penjualan")
            .select(
                "invoice_penjualan.id",
                "invoice_penjualan.nomor_invoice",
                "invoice_penjualan.tanggal",
                "invoice_penjualan.status",
                "customers.name as nama_customer",
                "invoice_penjualan.jenis_kendaraan",
                "invoice_penjualan.nomor_polisi",
                "invoice_penjualan.nomor_rangka",
                "invoice_penjualan.nomor_mesin",
                "invoice_penjualan.nomor_spk",
                "users.name as nama_user",
                // Menambahkan subquery untuk menghitung total_diskon
                db.raw("(SELECT SUM(diskon) FROM penjualan WHERE penjualan.invoice_penjualan_id = invoice_penjualan.id) as total_diskon"),
                // Menambahkan subquery untuk menghitung total_ppn
                db.raw("(SELECT SUM(ppn) FROM penjualan WHERE penjualan.invoice_penjualan_id = invoice_penjualan.id) as total_ppn"),
                // Menambahkan subquery untuk menghitung total_cost
                db.raw("(SELECT SUM(cost) FROM penjualan WHERE penjualan.invoice_penjualan_id = invoice_penjualan.id) as total_cost"),
                // Menambahkan subquery untuk menghitung total_sales
                db.raw("(SELECT SUM(sales) FROM penjualan WHERE penjualan.invoice_penjualan_id = invoice_penjualan.id) as total_sales")
            )
            .leftJoin("customers", "invoice_penjualan.id_customer", "customers.id")
            .leftJoin("users", "invoice_penjualan.id_user", "users.id")
            .orderBy("invoice_penjualan.id", "desc"); // Mengurutkan berdasarkan ID pesanan secara menurun

        return res.status(200).json(invoices);
    } catch (error) {
        console.error("Error fetching invoice data:", error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
}
