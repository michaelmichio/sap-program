import db from "@/libs/db";

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: "Method Not Allowed." });
    }

    const { id } = req.query;
    const { name, address, email, phone, birthdate, gender } = req.body;

    try {
        const updatedCustomer = await db("customers")
            .where({ id: id })
            .update({
                name: name || null,
                address: address || null,
                email: email || null,
                phone: phone || null,
                birthdate: birthdate || null,
                gender: gender || null
            });

        if (updatedCustomer) {
            return res.status(200).json({ message: "Customer updated successfully." });
        } else {
            return res.status(404).json({ error: "Customer not found." });
        }
    } catch (error) {
        console.error("Error updating customer:", error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
}
