import db from "@/libs/db";

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: "Method Not Allowed." });
    }

    const { id } = req.query;

    try {
        const deletedCustomer = await db("customers")
            .where({ id: id })
            .del();

        if (deletedCustomer) {
            return res.status(200).json({ message: "Customer deleted successfully." });
        } else {
            return res.status(404).json({ error: "Customer not found." });
        }
    } catch (error) {
        console.error("Error deleting customer:", error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
}
