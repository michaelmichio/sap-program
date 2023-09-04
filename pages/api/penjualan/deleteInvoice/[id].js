import db from "@/libs/db";

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: "Method Not Allowed." });
    }

    const { id } = req.query;

    try {
        // Menggunakan transaksi untuk menghapus data pada kedua tabel secara atomik
        await db.transaction(async (trx) => {
            // Hapus entri pada tabel "penjualan" terlebih dahulu
            await trx("penjualan")
                .where("invoice_penjualan_id", id)
                .del();

            // Kemudian, hapus entri pada tabel "invoice_penjualan"
            const deletedInvoice = await trx("invoice_penjualan")
                .where({ id: id })
                .del();

            if (deletedInvoice) {
                return res.status(200).json({ message: "Invoice and related sales deleted successfully." });
            } else {
                return res.status(404).json({ error: "Invoice not found." });
            }
        });
    } catch (error) {
        console.error("Error deleting invoice:", error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
}
