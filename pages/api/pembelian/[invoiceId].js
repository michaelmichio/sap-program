import db from "@/libs/db";

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: "Method Not Allowed." });
    }

    const { invoiceId } = req.query;

    try {
        const pembelianData = await db("pembelian")
            .select()
            .where("invoice_pembelian_id", invoiceId)
            .orderBy("id", "asc");

        return res.status(200).json(pembelianData);
    } catch (error) {
        console.error("Error fetching pembelian data:", error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
}
