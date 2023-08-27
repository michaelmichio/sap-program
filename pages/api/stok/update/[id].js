import db from "@/libs/db";

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: "Method Not Allowed." });
    }

    const { id } = req.query;
    const { kode, nama, harga_beli, harga_jual_terbaru, jumlah, kategori } = req.body;

    try {
        let existingHargaJualTerbaru = null;

        // Get existing harga_jual_terbaru
        const existingBarang = await db("barang")
            .select("harga_jual_terbaru")
            .where({ id: id })
            .first();

        if (existingBarang) {
            existingHargaJualTerbaru = existingBarang.harga_jual_terbaru;
        }

        // Update the barang and also update harga_jual_terbaru for barang with the same kode
        await db.transaction(async (trx) => {
            await trx("barang")
                .where({ id: id })
                .update({
                    kode: kode || null,
                    nama: nama || null,
                    harga_beli: harga_beli || null,
                    harga_jual_terbaru: harga_jual_terbaru || existingHargaJualTerbaru,
                    jumlah: jumlah || null,
                    kategori: kategori || null
                });

            // Update harga_jual_terbaru for barang with the same kode
            await trx("barang")
                .where("kode", kode)
                .andWhere("id", "<>", id)
                .update("harga_jual_terbaru", harga_jual_terbaru || existingHargaJualTerbaru);
        });

        return res.status(200).json({ message: "Barang updated successfully." });
    } catch (error) {
        console.error("Error updating barang:", error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
}
