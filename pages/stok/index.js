import { useEffect, useState } from "react";
import { getCookies } from "cookies-next";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { fetchAllBarangData, fetchCreateBarang, fetchDeleteBarangById, fetchEditBarangById } from "@/utils/helpers";

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

export default function Stok(props) {
    const { token } = props;
    const [loading, setLoading] = useState(true);
    // Read
    const [dataBarang, setDataBarang] = useState([]); //
    const [fetchNewBarangData, setFetchNewBarangData] = useState(false); //
    // Create
    const [showAddModal, setShowAddModal] = useState(false);
    const [newBarangData, setNewBarangData] = useState({ //
        kode: "",
        nama: "",
        harga_beli: "",
        harga_jual_terbaru: "",
        jumlah: "",
        kategori: "",
        // pembelian.id = -1 / null
    });
    // Update
    const [showEditModal, setShowEditModal] = useState(false);
    const [editBarangId, setEditBarangId] = useState(null);
    const [editBarangData, setEditBarangData] = useState({
        kode: "",
        nama: "",
        harga_beli: "",
        harga_jual_terbaru: "",
        jumlah: "",
        kategori: "",
    });
    // Delete
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteBarangId, setDeleteBarangId] = useState(null);
    // Pop Up
    const [popupMessage, setPopupMesage] = useState("");
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    // Search
    const [searchQuery, setSearchQuery] = useState("");
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalItems = dataBarang.length; //
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // const currentItems = dataBarang.slice(indexOfFirstItem, indexOfLastItem); //
    const filteredItems = dataBarang.filter((barang) => { //
        const lowerCaseQuery = searchQuery.toLowerCase();
        return (
            barang.kode.toString().toLowerCase().includes(lowerCaseQuery) || //
            barang.nama.toLowerCase().includes(lowerCaseQuery) //
        );
    });
    const noResults = filteredItems.length === 0;
    const totalFilteredItems = filteredItems.length;
    const totalFilteredPages = Math.ceil(totalFilteredItems / itemsPerPage);
    const currentFilteredItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    // READ ALL BARANG
    useEffect(() => {
        fetchAllBarangData(token) //
            .then((data) => {
                setDataBarang(data); //
                setLoading(false);
            })
            .catch((error) => {
                console.error(error.message);
                setLoading(false);
            });

        setFetchNewBarangData(false); //
    }, [fetchNewBarangData]); //

    // CREATE BARANG
    const openAddModal = () => {
        setShowAddModal(true);
    };

    const closeAddModal = () => {
        setShowAddModal(false);
        setNewBarangData({
            kode: "",
            nama: "",
            harga_beli: "",
            harga_jual_terbaru: "",
            jumlah: "",
            kategori: "",
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBarangData((prevData) => ({ //
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await fetchCreateBarang(token, newBarangData); //
            setFetchNewBarangData(true); //
            closeAddModal();
        } catch (error) {
            console.error("Error creating barang:", error.message);
        }
    };

    // UPDATE BARANG BY ID
    const openEditModal = (barangId) => {
        const barangToEdit = dataBarang.find((barang) => barang.id === barangId);
        if (barangToEdit) {
            setEditBarangId(barangId);
            setEditBarangData({
                kode: barangToEdit.kode,
                nama: barangToEdit.nama,
                harga_beli: barangToEdit.harga_beli,
                harga_jual_terbaru: barangToEdit.harga_jual_terbaru,
                jumlah: barangToEdit.jumlah,
                kategori: barangToEdit.kategori,
            });
            setShowEditModal(true);
        }
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setEditBarangId(null);
        setEditBarangData({
            kode: "",
            nama: "",
            harga_beli: "",
            harga_jual_terbaru: "",
            jumlah: "",
            kategori: "",
        });
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditBarangData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        try {
            await fetchEditBarangById(token, editBarangId, editBarangData);
            setFetchNewBarangData(true);
            closeEditModal();

            setPopupMesage("Barang berhasil diubah.");
            setShowSuccessPopup(true);
        } catch (error) {
            console.error("Error editing barang:", error.message);

            setPopupMesage("Barang gagal diubah.");
            setShowErrorPopup(true);
        }
    };

    // DELETE BARANG BY ID
    const openDeleteModal = (barangId) => {
        setDeleteBarangId(barangId); // Set the barang ID to be deleted
        setShowDeleteModal(true); // Show the delete modal
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const confirmDelete = async () => {
        try {
            await fetchDeleteBarangById(token, deleteBarangId);
            setFetchNewBarangData(true);

            setPopupMesage("Barang berhasil dihapus.");
            setShowSuccessPopup(true);
        } catch (error) {
            console.error("Error deleting barang:", error.message);

            setPopupMesage("Barang gagal dihapus.");
            setShowErrorPopup(true);
        } finally {
            setShowDeleteModal(false); // Close the delete modal
            setDeleteBarangId(null); // Reset the barang ID to be deleted
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
                        <ExportButton data={barang}></ExportButton> */}
                        <div className="flex flex-col justify-center ml-2 mr-2">
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
                                        <th className="w-1/6 truncate ... px-4 py-3">Kode Barang</th>
                                        <th className="w-1/6 truncate ... px-4 py-3">Nama Barang</th>
                                        <th className="w-1/6 truncate ... px-4 py-3">Harga Beli</th>
                                        <th className="w-1/6 truncate ... px-4 py-3">Jumlah</th>
                                        <th className="w-1/6 truncate ... px-4 py-3">Harga Jual</th>
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
                                    ) : (noResults ? (
                                        <tr>
                                            <td colSpan="7" className="text-center py-4">
                                                Tidak ada data yang ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        currentFilteredItems.map((barang, index) => (
                                            <tr
                                                key={barang.id}
                                                className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400"
                                            >
                                                <td className="w-1/12 truncate ... px-4 text-sm">{index + 1 + indexOfFirstItem}</td>
                                                <td className="uppercase w-1/6 truncate ... px-4 text-sm">{barang.kode || "-"}</td>
                                                <td className="uppercase w-1/6 truncate ... px-4 text-sm">{barang.nama || "-"}</td>
                                                <td className="w-1/6 truncate ... px-4 text-sm">{barang.harga_beli || "-"}</td>
                                                <td className="w-1/6 truncate ... px-4 text-sm">{barang.jumlah || "-"}</td>
                                                <td className="w-1/6 truncate ... px-4 text-sm">{barang.harga_jual_terbaru || "-"}</td>
                                                <td className="px-4 text-sm flex justify-end">
                                                    <button
                                                        type="button"
                                                        className="text-gray-500 hover:text-gray-700 font-semibold py-2 px-4"
                                                        onClick={() => openEditModal(barang.id)}
                                                    >
                                                        UBAH
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="ml-2 text-gray-500 hover:text-gray-700 font-semibold py-2 px-4"
                                                        onClick={() => openDeleteModal(barang.id)}
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

            {showAddModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="modal-overlay absolute inset-0 bg-gray-900 opacity-50"></div>
                    <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
                        <div className="modal-content py-4 text-left px-6">
                            <div className="flex justify-between items-center pb-3">
                                <p className="text-2xl font-bold">Tambah Stok</p>
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
                                    <label htmlFor="kode" className="block text-gray-700 text-sm font-bold mb-2">
                                        Kode
                                    </label>
                                    <input
                                        type="text"
                                        id="kode"
                                        name="kode"
                                        value={newBarangData.kode}
                                        onChange={handleInputChange}
                                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                                        required
                                    />
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="nama" className="block text-gray-700 text-sm font-bold mb-2">
                                        Nama Barang
                                    </label>
                                    <input
                                        type="text"
                                        id="nama"
                                        name="nama"
                                        value={newBarangData.nama}
                                        onChange={handleInputChange}
                                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                                        required
                                    />
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="harga_beli" className="block text-gray-700 text-sm font-bold mb-2">
                                        Harga Beli
                                    </label>
                                    <input
                                        type="text"
                                        id="harga_beli"
                                        name="harga_beli"
                                        value={newBarangData.harga_beli}
                                        onChange={handleInputChange}
                                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                                        required
                                    />
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="jumlah" className="block text-gray-700 text-sm font-bold mb-2">
                                        Jumlah Barang
                                    </label>
                                    <input
                                        type="text"
                                        id="jumlah"
                                        name="jumlah"
                                        value={newBarangData.jumlah}
                                        onChange={handleInputChange}
                                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                                        required
                                    />
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="harga_jual_terbaru" className="block text-gray-700 text-sm font-bold mb-2">
                                        Harga Jual
                                    </label>
                                    <input
                                        type="text"
                                        id="harga_jual_terbaru"
                                        name="harga_jual_terbaru"
                                        value={newBarangData.harga_jual_terbaru}
                                        onChange={handleInputChange}
                                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                                        required
                                    />
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="kategori" className="block text-gray-700 text-sm font-bold mb-2">
                                        Kategori
                                    </label>
                                    <select
                                        id="kategori"
                                        name="kategori"
                                        value={newBarangData.kategori}
                                        onChange={handleInputChange}
                                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                                        required
                                    >
                                        <option value="">Pilih kategori</option>
                                        <option value="spare_part">Spare part</option>
                                        <option value="oli">Oli</option>
                                        <option value="jasa">Jasa</option>
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
                                <p className="text-2xl font-bold">Edit Stok</p>
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
                                    <label htmlFor="kode" className="block text-gray-700 text-sm font-bold mb-2">
                                        Kode
                                    </label>
                                    <input
                                        type="text"
                                        name="kode"
                                        id="kode"
                                        value={editBarangData.kode || ""}
                                        onChange={handleEditInputChange}
                                        required
                                        className="w-full mt-1 p-2 bg-gray-200 rounded border focus:border-blue-500 focus:bg-white focus:outline-none"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="nama" className="block text-gray-700 text-sm font-bold mb-2">
                                        Nama
                                    </label>
                                    <input
                                        type="text"
                                        name="nama"
                                        id="nama"
                                        value={editBarangData.nama || ""}
                                        onChange={handleEditInputChange}
                                        required
                                        className="w-full mt-1 p-2 bg-gray-200 rounded border focus:border-blue-500 focus:bg-white focus:outline-none"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="harga_beli" className="block text-gray-700 text-sm font-bold mb-2">
                                        Harga Beli
                                    </label>
                                    <input
                                        type="text"
                                        name="harga_beli"
                                        id="harga_beli"
                                        value={editBarangData.harga_beli || ""}
                                        onChange={handleEditInputChange}
                                        required
                                        className="w-full mt-1 p-2 bg-gray-200 rounded border focus:border-blue-500 focus:bg-white focus:outline-none"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="harga_jual_terbaru" className="block text-gray-700 text-sm font-bold mb-2">
                                        Harga Jual
                                    </label>
                                    <input
                                        type="text"
                                        name="harga_jual_terbaru"
                                        id="harga_jual_terbaru"
                                        value={editBarangData.harga_jual_terbaru || ""}
                                        onChange={handleEditInputChange}
                                        required
                                        className="w-full mt-1 p-2 bg-gray-200 rounded border focus:border-blue-500 focus:bg-white focus:outline-none"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="jumlah" className="block text-gray-700 text-sm font-bold mb-2">
                                        Jumlah
                                    </label>
                                    <input
                                        type="text"
                                        name="jumlah"
                                        id="jumlah"
                                        value={editBarangData.jumlah || ""}
                                        onChange={handleEditInputChange}
                                        required
                                        className="w-full mt-1 p-2 bg-gray-200 rounded border focus:border-blue-500 focus:bg-white focus:outline-none"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="kategori" className="block text-gray-700 text-sm font-bold mb-2">
                                        Kategori
                                    </label>
                                    <select
                                        name="kategori"
                                        id="kategori"
                                        value={editBarangData.kategori || ""}
                                        onChange={handleEditInputChange}
                                        required
                                        className="w-full mt-1 p-2 bg-gray-200 rounded border focus:border-blue-500 focus:bg-white focus:outline-none"
                                    >
                                        <option value="spare_part">Spare Part</option>
                                        <option value="oli">Oli</option>
                                        <option value="jasa">Jasa</option>
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
                                <p className="text-2xl font-bold">Hapus Stok</p>
                                <button
                                    className="modal-close text-gray-500 hover:text-gray-700"
                                    onClick={closeDeleteModal}
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
                            <p className="text-gray-700 mt-8">Apakah Anda yakin ingin menghapus stok ini?</p>
                            <div className="mt-12">
                                <button
                                    className="bg-red-500 hover:bg-red-700 focus:bg-red-700 text-white font-semibold rounded py-2 px-4"
                                    onClick={confirmDelete}
                                >
                                    HAPUS
                                </button>
                                <button
                                    className="ml-2 text-gray-500 hover:text-gray-700 font-semibold py-2 px-4"
                                    onClick={closeDeleteModal}
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