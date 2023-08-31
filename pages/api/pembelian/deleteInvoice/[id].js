import db from "@/libs/db";

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: "Method Not Allowed." });
    }

    const { id } = req.query;

    try {
        const deletedInvoice = await db("invoice_pembelian")
            .where({ id: id })
            .del();

        if (deletedInvoice) {
            return res.status(200).json({ message: "Invoice deleted successfully." });
        } else {
            return res.status(404).json({ error: "Invoice not found." });
        }
    } catch (error) {
        console.error("Error deleting invoice:", error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
}
