import db from "@/libs/db";

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: "Method Not Allowed." });
    }

    const { id } = req.query;

    try {
        const deletedBarang = await db("barang")
            .where({ id: id })
            .del();

        if (deletedBarang) {
            return res.status(200).json({ message: "Barang deleted successfully." });
        } else {
            return res.status(404).json({ error: "Barang not found." });
        }
    } catch (error) {
        console.error("Error deleting barang:", error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
}
