import db from "@/libs/db";

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: "Method Not Allowed." });
    }

    const { invoiceId } = req.query;

    try {
        const penjualanData = await db("penjualan")
            .select()
            .where("invoice_penjualan_id", invoiceId)
            .orderBy("id", "asc");

        return res.status(200).json(penjualanData);
    } catch (error) {
        console.error("Error fetching penjualan data:", error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
}
