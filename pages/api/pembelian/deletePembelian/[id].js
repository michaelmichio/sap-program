import db from "@/libs/db";

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: "Method Not Allowed." });
    }

    const { id } = req.query;

    try {
        const deletedPembelian = await db("pembelian")
            .where({ id: id })
            .del();

        if (deletedPembelian) {
            return res.status(200).json({ message: "Pembelian deleted successfully." });
        } else {
            return res.status(404).json({ error: "Pembelian not found." });
        }
    } catch (error) {
        console.error("Error deleting pembelian:", error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
}
