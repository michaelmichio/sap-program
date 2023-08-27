import db from "@/libs/db";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method Not Allowed." });
    }

    let newBarangId; // Deklarasikan di luar blok try

    try {
        const { kode, nama, harga_beli, harga_jual_terbaru, jumlah, kategori } = req.body;

        // Validation (you can add your own validation logic here)
        if (!kode) {
            return res.status(400).json({ error: "Kode is required." });
        }

        await db.transaction(async (trx) => {
            // Insert new barang
            const insertedBarang = await trx("barang").insert({
                kode: kode || "",
                nama: nama || "",
                harga_beli: harga_beli || 0,
                harga_jual_terbaru: harga_jual_terbaru || 0,
                jumlah: jumlah || 0,
                kategori: kategori || "spare_part",
            });

            newBarangId = insertedBarang[0]; // Assign newBarangId

            // Update harga_jual_terbaru for existing barang with the same kode
            await trx("barang")
                .where("kode", kode)
                .andWhere("id", "<>", newBarangId)
                .update("harga_jual_terbaru", harga_jual_terbaru || 0);
        });

        return res.status(201).json({
            id: newBarangId,
            message: "Barang created successfully.",
        });
    } catch (error) {
        console.error("Error creating barang:", error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
}
