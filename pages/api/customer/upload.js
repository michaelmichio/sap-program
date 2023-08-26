import db from "@/libs/db";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { data } = req.body; // Data dari file Excel

    const trx = await db.transaction(); // Membuat transaksi
    let hasError = false; // Variabel penanda kesalahan

    try {
        // Loop melalui data dan simpan ke dalam database
        for (const customer of data) {
            try {
                await trx("customers").insert({
                    name: customer.name || "",
                    address: customer.address || null,
                    email: customer.email || null,
                    phone: customer.phone || null,
                    birthdate: customer.birthdate || null,
                    gender: customer.gender || null,
                });
            } catch (error) {
                console.error("Error inserting customer:", error.message);
                hasError = true; // Setel variabel penanda menjadi true jika terjadi kesalahan
                break; // Hentikan loop saat terjadi kesalahan
            }
        }

        if (!hasError) {
            await trx.commit(); // Commit transaksi jika tidak ada kesalahan
            return res.status(200).json({ message: "Data uploaded successfully" });
        } else {
            await trx.rollback(); // Batalkan transaksi jika terjadi kesalahan
            return res.status(500).json({ error: "An error occurred while uploading data" });
        }
    } catch (error) {
        console.error(error); // Debugging
        await trx.rollback(); // Batalkan transaksi jika terjadi kesalahan
        return res.status(500).json({ error: "An error occurred while processing data" });
    }
}
