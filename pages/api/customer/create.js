import db from "@/libs/db";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method Not Allowed." });
    }

    try {
        const { name, address, email, phone, birthdate, gender } = req.body;
        
        // Validation (you can add your own validation logic here)
        if (!name) {
            return res.status(400).json({ error: "Name is required." });
        }

        const insertedCustomer = await db("customers").insert({
            name: name,
            address: address || null,
            email: email || null,
            phone: phone || null,
            birthdate: birthdate || null,
            gender: gender || null,
        });

        const newCustomerId = insertedCustomer[0];
        
        return res.status(201).json({
            id: newCustomerId,
            message: "Customer created successfully.",
        });
    } catch (error) {
        console.error("Error creating customer:", error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
}
