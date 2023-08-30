import db from "@/libs/db";

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: "Method Not Allowed." });
    }

    const { id } = req.query;

    try {
        // Mulai transaksi
        await db.transaction(async (trx) => {
            // Ambil data pembelian yang akan diupdate statusnya
            const pembelianData = await db("pembelian")
                .select()
                .where("invoice_pembelian_id", id);

            // Perbarui status faktur menjadi "selesai"
            await db("invoice_pembelian")
                .where("id", id)
                .update({ status: "selesai" });

            // Lakukan transformasi dan masukkan data ke dalam tabel barang
            for (const pembelian of pembelianData) {
                await db("barang")
                    .transacting(trx)
                    .insert({
                        kode: pembelian.kode_barang,
                        nama: pembelian.nama_barang,
                        harga_beli: pembelian.harga,
                        harga_jual_terbaru: pembelian.harga * 1.3,
                        jumlah: pembelian.jumlah,
                        kategori: pembelian.kategori,
                        pembelian_id: pembelian.invoice_pembelian_id // Ganti menjadi pembelian.invoice_pembelian_id
                    });
            }
        });

        return res.status(200).json({ message: "Invoice status updated to 'selesai', data copied to 'barang' table." });
    } catch (error) {
        console.error("Error updating invoice status and copying data to 'barang' table:", error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
}
