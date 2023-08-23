import db from "@/libs/db";

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: "Method Not Allowed." });
    }

    try {
        const dataBarang = await db.select().table("barang").orderBy("id", "desc"); // .orderBy("id", "desc");
        return res.status(200).json({
            data: dataBarang
        });
    } catch (error) {
        console.error("Error fetching customers:", error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
}
