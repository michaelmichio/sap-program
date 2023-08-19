// Fungsi untuk mengubah format tanggal menjadi 'YYYY-MM-DD'
export const formatISODate = (isoDate) => {
    try {
        const parsedDate = new Date(isoDate);
        const formattedDate = parsedDate.toISOString().split('T')[0];
        return formattedDate;
    } catch (error) {
        console.error("Error formatting date:", error.message);
        return null; // Mengembalikan null jika terjadi kesalahan
    }
};

// READ ALL CUSTOMER
export const fetchAllCustomerData = async (token) => {
    try {
        const response = await fetch('/api/customer', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch customer data: ${response.statusText}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        throw new Error(`Error fetching customer data: ${error.message}`);
    }
};

// CREATE CUSTOMER
export const fetchCreateCustomer = async (token, newCustomerData) => {
    try {
        const response = await fetch("/api/customer/create", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newCustomerData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Error during customer registration: ${data.error}`);
        }
    } catch (error) {
        console.error("Error during customer registration:", error.message);
    }
};

// EDIT CUSTOMER BY ID
export const fetchEditCustomerById = async (token, customerId, updatedCustomerData) => {
    try {
        const response = await fetch(`/api/customer/update/${customerId}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedCustomerData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Error during customer edit: ${data.error}`);
        }
    } catch (error) {
        console.error("Error during customer edit:", error.message);
    }
};

// DELETE CUSTOMER BY ID
export const fetchDeleteCustomerById = async (token, customerId) => {
    try {
        const response = await fetch(`/api/customer/delete/${customerId}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Error during customer deletion: ${data.error}`);
        }
    } catch (error) {
        console.error("Error during customer deletion:", error.message);
    }
};

// UPLOAD CUSTOMER DATA
export const uploadCustomerData = async (token, data) => {
    try {
        await fetch("/api/customer/upload", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ data }), // Mengirimkan data dari file Excel ke server
        });

        console.log("Data uploaded successfully");
    } catch (error) {
        console.error("Error uploading data:", error.message);
    }
};
