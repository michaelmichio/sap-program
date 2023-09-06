import { useEffect, useState } from "react";
import { getCookies } from "cookies-next";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { fetchAllInvoicePembelianData, fetchCreateInvoicePembelian, fetchCreatePembelianByInvoiceId, fetchDeleteInvoicePembelianById, fetchDeletePembelianById, fetchEditInvoicePembelianById, fetchPembelianDataByInvoiceId, formatISODate } from "@/utils/helpers";

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

export default function Pembelian(props) {
    const { token } = props;
    const [loading, setLoading] = useState(true);

    // READ INVOICE
    const [dataInvoice, setDataInvoice] = useState([]);
    const [fetchNewInvoiceData, setFetchNewInvoiceData] = useState(false);

    // READ ALL PEMBELIAN BY INVOICE ID
    const [selectedInvoiceData, setSelectedInvoiceData] = useState({
        nomor_invoice: "",
        tanggal: "",
        pemasok: "",
        total_harga: "",
    });
    const [selectedPembelianData, setSelectedPembelianData] = useState([]);
    const [fetchNewPembelianData, setFetchNewPembelianData] = useState(false);

    // CREATE INVOICE
    const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
    const [newInvoiceData, setNewInvoiceData] = useState({
        nomor_invoice: "",
        tanggal: "",
        pemasok: "",
        total_harga: "",
    });

    // CREATE PEMBELIAN BY INVOICE ID
    const [showAddPembelianModal, setShowAddPembelianModal] = useState(false);
    const [newPembelianData, setNewPembelianData] = useState({
        nomor_invoice: "",
        tanggal: "",
        pemasok: "",
        kode_barang: "",
        nama_barang: "",
        jumlah: "",
        harga: "",
        gross: "",
        diskon: "",
        ppn: "",
        total_harga: "",
        invoice_pembelian_id: "",
    });

    // UPDATE INVOICE
    const [showEditInvoiceModal, setShowEditInvoiceModal] = useState(false);
    const [editInvoiceId, setEditInvoiceId] = useState(null);

    // DELETE INVOICE
    const [showDeleteInvoiceModal, setShowDeleteInvoiceModal] = useState(false);
    const [deleteInvoiceId, setDeleteInvoiceId] = useState(null);

    // DELETE PEMBELIAN
    const [showDeletePembelianModal, setShowDeletePembelianModal] = useState(false);
    const [deletePembelianId, setDeletePembelianId] = useState(null);

    // POP UP
    const [popupMessage, setPopupMesage] = useState("");
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);

    // SEARCH
    const [searchQuery, setSearchQuery] = useState("");

    // PAGINATION
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalItems = dataInvoice.length; //
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const filteredItems = dataInvoice.filter((invoice) => { //
        const lowerCaseQuery = searchQuery.toLowerCase();
        return (
            invoice.nomor_invoice.toString().toLowerCase().includes(lowerCaseQuery) || //
            invoice.pemasok.toLowerCase().includes(lowerCaseQuery) //
        );
    });
    const noResults = filteredItems.length === 0;
    const totalFilteredItems = filteredItems.length;
    const totalFilteredPages = Math.ceil(totalFilteredItems / itemsPerPage);
    const currentFilteredItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    // READ ALL INVOICE
    useEffect(() => {
        fetchAllInvoicePembelianData(token)
            .then((data) => {
                setDataInvoice(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error.message);
                setLoading(false);
            });

        setFetchNewInvoiceData(false);
    }, [fetchNewInvoiceData]);

    // READ ALL PEMBELIAN BY INVOICE ID
    const openSelectedInvoiceModal = (invoice) => {
        setSelectedInvoiceData(invoice);
        setFetchNewPembelianData(true);
        setShowAddPembelianModal(true);
    }

    useEffect(() => {
        if (selectedInvoiceData) {
            fetchPembelianDataByInvoiceId(token, selectedInvoiceData.id)
                .then((data) => {
                    setSelectedPembelianData(data);
                })
                .catch((error) => {
                    console.error(error.message);
                });

            setFetchNewPembelianData(false);
        }
    }, [fetchNewPembelianData]);

    const closeAddPembelianModal = () => {
        setShowAddPembelianModal(false);
        setSelectedInvoiceData({
            nomor_invoice: "",
            tanggal: "",
            pemasok: "",
            total_harga: "",
        });
    };

    // CREATE INVOICE
    const openAddInvoiceModal = () => {
        setShowAddInvoiceModal(true);
    };

    const closeAddInvoiceModal = () => {
        setShowAddInvoiceModal(false);
        setNewInvoiceData({
            nomor_invoice: "",
            tanggal: "",
            pemasok: "",
        });
    };

    const handleInputInvoiceChange = (e) => {
        const { name, value } = e.target;

        setNewInvoiceData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleInvoiceSubmit = async (e) => {
        e.preventDefault();

        try {
            await fetchCreateInvoicePembelian(token, newInvoiceData);
            setFetchNewInvoiceData(true);
            closeAddInvoiceModal();
        } catch (error) {
            console.error("Error creating invoice:", error.message);
        }
    };

    // CREATE PEMBELIAN BY INVOICE ID
    const handleInputPembelianChange = (e) => {
        const { name, value } = e.target;

        setNewPembelianData((prevData) => ({
            ...prevData,
            [name]: value,
            invoice_pembelian_id: selectedInvoiceData.id,
        }));
    };

    const handlePembelianSubmit = async (e) => {
        e.preventDefault();

        try {
            await fetchCreatePembelianByInvoiceId(token, newPembelianData);
            setNewPembelianData({
                nomor_invoice: "",
                tanggal: "",
                pemasok: "",
                kode_barang: "",
                nama_barang: "",
                jumlah: "",
                harga: "",
                gross: "",
                diskon: "",
                ppn: "",
                total_harga: "",
                invoice_pembelian_id: selectedInvoiceData.id,
            });
            setFetchNewPembelianData(true);
            setFetchNewInvoiceData(true);
        } catch (error) {
            console.error("Error creating invoice:", error.message);
        }
    };

    // UPDATE INVOICE FOR SUBMIT
    const openEditInvoiceModal = (invoiceId) => {
        setEditInvoiceId(invoiceId);
        setShowEditInvoiceModal(true);
    };

    const closeEditInvoiceModal = () => {
        setShowEditInvoiceModal(false);
        setEditInvoiceId(null);
    };

    const confirmEditInvoice = async (e) => {
        e.preventDefault();

        try {
            await fetchEditInvoicePembelianById(token, editInvoiceId);
            setFetchNewInvoiceData(true);
            closeAddPembelianModal();
            closeEditInvoiceModal();

            setPopupMesage("Invoice berhasil diubah.");
            setShowSuccessPopup(true);
        } catch (error) {
            console.error("Error editing invoice:", error.message);

            setPopupMesage("Invoice gagal diubah.");
            setShowErrorPopup(true);
        }
    };

    // DELETE INVOICE BY ID
    const openDeleteInvoiceModal = (invoiceId) => {
        setDeleteInvoiceId(invoiceId); // Set the invoice ID to be deleted
        setShowDeleteInvoiceModal(true); // Show the delete modal
    };

    const closeDeleteInvoiceModal = () => {
        setShowDeleteInvoiceModal(false);
    };

    const confirmDeleteInvoice = async (e) => {
        e.preventDefault();

        try {
            await fetchDeleteInvoicePembelianById(token, deleteInvoiceId);
            setFetchNewInvoiceData(true);

            setPopupMesage("Invoice berhasil dihapus.");
            setShowSuccessPopup(true);
        } catch (error) {
            console.error("Error deleting invoice:", error.message);

            setPopupMesage("Invoice gagal dihapus.");
            setShowErrorPopup(true);
        } finally {
            setShowDeleteInvoiceModal(false); // Close the delete modal
            setDeleteInvoiceId(null); // Reset the invoice ID to be deleted
        }
    };

    // DELETE PEMBELIAN BY ID
    const openDeletePembelianModal = (pembelianId) => {
        setDeletePembelianId(pembelianId); // Set the pembelian ID to be deleted
        setShowDeletePembelianModal(true); // Show the delete modal
    };

    const closeDeletePembelianModal = () => {
        setShowDeletePembelianModal(false);
    };

    const confirmDeletePembelian = async (e) => {
        e.preventDefault();

        try {
            await fetchDeletePembelianById(token, deletePembelianId);
            setFetchNewPembelianData(true);

            setPopupMesage("Pembelian berhasil dihapus.");
            setShowSuccessPopup(true);
        } catch (error) {
            console.error("Error deleting pembelian:", error.message);

            setPopupMesage("Pembelian gagal dihapus.");
            setShowErrorPopup(true);
        } finally {
            setShowDeletePembelianModal(false); // Close the delete modal
            setDeletePembelianId(null); // Reset the pembelian ID to be deleted
        }
    };

    return (
        <div className="font-mono min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-white dark:bg-gray-700 text-black dark:text-white">

            <Navbar />

            <Sidebar />

            <div className="h-full ml-14 mt-14 md:ml-64">
                <div className="flex justify-between w-full px-4 mt-4">
                    <div className="w-1/2 box flex flex-col justify-center">
                        <div className="box-wrapper">
                            <div className=" bg-white rounded flex items-center w-full p-3 shadow-sm border border-gray-200">
                                <button className="outline-none focus:outline-none"><svg className=" w-5 text-gray-600 h-5 cursor-pointer" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></button>
                                <input
                                    type="search"
                                    name=""
                                    id=""
                                    placeholder="search"
                                    x-model="q"
                                    className="w-full pl-4 text-sm outline-none focus:outline-none bg-transparent"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1); // Set currentPage to 1 after search
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        {/* <div className="flex flex-col justify-center ml-2 mr-2">
                            <button
                                type="button"
                                className="bg-green-400 hover:bg-green-300 text-white font-semibold py-2 px-4 rounded"
                                onClick={openImportModal}
                            >
                                IMPORT
                            </button>
                        </div>
                        <ExportButton data={dataPembelian}></ExportButton> */}
                        <div className="flex flex-col justify-center ml-2 mr-2">
                            <button
                                type="button"
                                className="bg-sky-700 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded"
                                onClick={openAddInvoiceModal}
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
                                        <th className="w-1/6 truncate ... px-4 py-3">Nomor Invoice</th>
                                        <th className="w-1/6 truncate ... px-4 py-3">Tanggal Invoice</th>
                                        <th className="w-1/6 truncate ... px-4 py-3">Nama Supplier</th>
                                        <th className="w-1/6 truncate ... px-4 py-3">Total Biaya</th>
                                        <th className="w-1/6 truncate ... px-4 py-3">Status</th>
                                        <th className="truncate ... px-4 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4">
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : (noResults ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4">
                                                Tidak ada data yang ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        currentFilteredItems.map((invoice, index) => (
                                            <tr
                                                key={invoice.id}
                                                className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400"
                                            >
                                                <td className="w-1/12 truncate ... px-4 text-sm">{index + 1 + indexOfFirstItem}</td>
                                                <td className="w-1/6 truncate ... px-4 text-sm">{invoice.nomor_invoice}</td>
                                                <td className="w-1/6 truncate ... px-4 text-sm">{formatISODate(invoice.tanggal)}</td>
                                                <td className="uppercase w-1/6 truncate ... px-4 text-sm">{invoice.pemasok}</td>
                                                <td className="w-1/6 truncate ... px-4 text-sm">{invoice.total_harga || "0"}</td>
                                                <td className="uppercase w-1/6 truncate ... px-4 text-sm">{invoice.status}</td>
                                                <td className="px-4 text-sm flex justify-end">
                                                    <button
                                                        type="button"
                                                        className="text-gray-500 hover:text-gray-700 font-semibold py-2 px-4"
                                                        onClick={() => openSelectedInvoiceModal(invoice)}
                                                    >
                                                        {invoice.status === "pending" ? "INPUT" : "LIHAT"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="ml-2 text-gray-500 hover:text-gray-700 font-semibold py-2 px-4"
                                                        onClick={() => openDeleteInvoiceModal(invoice.id)}
                                                    >
                                                        HAPUS
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex flex-col px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
                            <div className="flex flex-row justify-end">
                                <span className="flex text-xs xs:text-sm text-gray-500 normal-case text-center">
                                    Halaman {currentPage} dari {totalFilteredPages} ({totalFilteredItems} data)
                                </span>
                            </div>
                            <div className="flex flex-row justify-end mt-1">
                                <div className="flex xs:mt-0">
                                    <button
                                        className={`text-sm bg-gray-300 hover:bg-sky-700 text-white hover:text-white font-semibold py-2 px-4 rounded-l ${currentPage === 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                                            }`}
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Prev
                                    </button>
                                    <button
                                        className={`text-sm bg-gray-300 hover:bg-sky-700 text-white hover:text-white font-semibold py-2 px-4 rounded-r ${currentPage === totalPages ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                                            }`}
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showAddInvoiceModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="modal-overlay absolute inset-0 bg-gray-900 opacity-50"></div>
                    <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
                        <div className="modal-content py-4 text-left px-6">
                            <div className="flex justify-between items-center pb-3">
                                <p className="text-2xl font-bold">Tambah Invoice</p>
                                <button
                                    className="modal-close text-gray-500 hover:text-gray-700"
                                    onClick={closeAddInvoiceModal}
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
                            <form onSubmit={handleInvoiceSubmit}>
                                <div className="mt-4">
                                    <label htmlFor="nomor_invoice" className="block text-gray-700 text-sm font-bold mb-2">
                                        Nomor Invoice
                                    </label>
                                    <input
                                        type="text"
                                        id="nomor_invoice"
                                        name="nomor_invoice"
                                        value={dataInvoice.nomor_invoice}
                                        onChange={handleInputInvoiceChange}
                                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                                        required
                                    />
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="pemasok" className="block text-gray-700 text-sm font-bold mb-2">
                                        Pemasok/Supplier
                                    </label>
                                    <input
                                        type="text"
                                        id="pemasok"
                                        name="pemasok"
                                        value={dataInvoice.pemasok}
                                        onChange={handleInputInvoiceChange}
                                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                                        required
                                    />
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="tanggal" className="block text-gray-700 text-sm font-bold mb-2">
                                        Tanggal Invoice
                                    </label>
                                    <input
                                        type="date"
                                        id="tanggal"
                                        name="tanggal"
                                        value={dataInvoice.tanggal}
                                        onChange={handleInputInvoiceChange}
                                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                                        required
                                    />
                                </div>
                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        className="bg-sky-700 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded"
                                    >
                                        Simpan
                                    </button>
                                    <button
                                        type="button"
                                        className="ml-2 text-gray-500 hover:text-gray-700 font-semibold py-2 px-4"
                                        onClick={closeAddInvoiceModal}
                                    >
                                        Batal
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {showAddPembelianModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="modal-overlay absolute inset-0 bg-gray-900 opacity-50"></div>
                    <div className="modal-container bg-white mx-auto w-9/12 md:w-9/12 bg-gray-100 rounded shadow-lg z-50 overflow-y-auto">
                        <div className="modal-content text-left p-4">
                            <div className="flex justify-between items-center">
                                <p className="text-2xl font-bold"></p>
                                <button
                                    className="modal-close text-gray-500 hover:text-gray-700"
                                    onClick={closeAddPembelianModal}
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
                            {/* Start - Main Card */}
                            <div className="flex-auto lg:px-4 pt-0">
                                {/* Start - Main Content */}
                                <h6 className="text-gray-400 text-sm my-2 font-bold uppercase">
                                    Informasi Invoice Pembelian
                                </h6>
                                <div className="flex flex-wrap justify-between">
                                    <div className="w-full lg:w-2/12 px-4">
                                        <div className="relative w-full">
                                            <label className="block uppercase text-gray-600 text-sm font-bold" >
                                                Nomor Invoice:
                                            </label>
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-2/12 px-4">
                                        <div className="relative w-full">
                                            <label className="block uppercase text-gray-600" >
                                                {selectedInvoiceData.nomor_invoice}
                                            </label>
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-2/12 px-4">
                                        <div className="relative w-full">
                                            <label className="block uppercase text-gray-600 text-sm font-bold" >
                                                Tanggal Invoice:
                                            </label>
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-2/12 px-4">
                                        <div className="relative w-full">
                                            <label className="block uppercase text-gray-600" >
                                                {formatISODate(selectedInvoiceData.tanggal)}
                                            </label>
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-2/12 px-4">
                                        <div className="relative w-full">
                                            <label className="block uppercase text-gray-600 text-sm font-bold" >
                                                Pemasok/Supplier:
                                            </label>
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-2/12 px-4">
                                        <div className="relative w-full">
                                            <label className="block uppercase text-gray-600" >
                                                {selectedInvoiceData.pemasok}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <hr className="my-2 border-b-1 border-gray-300" />
                                {selectedInvoiceData.status === "pending" && (
                                    <form onSubmit={handlePembelianSubmit} className="flex flex-wrap">
                                        <div className="w-full lg:w-3/12 px-4">
                                            <div className="relative w-full mb-1">
                                                <label className="block uppercase text-gray-600 text-xs font-bold" >
                                                    Kode Barang:
                                                </label>
                                                <input value={newPembelianData.kode_barang} onChange={handleInputPembelianChange} required name="kode_barang" type="text" className="p-1 border border-gray-300 rounded w-full" />
                                            </div>
                                        </div>
                                        <div className="w-full lg:w-3/12 px-4">
                                            <div className="relative w-full mb-1">
                                                <label className="block uppercase text-gray-600 text-xs font-bold" >
                                                    Nama Barang:
                                                </label>
                                                <input value={newPembelianData.nama_barang} onChange={handleInputPembelianChange} required name="nama_barang" type="text" className="p-1 border border-gray-300 rounded w-full" />
                                            </div>
                                        </div>
                                        <div className="w-full lg:w-2/12 px-4">
                                            <div className="relative w-full mb-1">
                                                <label className="block uppercase text-gray-600 text-xs font-bold" >
                                                    Kategori Barang:
                                                </label>
                                                <select
                                                    id="kategori"
                                                    name="kategori"
                                                    value={newPembelianData.kategori}
                                                    onChange={handleInputPembelianChange}
                                                    className="p-1 border border-gray-300 rounded w-full"
                                                    required
                                                >
                                                    <option value="">Pilih kategori</option>
                                                    <option value="spare_part">Spare part</option>
                                                    <option value="oli">Oli</option>
                                                    <option value="jasa">Jasa</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-full lg:w-1/12 px-4">
                                            <div className="relative w-full mb-1">
                                                <label className="block uppercase text-gray-600 text-xs font-bold" >
                                                    Jumlah:
                                                </label>
                                                <input value={newPembelianData.jumlah} onChange={handleInputPembelianChange} required name="jumlah" type="text" className="p-1 border border-gray-300 rounded w-full" />
                                            </div>
                                        </div>
                                        <div className="w-full lg:w-3/12 px-4">
                                            <div className="relative w-full mb-1">
                                                <label className="block uppercase text-gray-600 text-xs font-bold" >
                                                    Harga:
                                                </label>
                                                <input value={newPembelianData.harga} onChange={handleInputPembelianChange} required name="harga" type="text" className="p-1 border border-gray-300 rounded w-full" />
                                            </div>
                                        </div>
                                        <div className="w-full lg:w-3/12 px-4">
                                            <div className="relative w-full mb-1">
                                                <label className="block uppercase text-gray-600 text-xs font-bold" >
                                                    Gross:
                                                </label>
                                                <input value={newPembelianData.gross} onChange={handleInputPembelianChange} required name="gross" type="text" className="p-1 border border-gray-300 rounded w-full" />
                                            </div>
                                        </div>
                                        <div className="w-full lg:w-2/12 px-4">
                                            <div className="relative w-full mb-1">
                                                <label className="block uppercase text-gray-600 text-xs font-bold" >
                                                    Diskon:
                                                </label>
                                                <input value={newPembelianData.diskon} onChange={handleInputPembelianChange} required name="diskon" type="text" className="p-1 border border-gray-300 rounded w-full" />
                                            </div>
                                        </div>
                                        <div className="w-full lg:w-2/12 px-4">
                                            <div className="relative w-full mb-1">
                                                <label className="block uppercase text-gray-600 text-xs font-bold" >
                                                    PPN:
                                                </label>
                                                <input value={newPembelianData.ppn} onChange={handleInputPembelianChange} required name="ppn" type="text" className="p-1 border border-gray-300 rounded w-full" />
                                            </div>
                                        </div>
                                        <div className="w-full lg:w-3/12 px-4">
                                            <div className="relative w-full mb-1">
                                                <label className="block uppercase text-gray-600 text-xs font-bold" >
                                                    Harga Total:
                                                </label>
                                                <input value={newPembelianData.total_harga} onChange={handleInputPembelianChange} required name="total_harga" type="text" className="p-1 border border-gray-300 rounded w-full" />
                                            </div>
                                        </div>
                                        <div className="w-full lg:w-2/12">
                                            <div className="relative w-full mb-1">
                                                <label className="block uppercase text-gray-600 text-xs font-bold" >
                                                    <br />
                                                </label>
                                                <div className="text-center flex justify-end">
                                                    <button type="submit" className="bg-sky-700 hover:bg-sky-600 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150">
                                                        Tambah
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                )}
                                <div className="w-full overflow-hidden rounded-lg shadow-xs">
                                    <div className="w-full overflow-x-auto overflow-y-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                                                    <th className="w-1/12 truncate ... px-4 py-3">No.</th>
                                                    <th className="w-2/12 truncate ... px-4 py-3">Kode Barang</th>
                                                    <th className="w-2/12 truncate ... px-4 py-3">Nama Barang</th>
                                                    <th className="w-2/12 truncate ... px-4 py-3">Jumlah</th>
                                                    <th className="w-2/12 truncate ... px-4 py-3">Harga</th>
                                                    <th className="w-2/12 truncate ... px-4 py-3">Diskon</th>
                                                    <th className="w-2/12 truncate ... px-4 py-3">PPN</th>
                                                    <th className="w-2/12 truncate ... px-4 py-3">Gross</th>
                                                    <th className="w-2/12 truncate ... px-4 py-3">Harga Total</th>
                                                    <th className="w-2/12 px-4 py-3"><br /></th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                                                {selectedPembelianData.length == 0 ?
                                                    (<tr>
                                                        <td colSpan="10" className="text-center py-2">
                                                            Belum ada data pembelian.
                                                        </td>
                                                    </tr>)
                                                    :
                                                    (selectedPembelianData.map((pembelian, index) => (
                                                        <tr key={pembelian.id}>
                                                            <td className="w-1/12 truncate ... px-4">{index + 1}</td>
                                                            <td className="w-2/12 truncate ... px-4">{pembelian.kode_barang}</td>
                                                            <td className="w-2/12 truncate ... px-4">{pembelian.nama_barang}</td>
                                                            <td className="w-2/12 truncate ... px-4">{pembelian.jumlah}</td>
                                                            <td className="w-2/12 truncate ... px-4">{pembelian.harga}</td>
                                                            <td className="w-2/12 truncate ... px-4">{pembelian.diskon}</td>
                                                            <td className="w-2/12 truncate ... px-4">{pembelian.ppn}</td>
                                                            <td className="w-2/12 truncate ... px-4">{pembelian.gross}</td>
                                                            <td className="w-2/12 truncate ... px-4">{pembelian.total_harga}</td>
                                                            <td className="w-2/12 px-4">
                                                                {selectedInvoiceData.status === "pending" && (
                                                                    <button
                                                                        type="button"
                                                                        className="text-xs text-gray-500 hover:text-gray-700 font-semibold py-2 px-4"
                                                                        onClick={() => openDeletePembelianModal(pembelian.id)}
                                                                    >
                                                                        HAPUS
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <hr className="my-2 border-b-1 border-gray-300" />
                                <div className="flex flex-wrap justify-end">
                                    <div className="w-full lg:w-2/12 px-4">
                                        <div className="relative w-full">
                                            <label className="block uppercase text-gray-600 text-sm font-bold" >
                                                Total Gross
                                            </label>
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-2/12 px-4">
                                        <div className="relative w-full">
                                            <label className="block uppercase text-gray-600 font-bold" >
                                                {selectedInvoiceData.total_gross || "-"}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap justify-end">
                                    <div className="w-full lg:w-2/12 px-4">
                                        <div className="relative w-full">
                                            <label className="block uppercase text-gray-600 text-sm font-bold" >
                                                Total Diskon
                                            </label>
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-2/12 px-4">
                                        <div className="relative w-full">
                                            <label className="block uppercase text-gray-600 font-bold" >
                                                {selectedInvoiceData.total_diskon || "-"}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap justify-end">
                                    <div className="w-full lg:w-2/12 px-4">
                                        <div className="relative w-full">
                                            <label className="block uppercase text-gray-600 text-sm font-bold" >
                                                PPN
                                            </label>
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-2/12 px-4">
                                        <div className="relative w-full">
                                            <label className="block uppercase text-gray-600 font-bold" >
                                                {selectedInvoiceData.total_ppn || "-"}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap justify-end">
                                    <div className="w-full lg:w-2/12 px-4">
                                        <div className="relative w-full">
                                            <label className="block uppercase text-gray-600 text-sm font-bold" >
                                                Total Harga
                                            </label>
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-2/12 px-4">
                                        <div className="relative w-full">
                                            <label className="block uppercase text-gray-600 font-bold" >
                                                {selectedInvoiceData.total_harga || "-"}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {/* End - Main Content */}
                                {selectedInvoiceData.status === "pending" && (
                                    <>
                                        <hr className="my-2 border-b-1 border-gray-300" />
                                        <div className="flex w-full justify-end">
                                            <button
                                                type="button"
                                                className="bg-sky-700 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded"
                                                onClick={() => openEditInvoiceModal(selectedInvoiceData.id)}
                                            >
                                                SELESAI
                                            </button>
                                        </div>
                                    </>
                                )}

                            </div>
                            {/* End - Main Card */}
                        </div>
                    </div>
                </div>
            )}

            {showEditInvoiceModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="modal-overlay absolute inset-0 bg-gray-900 opacity-50"></div>
                    <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
                        <div className="modal-content py-4 text-left px-6">
                            <div className="flex justify-between items-center pb-3">
                                <p className="text-2xl font-bold">Selesaikan Invoice</p>
                                <button
                                    className="modal-close text-gray-500 hover:text-gray-700"
                                    onClick={closeEditInvoiceModal}
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
                            <p className="text-gray-700 mt-8">Apakah Anda yakin ingin menyelesaikan invoice ini?</p>
                            <p className="text-gray-700">Invoice yang sudah selesai tidak dapat diubah lagi.</p>
                            <div className="mt-12">
                                <button
                                    className="bg-sky-700 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded"
                                    onClick={confirmEditInvoice}
                                >
                                    SELESAI
                                </button>
                                <button
                                    className="ml-2 text-gray-500 hover:text-gray-700 font-semibold py-2 px-4"
                                    onClick={closeEditInvoiceModal}
                                >
                                    BATAL
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteInvoiceModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="modal-overlay absolute inset-0 bg-gray-900 opacity-50"></div>
                    <div className="modal-container bg-white w-11/12 md:max-w-lg mx-auto rounded shadow-lg z-50 overflow-y-auto">
                        <div className="modal-content py-4 text-left px-6">
                            <div className="flex justify-between items-center pb-3">
                                <p className="text-2xl font-bold">Hapus Invoice</p>
                                <button
                                    className="modal-close text-gray-500 hover:text-gray-700"
                                    onClick={closeDeleteInvoiceModal}
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
                            <p className="text-gray-700 mt-8">Apakah Anda yakin ingin menghapus invoice ini?</p>
                            <p className="text-blue-500 mt-8 text-sm">
                                Jumlah stok barang akan dikembalikan secara otomatis untuk invoice dengan status "PENDING", dan perlu dilakukan secara manual untuk invoice dengan status "SELESAI".
                            </p>
                            <div className="mt-12">
                                <button
                                    className="bg-red-500 hover:bg-red-700 focus:bg-red-700 text-white font-semibold rounded py-2 px-4"
                                    onClick={confirmDeleteInvoice}
                                >
                                    HAPUS
                                </button>
                                <button
                                    className="ml-2 text-gray-500 hover:text-gray-700 font-semibold py-2 px-4"
                                    onClick={closeDeleteInvoiceModal}
                                >
                                    BATAL
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showDeletePembelianModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="modal-overlay absolute inset-0 bg-gray-900 opacity-50"></div>
                    <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
                        <div className="modal-content py-4 text-left px-6">
                            <div className="flex justify-between items-center pb-3">
                                <p className="text-2xl font-bold">Hapus Barang</p>
                                <button
                                    className="modal-close text-gray-500 hover:text-gray-700"
                                    onClick={closeDeletePembelianModal}
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
                            <p className="text-gray-700 mt-8">Apakah Anda yakin ingin menghapus barang ini?</p>
                            <div className="mt-12">
                                <button
                                    className="bg-red-500 hover:bg-red-700 focus:bg-red-700 text-white font-semibold rounded py-2 px-4"
                                    onClick={confirmDeletePembelian}
                                >
                                    HAPUS
                                </button>
                                <button
                                    className="ml-2 text-gray-500 hover:text-gray-700 font-semibold py-2 px-4"
                                    onClick={closeDeletePembelianModal}
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
