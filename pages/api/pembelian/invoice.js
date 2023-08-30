import db from "@/libs/db";

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: "Method Not Allowed." });
    }

    try {
        const invoices = await db("invoice_pembelian")
            .select(
                "invoice_pembelian.id",
                "invoice_pembelian.nomor_invoice",
                "invoice_pembelian.tanggal",
                "invoice_pembelian.pemasok",
                "invoice_pembelian.status",  // Tambahkan ini untuk status
            )
            .sum("pembelian.total_harga as total_harga")
            .sum("pembelian.gross as total_gross")
            .sum("pembelian.diskon as total_diskon")
            .sum("pembelian.ppn as total_ppn")
            .leftJoin("pembelian", "invoice_pembelian.id", "pembelian.invoice_pembelian_id")
            .groupBy("invoice_pembelian.id", "invoice_pembelian.nomor_invoice", "invoice_pembelian.tanggal", "invoice_pembelian.pemasok", "invoice_pembelian.status")  // Juga tambahkan ini untuk status
            .orderBy("invoice_pembelian.id", "desc");

        return res.status(200).json({
            data: invoices,
        });
    } catch (error) {
        console.error("Error fetching invoices:", error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
}
