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

export default function Penjualan() {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Fetch orders data here
        // Set loading and orders state
        setLoading(false);
    }, []);

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
                                <input type="search" name="" id="" placeholder="search for orders" x-model="q" className="w-full pl-4 text-sm outline-none focus:outline-none bg-transparent" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center ml-4 mr-4">
                        <button type="button" className="bg-sky-700 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded">
                            Tambah
                        </button>
                    </div>
                </div>
                <div className="mt-2 mx-4">
                    <div className="w-full overflow-hidden rounded-lg shadow-xs">
                        <div className="w-full overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                                        <th className="w-1/12 truncate ... px-4 py-3">No</th>
                                        <th className="w-1/8 truncate ... px-4 py-3">ID Order</th>
                                        <th className="w-1/8 truncate ... px-4 py-3">ID Customer</th>
                                        <th className="w-1/8 truncate ... px-4 py-3">Nama Customer</th>
                                        <th className="w-1/8 truncate ... px-4 py-3">Tanggal Order</th>
                                        <th className="w-1/8 truncate ... px-4 py-3">Total Biaya</th>
                                        <th className="w-1/8 truncate ... px-4 py-3">Status</th>
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
                                        orders.map((order, index) => (
                                            <tr key={index} className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400">
                                                <td className="w-1/12 truncate ... px-4 py-3 text-sm">{index + 1}</td>
                                                <td className="w-1/8 truncate ... px-4 py-3 text-sm">{order.id}</td>
                                                <td className="w-1/8 truncate ... px-4 py-3 text-sm">{order.customerId}</td>
                                                <td className="w-1/8 truncate ... px-4 py-3 text-sm">{order.customerName}</td>
                                                <td className="w-1/8 truncate ... px-4 py-3 text-sm">{order.orderDate}</td>
                                                <td className="w-1/8 truncate ... px-4 py-3 text-sm">{order.totalCost}</td>
                                                <td className="w-1/8 truncate ... px-4 py-3 text-xs">{order.status}</td>
                                                <td className="px-4 py-3 text-sm flex justify-end">
                                                    <button
                                                        type="button"
                                                        className="mr-4 px-3 py-2 text-xs font-medium text-center text-white bg-gray-300 rounded-md hover:bg-sky-700 focus:outline-none dark:bg-gray-100 dark:hover:bg-gray-300"
                                                        aria-label="Edit Order"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon></svg>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="px-3 py-2 text-xs font-medium text-center text-white bg-gray-300 rounded-md hover:bg-sky-700 focus:outline-none dark:bg-gray-100 dark:hover:bg-gray-300"
                                                        aria-label="Delete Order"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z" /><path d="M14 3v5h5M16 13H8M16 17H8M10 9H8" /></svg>
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
        </div>
    );
}