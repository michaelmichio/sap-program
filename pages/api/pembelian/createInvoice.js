import db from "@/libs/db";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method Not Allowed." });
    }

    const { nomor_invoice, tanggal, pemasok } = req.body;

    try {
        // Check if the nomor_invoice already exists
        const existingInvoice = await db("invoice_pembelian")
            .where("nomor_invoice", nomor_invoice)
            .first();

        if (existingInvoice) {
            return res.status(400).json({ error: "Nomor invoice already exists." });
        }

        const newInvoice = await db("invoice_pembelian").insert({
            nomor_invoice: nomor_invoice,
            tanggal: tanggal,
            pemasok: pemasok,
            status: "pending",
        });

        return res.status(201).json({
            message: "Invoice created successfully.",
            data: {
                id: newInvoice[0],
                nomor_invoice: nomor_invoice,
                tanggal: tanggal,
                pemasok: pemasok,
                status: "pending",
            },
        });
    } catch (error) {
        console.error("Error creating invoice:", error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
}
