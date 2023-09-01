import db from "@/libs/db";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method Not Allowed." });
    }

    const { nomor_invoice, tanggal, id_customer, jenis_kendaraan, nomor_polisi, nomor_rangka, nomor_mesin, nomor_spk, id_user } = req.body;

    try {
        // Check if the nomor_invoice already exists
        const existingInvoice = await db("invoice_penjualan")
            .where("nomor_invoice", nomor_invoice)
            .first();

        if (existingInvoice) {
            return res.status(400).json({ error: "Nomor invoice already exists." });
        }

        const newInvoice = await db("invoice_penjualan").insert({
            nomor_invoice: nomor_invoice,
            tanggal: tanggal,
            status: "pending",
            id_customer: id_customer,
            jenis_kendaraan: jenis_kendaraan,
            nomor_polisi: nomor_polisi,
            nomor_rangka: nomor_rangka,
            nomor_mesin: nomor_mesin,
            nomor_spk: nomor_spk,
            id_user: id_user,
        });

        return res.status(201).json({
            message: "Invoice created successfully.",
            data: {
                id: newInvoice[0],
                nomor_invoice: nomor_invoice,
                tanggal: tanggal,
                status: "pending",
                id_customer: id_customer,
                jenis_kendaraan: jenis_kendaraan,
                nomor_polisi: nomor_polisi,
                nomor_rangka: nomor_rangka,
                nomor_mesin: nomor_mesin,
                nomor_spk: nomor_spk,
                id_user: id_user,
            },
        });
    } catch (error) {
        console.error("Error creating invoice:", error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
}
