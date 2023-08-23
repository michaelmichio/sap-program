import db from "@/libs/db";

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: "Method Not Allowed." });
    }

    try {
        const customers = await db.select().table("customers").orderBy("id", "desc");
        return res.status(200).json({
            data: customers
        });
    } catch (error) {
        console.error("Error fetching customers:", error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
}
