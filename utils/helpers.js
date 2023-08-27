// Fungsi untuk mengubah format tanggal menjadi 'YYYY-MM-DD'
export const formatISODate = (isoDate) => {
    try {
        const parsedDate = new Date(isoDate);
        const formattedDate = parsedDate.toISOString().split('T')[0];
        return formattedDate;
    } catch (error) {
        const errorMessage = "Error formatting date: " + error.message + ". The date will be set to null.";
        console.error(errorMessage);
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

export const uploadCustomerData = async (token, data) => {
    try {
        const response = await fetch("/api/customer/upload", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ data }),
        });

        if (response.ok) {
            console.log("Data uploaded successfully");
            return true; // Mengembalikan true jika unggah berhasil
        } else {
            console.error("Error uploading data:", response.statusText);
            return false; // Mengembalikan false jika terjadi kesalahan unggah
        }
    } catch (error) {
        console.error("Error uploading data:", error.message);
        return false; // Mengembalikan false jika terjadi kesalahan
    }
};

// READ ALL BARANG
export const fetchAllBarangData = async (token) => {
    try {
        const response = await fetch('/api/stok', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch barang data: ${response.statusText}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        throw new Error(`Error fetching barang data: ${error.message}`);
    }
};

// CREATE BARANG
export const fetchCreateBarang = async (token, newBarangData) => {
    try {
        const response = await fetch("/api/stok/create", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newBarangData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Error during barang registration: ${data.error}`);
        }
    } catch (error) {
        console.error("Error during barang registration:", error.message);
    }
};

// EDIT BARANG BY ID
export const fetchEditBarangById = async (token, barangId, updatedBarangData) => {
    try {
        const response = await fetch(`/api/stok/update/${barangId}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedBarangData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Error during barang edit: ${data.error}`);
        }
    } catch (error) {
        console.error("Error during barang edit:", error.message);
    }
};

// DELETE BARANG BY ID
export const fetchDeleteBarangById = async (token, barangId) => {
    try {
        const response = await fetch(`/api/stok/delete/${barangId}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Error during barang deletion: ${data.error}`);
        }
    } catch (error) {
        console.error("Error during barang deletion:", error.message);
    }
};
