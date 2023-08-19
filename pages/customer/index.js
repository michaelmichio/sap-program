import { useEffect, useState } from "react";
import { getCookies } from "cookies-next";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { fetchAllCustomerData, fetchCreateCustomer, fetchEditCustomerById, fetchDeleteCustomerById, uploadCustomerData, formatISODate } from "@/utils/helpers";
import * as XLSX from "xlsx";
import * as XlsxPopulate from 'xlsx-populate/browser/xlsx-populate';
import FileSaver from 'file-saver';

export const getServerSideProps = async (context) => {
    const cookies = getCookies(context);

    if (!cookies.token) {
        return {
            redirect: {
                destination: "/auth/login",
                permanent: false,
            },
        };
    }

    return {
        props: {
            token: cookies.token
        }
    };
}

export default function Customer(props) {
    const { token } = props;
    const [loading, setLoading] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [fetchNewCustomerData, setFetchNewCustomerData] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCustomerData, setNewCustomerData] = useState({
        name: "",
        address: "",
        email: "",
        phone: "",
        birthdate: "",
        gender: "",
    });
    const [showEditModal, setShowEditModal] = useState(false);
    const [editCustomerId, setEditCustomerId] = useState(null);
    const [editCustomerData, setEditCustomerData] = useState({
        name: "",
        address: "",
        email: "",
        phone: "",
        birthdate: "",
        gender: "",
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteCustomerId, setDeleteCustomerId] = useState(null);

    // READ ALL CUSTOMER
    useEffect(() => {
        fetchAllCustomerData(token)
            .then((data) => {
                setCustomers(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error.message);
                setLoading(false);
            });

        setFetchNewCustomerData(false);
    }, [fetchNewCustomerData]);

    // CREATE CUSTOMER
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCustomerData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await fetchCreateCustomer(token, newCustomerData);
            setFetchNewCustomerData(true);
            closeAddModal();
        } catch (error) {
            console.error("Error creating customer:", error.message);
        }
    };

    const openAddModal = () => {
        setShowAddModal(true);
    };

    const closeAddModal = () => {
        setShowAddModal(false);
        setNewCustomerData({
            name: "",
            address: "",
            email: "",
            phone: "",
            birthdate: "",
            gender: "",
        });
    };

    // EDIT CUSTOMER BY ID
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditCustomerData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        try {
            await fetchEditCustomerById(token, editCustomerId, editCustomerData);
            setFetchNewCustomerData(true);
            closeEditModal();
        } catch (error) {
            console.error("Error editing customer:", error.message);
        }
    };

    const openEditModal = (customerId) => {
        const customerToEdit = customers.find((customer) => customer.id === customerId);
        if (customerToEdit) {
            setEditCustomerId(customerId);
            setEditCustomerData({
                name: customerToEdit.name,
                address: customerToEdit.address,
                email: customerToEdit.email,
                phone: customerToEdit.phone,
                birthdate: new Date(customerToEdit.birthdate).toISOString().split("T")[0],
                gender: customerToEdit.gender,
            });
            setShowEditModal(true);
        }
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setEditCustomerId(null);
        setEditCustomerData({
            name: "",
            address: "",
            email: "",
            phone: "",
            birthdate: "",
            gender: "",
        });
    };

    // DELETE CUSTOMER BY ID
    const handleDelete = (customerId) => {
        setDeleteCustomerId(customerId); // Set the customer ID to be deleted
        setShowDeleteModal(true); // Show the delete modal
    };

    const confirmDelete = async () => {
        try {
            await fetchDeleteCustomerById(token, deleteCustomerId);
            setFetchNewCustomerData(true);
        } catch (error) {
            console.error("Error deleting customer:", error.message);
        } finally {
            setShowDeleteModal(false); // Close the delete modal
            setDeleteCustomerId(null); // Reset the customer ID to be deleted
        }
    };

    // EXPORT CUSTOMER DATA
    const getColumnHeaderStyle = {
        fill: { fgColor: { rgb: "CCCCCC" } }, // Warna abu-abu (#CCCCCC)
        font: { bold: true },
    };

    const ExcelExportHelper = ({ data }) => {
        const handleDownload = async () => {
            const dataToDownload = customers.map((customer) => ({
                Name: customer.name,
                Address: customer.address,
                Email: customer.email,
                Phone: customer.phone,
                Birthdate: customer.birthdate,
                Gender: customer.gender,
            }));
            
            const workbook = await XlsxPopulate.fromBlankAsync();
            const worksheet = workbook.addSheet('Data Pelanggan');

            // Set style untuk judul kolom
            const columnHeaderStyle = {
                fontColor: 'FFFFFF',
                fill: '007ACC',
                bold: true,
            };
            worksheet.range('A1:F1').style(columnHeaderStyle);

            // Set data
            worksheet.cell('A1').value('Name');
            worksheet.cell('B1').value('Address');
            worksheet.cell('C1').value('Email');
            worksheet.cell('D1').value('Phone');
            worksheet.cell('E1').value('Birthdate');
            worksheet.cell('F1').value('Gender');

            // ... (kode lain untuk mendapatkan dataToDownload)

            dataToDownload.forEach((customer, index) => {
                const row = index + 2; // Starting from row 2
                worksheet.cell(`A${row}`).value(customer.Name);
                worksheet.cell(`B${row}`).value(customer.Address);
                worksheet.cell(`C${row}`).value(customer.Email);
                worksheet.cell(`D${row}`).value(customer.Phone);
                worksheet.cell(`E${row}`).value(customer.Birthdate);
                worksheet.cell(`F${row}`).value(customer.Gender);
            });

            const excelBlob = await workbook.outputAsync();
            FileSaver.saveAs(excelBlob, 'data_pelanggan.xlsx');
        };

        return (
            <button
                onClick={() => {
                    handleDownload();
                }}
                className="btn btn-primary float-end"
            >
                Export
            </button>
        );
    };

    // const handleDownload = () => {
    //     const dataToDownload = customers.map((customer) => ({
    //         Name: customer.name,
    //         Address: customer.address,
    //         Email: customer.email,
    //         Phone: customer.phone,
    //         Birthdate: customer.birthdate,
    //         Gender: customer.gender,
    //     }));

    //     const worksheet = XLSX.utils.json_to_sheet(dataToDownload);

    //     // Set style untuk judul kolom
    //     worksheet["!cols"] = [
    //         { wch: 20 },
    //         { wch: 20 },
    //         { wch: 25 },
    //         { wch: 20 },
    //         { wch: 25 },
    //         { wch: 10 },
    //     ];

    //     // Tambah gaya untuk judul kolom
    //     Object.keys(worksheet).forEach((cellRef) => {
    //         if (cellRef.startsWith("A1")) {
    //             const cell = worksheet[cellRef];
    //             cell.s = getColumnHeaderStyle;
    //         }
    //     });

    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, "Data Pelanggan");

    //     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    //     const excelBlob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    //     FileSaver.saveAs(excelBlob, "data_pelanggan.xlsx");
    // };

    // const handleDownload = () => {
    //     const dataToDownload = customers.map((customer) => ({
    //         Name: customer.name,
    //         Address: customer.address,
    //         Email: customer.email,
    //         Phone: customer.phone,
    //         Birthdate: customer.birthdate,
    //         Gender: customer.gender,
    //     }));

    //     const worksheet = XLSX.utils.json_to_sheet(dataToDownload);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, "Data Pelanggan");
    //     XLSX.writeFile(workbook, "data_pelanggan.xlsx");
    // };

    // IMPORT CUSTOMER DATA
    const readFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                resolve(jsonData);
            };

            reader.onerror = (error) => {
                reject(error);
            };

            reader.readAsArrayBuffer(file);
        });
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const data = await readFile(file);
                await uploadCustomerData(token, data); // Menjalankan fungsi untuk mengunggah data ke server
                setFetchNewCustomerData(true);
            } catch (error) {
                console.error("Error uploading file:", error.message);
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-white dark:bg-gray-700 text-black dark:text-white">
            <Navbar />
            <Sidebar />
            <div className="h-full ml-14 mt-14 md:ml-64">
                <div className="flex justify-between w-full px-4 mt-4">
                    <div className="w-1/2 box flex flex-col justify-center">
                        <div className="box-wrapper">
                            <div className=" bg-white rounded flex items-center w-full p-3 shadow-sm border border-gray-200">
                                <button className="outline-none focus:outline-none"><svg className=" w-5 text-gray-600 h-5 cursor-pointer" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></button>
                                <input type="search" name="" id="" placeholder="search" x-model="q" className="w-full pl-4 text-sm outline-none focus:outline-none bg-transparent" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center ml-4 mr-4">
                        <div className="flex flex-col justify-center ml-4 mr-4">
                            <button
                                type="button"
                                className="bg-sky-700 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded"
                            // onClick={handleDownload}
                            >
                                CETAK
                            </button>
                        </div>
                    </div>
                    <ExcelExportHelper></ExcelExportHelper>
                    <input type="file" accept=".xlsx" onChange={handleFileUpload} />
                    <div className="flex flex-col justify-center ml-4 mr-4">
                        <div className="flex flex-col justify-center ml-4 mr-4">
                            <button
                                type="button"
                                className="bg-sky-700 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded"
                                onClick={openAddModal}
                            >
                                TAMBAH
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-2 mx-4">
                    <div className="w-full overflow-hidden rounded-lg shadow-xs">
                        <div className="w-full overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                                        <th className="w-1/12 truncate ... px-4 py-3">No.</th>
                                        <th className="w-1/6 truncate ... px-4 py-3">Id Customer</th>
                                        <th className="w-1/6 truncate ... px-4 py-3">Nama</th>
                                        <th className="w-1/6 truncate ... px-4 py-3">Alamat</th>
                                        <th className="w-1/6 truncate ... px-4 py-3">Email</th>
                                        <th className="w-1/6 truncate ... px-4 py-3">No. Telp</th>
                                        <th className="truncate ... px-4 py-3"></th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="7" className="text-center py-4">
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : (
                                        customers.map((customer, index) => (
                                            <tr
                                                key={customer.id}
                                                className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400"
                                            >
                                                <td className="w-1/12 truncate ... px-4 text-sm">{index + 1}</td>
                                                <td className="w-1/6 truncate ... px-4 text-sm">{customer.id}</td>
                                                <td className="w-1/6 truncate ... px-4 text-sm">{customer.name || "-"}</td>
                                                <td className="w-1/6 truncate ... px-4 text-sm">{customer.address || "-"}</td>
                                                <td className="w-1/6 truncate ... px-4 text-sm">{customer.email || "-"}</td>
                                                <td className="w-1/6 truncate ... px-4 text-sm">{customer.phone || "-"}</td>
                                                <td className="px-4 text-sm flex justify-end">
                                                    <button
                                                        type="button"
                                                        className="text-gray-500 hover:text-gray-700 font-semibold py-2 px-4"
                                                        onClick={() => openEditModal(customer.id)}
                                                    >
                                                        Ubah
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="ml-2 text-gray-500 hover:text-gray-700 font-semibold py-2 px-4"
                                                        onClick={() => handleDelete(customer.id)}
                                                    >
                                                        Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>

                            </table>
                        </div>
                        <div className="flex flex-col px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
                            <div className="flex flex-row justify-end">
                                <span className="flex text-xs xs:text-sm text-gray-500 normal-case text-center"></span>
                            </div>
                            <div className="flex flex-row justify-end mt-1">
                                <div className="flex xs:mt-0">
                                    <button
                                        className="text-sm bg-gray-300 hover:bg-sky-700 text-white hover:text-white font-semibold py-2 px-4 rounded-l">
                                        Prev
                                    </button>
                                    <button
                                        className="text-sm bg-gray-300 hover:bg-sky-700 text-white hover:text-white font-semibold py-2 px-4 rounded-r">
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showAddModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="modal-overlay absolute inset-0 bg-gray-900 opacity-50"></div>
                    <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
                        <div className="modal-content py-4 text-left px-6">
                            <div className="flex justify-between items-center pb-3">
                                <p className="text-2xl font-bold">Tambah Customer</p>
                                <button
                                    className="modal-close text-gray-500 hover:text-gray-700"
                                    onClick={closeAddModal}
                                >
                                    <svg
                                        className="fill-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 18 18"
                                    >
                                        <path
                                            d="M1 1l16 16m0-16L1 17"
                                            stroke="#808080"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="mt-4">
                                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                                        Nama
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={newCustomerData.name}
                                        onChange={handleInputChange}
                                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                                        required
                                    />
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">
                                        Alamat
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={newCustomerData.address}
                                        onChange={handleInputChange}
                                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={newCustomerData.email}
                                        onChange={handleInputChange}
                                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
                                        Nomor Telepon
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={newCustomerData.phone}
                                        onChange={handleInputChange}
                                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="birthdate" className="block text-gray-700 text-sm font-bold mb-2">
                                        Tanggal Lahir
                                    </label>
                                    <input
                                        type="date"
                                        id="birthdate"
                                        name="birthdate"
                                        value={newCustomerData.birthdate}
                                        onChange={handleInputChange}
                                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="gender" className="block text-gray-700 text-sm font-bold mb-2">
                                        Jenis Kelamin
                                    </label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={newCustomerData.gender}
                                        onChange={handleInputChange}
                                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                                        required
                                    >
                                        <option value="">Pilih jenis kelamin</option>
                                        <option value="pria">Pria</option>
                                        <option value="wanita">Wanita</option>
                                        <option value="lainnya">Lainnya</option>
                                    </select>
                                </div>
                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        className="bg-sky-700 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded"
                                    >
                                        Daftar
                                    </button>
                                    <button
                                        type="button"
                                        className="ml-2 text-gray-500 hover:text-gray-700 font-semibold py-2 px-4"
                                        onClick={closeAddModal}
                                    >
                                        Batal
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="modal-overlay absolute inset-0 bg-gray-900 opacity-50"></div>
                    <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
                        <div className="modal-content py-4 text-left px-6">
                            <div className="flex justify-between items-center pb-3">
                                <p className="text-2xl font-bold">Edit Customer</p>
                                <button
                                    className="modal-close text-gray-500 hover:text-gray-700"
                                    onClick={closeEditModal}
                                >
                                    <svg
                                        className="fill-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 18 18"
                                    >
                                        <path
                                            d="M1 1l16 16m0-16L1 17"
                                            stroke="#808080"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <form onSubmit={handleEditSubmit}>
                                <div className="mt-4">
                                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                                        Nama
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={editCustomerData.name || ""}
                                        onChange={handleEditInputChange}
                                        required
                                        className="w-full mt-1 p-2 bg-gray-200 rounded border focus:border-blue-500 focus:bg-white focus:outline-none"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">
                                        Alamat
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        id="address"
                                        value={editCustomerData.address || ""}
                                        onChange={handleEditInputChange}
                                        className="w-full mt-1 p-2 bg-gray-200 rounded border focus:border-blue-500 focus:bg-white focus:outline-none"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={editCustomerData.email || ""}
                                        onChange={handleEditInputChange}
                                        className="w-full mt-1 p-2 bg-gray-200 rounded border focus:border-blue-500 focus:bg-white focus:outline-none"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
                                        Nomor Telepon
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        id="phone"
                                        value={editCustomerData.phone || ""}
                                        onChange={handleEditInputChange}
                                        className="w-full mt-1 p-2 bg-gray-200 rounded border focus:border-blue-500 focus:bg-white focus:outline-none"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="birthdate" className="block text-gray-700 text-sm font-bold mb-2">
                                        Tanggal Lahir
                                    </label>
                                    <input
                                        type="date"
                                        name="birthdate"
                                        id="birthdate"
                                        value={formatISODate(editCustomerData.birthdate) || ""}
                                        onChange={handleEditInputChange}
                                        className="w-full mt-1 p-2 bg-gray-200 rounded border focus:border-blue-500 focus:bg-white focus:outline-none"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="gender" className="block text-gray-700 text-sm font-bold mb-2">
                                        Jenis Kelamin
                                    </label>
                                    <select
                                        name="gender"
                                        id="gender"
                                        value={editCustomerData.gender || ""}
                                        onChange={handleEditInputChange}
                                        className="w-full mt-1 p-2 bg-gray-200 rounded border focus:border-blue-500 focus:bg-white focus:outline-none"
                                    >
                                        <option value="pria">Pria</option>
                                        <option value="wanita">Wanita</option>
                                        <option value="lainnya">Lainnya</option>
                                    </select>
                                </div>
                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        className="bg-sky-700 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="modal-overlay absolute inset-0 bg-gray-900 opacity-50"></div>
                    <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
                        <div className="modal-content py-4 text-left px-6">
                            <div className="flex justify-between items-center pb-3">
                                <p className="text-2xl font-bold">Hapus Customer</p>
                                <button
                                    className="modal-close text-gray-500 hover:text-gray-700"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    <svg
                                        className="fill-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 18 18"
                                    >
                                        <path
                                            d="M1 1l16 16m0-16L1 17"
                                            stroke="#808080"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-gray-700 my-8">Apakah Anda yakin ingin menghapus customer ini?</p>
                            <div className="mt-12">
                                <button
                                    className="bg-red-500 hover:bg-red-700 focus:bg-red-700 text-white font-semibold rounded py-2 px-4"
                                    onClick={confirmDelete}
                                >
                                    HAPUS
                                </button>
                                <button
                                    className="ml-2 text-gray-500 hover:text-gray-700 font-semibold py-2 px-4"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    BATAL
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}