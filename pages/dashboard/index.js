import { useEffect, useState } from "react";
import { getCookies } from "cookies-next";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

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
        props: {}
    };
}

export default function Stok() {
    const [loading, setLoading] = useState(true);
    const [dataBarang, setDataBarang] = useState([]);
    // Pop Up
    const [popupMessage, setPopupMesage] = useState("");
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    // Search
    const [searchQuery, setSearchQuery] = useState("");
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalItems = dataBarang.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = dataBarang.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        setLoading(false);
    }, []);

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
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
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
                                        <th className="w-1/6 truncate ... px-4 py-3">Harga Jual</th>
                                        <th className="w-1/6 truncate ... px-4 py-3">Jumlah Terjual</th>
                                        <th className="w-1/6 truncate ... px-4 py-3">HPP</th>
                                        <th className="truncate ... px-4 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="8" className="text-center py-4">
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : (
                                        currentItems
                                            .filter((barang) => {
                                                const lowerCaseQuery = searchQuery.toLowerCase();
                                                return (
                                                    barang.kode.toString().toLowerCase().includes(lowerCaseQuery) ||
                                                    barang.nama.toLowerCase().includes(lowerCaseQuery)
                                                );
                                            })
                                            .map((barang, index) => (
                                                <tr
                                                    key={barang.id}
                                                    className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400"
                                                >
                                                    <td className="w-1/12 truncate ... px-4 text-sm">{index + 1 + indexOfFirstItem}</td>
                                                    <td className="w-1/6 truncate ... px-4 text-sm">{barang.kode}</td>
                                                    <td className="w-1/6 truncate ... px-4 text-sm">{barang.nama || "-"}</td>
                                                    <td className="w-1/6 truncate ... px-4 text-sm">{barang.harga_beli || "-"}</td>
                                                    <td className="w-1/6 truncate ... px-4 text-sm">{barang.harga_jual || "-"}</td>
                                                    <td className="w-1/6 truncate ... px-4 text-sm">{barang.jumlah || "-"}</td>
                                                    <td className="w-1/6 truncate ... px-4 text-sm">{barang.hpp || "-"}</td>
                                                    <td className="px-4 text-sm flex justify-end">
                                                        <button
                                                            type="button"
                                                            className="text-gray-500 hover:text-gray-700 font-semibold py-2 px-4"
                                                            onClick={() => openEditModal(barang.id)}
                                                        >
                                                            Ubah
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="ml-2 text-gray-500 hover:text-gray-700 font-semibold py-2 px-4"
                                                            onClick={() => openDeleteModal(barang.id)}
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
                                <span className="flex text-xs xs:text-sm text-gray-500 normal-case text-center">
                                    Halaman {currentPage} dari {totalPages} ({totalItems} data)
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

        </div>
    );
}