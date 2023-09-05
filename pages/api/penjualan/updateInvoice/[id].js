import db from "@/libs/db";

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: "Method Not Allowed." });
    }

    let { id } = req.query;
    let trx;

    try {
        // Mulai transaksi
        trx = await db.transaction(async (trx) => {
            // Ambil setiap data pada tabel "penjualan" yang memiliki "invoice_penjualan_id" sama dengan "id",
            // dan masukan ke dalam variable "penjualanData"
            const penjualanData = await db("penjualan")
                .select()
                .where("invoice_penjualan_id", id);

            // Pastikan tidak ada jumlah penjualan yang melebihi stok barang
            for (const penjualan of penjualanData) {
                const barang = await db
                    .select(
                        'barang.id',
                        'barang.kode',
                        'barang.nama',
                        'barang.harga_beli',
                        'barang.harga_jual_terbaru',
                        'barang.jumlah',
                        'barang.kategori',
                        'barang.pembelian_id',
                        'barang.tanggal_perubahan',
                        db.raw('SUM(same_code_barang.jumlah) as total_jumlah')
                    )
                    .from('barang')
                    .leftJoin('barang as same_code_barang', 'barang.kode', 'same_code_barang.kode')
                    .groupBy(
                        'barang.id',
                        'barang.kode',
                        'barang.nama',
                        'barang.harga_beli',
                        'barang.harga_jual_terbaru',
                        'barang.jumlah',
                        'barang.kategori',
                        'barang.pembelian_id',
                        'barang.tanggal_perubahan'
                    )
                    .where('barang.kode', '=', penjualan.kode_barang) // Menambahkan klausa WHERE untuk kode 123
                    .orderBy('barang.created_at', 'asc') // Urutkan berdasarkan kolom 'tanggal_perubahan'
                    .first();


                if (barang.total_jumlah < penjualan.jumlah) {
                    // Batalkan transaksi jika ada jumlah penjualan yang melebihi stok barang
                    throw new Error("Jumlah penjualan melebihi stok barang yang tersedia.");
                }
            }

            // Hapus setiap data pada tabel "penjualan" yang sama dengan data "penjualan" pada "penjualanData"
            for (const penjualan of penjualanData) {
                await db("penjualan")
                    .where("id", penjualan.id)
                    .del();
            }

            // Lakukan pengulangan terhadap data "penjualan" pada "penjualanData"
            for (const penjualan of penjualanData) {

                // "jumlah" pada data "penjualan"
                let remainingQuantity = penjualan.jumlah;

                // Lakukan sesuatu untuk setiap "penjualan" yang memiliki kategori "spare_part" atau "oli"
                if (penjualan.kategori === "spare_part" || penjualan.kategori === "oli") {

                    // Lakukan pengulangan selagi "remainingQuantity" > 0
                    while (remainingQuantity > 0) {

                        // Cari data dari tabel "barang" dengan kode yang sama dengan "kode_barang" pada data "penjualan",
                        // dan urutkan berdasarkan "created_at" paling lama terlebih dahulu
                        const dataBarang = await db("barang")
                            .select()
                            .where("kode", penjualan.kode_barang)
                            .where("jumlah", "<>", 0)
                            .orderBy("tanggal_perubahan", "asc")
                            .first();

                        // Jika "dataBarang" ada
                        if (dataBarang) {
                            // "jumlah" pada "dataBarang"
                            const availableQuantity = dataBarang.jumlah;

                            // Jika "availableQuantity" lebih besar sama dengan "remainingQuantity"
                            if (availableQuantity >= remainingQuantity) {

                                if (availableQuantity - remainingQuantity > 0) {
                                    // Update untuk kurangi "jumlah" pada data "barang" sebanyak "remainingQuantity"
                                    await db("barang")
                                        .where("id", dataBarang.id)
                                        .update({ jumlah: availableQuantity - remainingQuantity });
                                }
                                else { // jumlah == 0
                                    // ...
                                    await db("barang")
                                        .where("id", dataBarang.id)
                                        .update({ jumlah: availableQuantity - remainingQuantity });
                                }

                                // Tambahkan data "penjualan" baru ke tabel
                                await db("penjualan").insert({
                                    kode_barang: dataBarang.kode,
                                    nama_barang: dataBarang.nama,
                                    kategori: dataBarang.kategori,
                                    jumlah: remainingQuantity,
                                    harga_beli: dataBarang.harga_beli,
                                    harga_jual: dataBarang.harga_jual_terbaru,
                                    diskon: 0,
                                    ppn: 0,
                                    cost: remainingQuantity * dataBarang.harga_jual_terbaru,
                                    sales: remainingQuantity * dataBarang.harga_jual_terbaru,
                                    invoice_penjualan_id: id,
                                });

                                remainingQuantity = 0;
                            }
                            // Jika jumlah pada data barang kurang dari jumlah pada data penjualan
                            else {
                                await db("barang")
                                    .where("id", dataBarang.id)
                                    .update({ jumlah: 0 });

                                // Tambahkan data penjualan baru
                                await db("penjualan").insert({
                                    kode_barang: dataBarang.kode,
                                    nama_barang: dataBarang.nama,
                                    kategori: dataBarang.kategori,
                                    jumlah: availableQuantity,
                                    harga_beli: dataBarang.harga_beli,
                                    harga_jual: dataBarang.harga_jual_terbaru,
                                    diskon: 0,
                                    ppn: 0,
                                    cost: availableQuantity * dataBarang.harga_jual_terbaru,
                                    sales: availableQuantity * dataBarang.harga_jual_terbaru,
                                    invoice_penjualan_id: id,
                                });

                                remainingQuantity -= availableQuantity;
                            }
                        }
                        // Jika dataBarang tidak ada
                        else {
                            // Data barang dengan kode yang sesuai tidak ditemukan, mungkin perlu penanganan khusus
                            throw new Error("Transaksi Error, harap hubungi admin.");
                        }

                    } // End While

                }

            } // End Loop

            // Update "status" data pada tabel "invoice_penjualan" menjadi "selesai"
            await db("invoice_penjualan")
                .where("id", id)
                .update({ status: "selesai" });
        });

        return res.status(200).json({ message: "Invoice status updated to 'selesai', data copied to 'barang' table." });
    } catch (error) {

        if (trx) {
            await trx.rollback(); // Batalkan transaksi jika terjadi kesalahan
        }

        return res.status(500).json({ error: "Internal Server Error." });
    }
}
