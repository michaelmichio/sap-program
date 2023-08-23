import db from "@/libs/db";
import { formatISODate } from "@/utils/helpers";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { data } = req.body; // Data dari file Excel

    const trx = await db.transaction(); // Membuat transaksi

    try {
        // Loop melalui data dan simpan ke dalam database
        for (const customer of data) {
            let formattedBirthdate = formatISODate(customer.Birthdate);
            let formattedGender = "lainnya";

            if (!formattedBirthdate) {
                formattedBirthdate = new Date().toISOString().split('T')[0];
            }

            if (customer.Gender === "pria" || customer.Gender === "wanita" || customer.Gender === "lainnya") {
                formattedGender = customer.Gender;
            }

            await trx("customers").insert({
                name: customer.Name || "",
                address: customer.Address || null,
                email: customer.Email || null,
                phone: customer.Phone || null,
                birthdate: formattedBirthdate,
                gender: formattedGender,
            });
        }

        await trx.commit(); // Commit transaksi jika berhasil

        return res.status(200).json({ message: "Data uploaded successfully" });
    } catch (error) {
        console.error(error); // Debugging
        await trx.rollback(); // Batalkan transaksi jika terjadi kesalahan
        return res.status(500).json({ error: "An error occurred while uploading data" });
    }
}
