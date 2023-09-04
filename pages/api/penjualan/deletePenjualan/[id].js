import db from "@/libs/db";

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: "Method Not Allowed." });
    }

    const { id } = req.query;

    try {
        const deletedPenjualan = await db("penjualan")
            .where({ id: id })
            .del();

        if (deletedPenjualan) {
            return res.status(200).json({ message: "Penjualan deleted successfully." });
        } else {
            return res.status(404).json({ error: "Penjualan not found." });
        }
    } catch (error) {
        console.error("Error deleting penjualan:", error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
}
