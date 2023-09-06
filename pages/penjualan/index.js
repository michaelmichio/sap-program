import { useEffect, useState } from "react";
import Select from 'react-select';
import { getCookies } from "cookies-next";
import jwt from "jsonwebtoken";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import {
  fetchAllBarangData,
  fetchAllCustomerData,
  fetchAllInvoicePenjualanData,
  fetchCreateInvoicePenjualan,
  fetchCreatePenjualanByInvoiceId,
  fetchDeleteInvoicePenjualanById,
  fetchDeletePenjualanById,
  fetchEditInvoicePenjualanById,
  fetchPenjualanDataByInvoiceId,
  formatISODate
} from "@/utils/helpers";
import { JWT_PRIVATE_KEY } from "@/utils/constants";

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

export default function Penjualan(props) {
  const { token } = props;
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // READ INVOICE
  const [dataInvoice, setDataInvoice] = useState([]);
  const [fetchNewInvoiceData, setFetchNewInvoiceData] = useState(false);

  // READ ALL CUSTOMER
  const [customers, setCustomers] = useState([]);
  const [fetchNewCustomers, setFetchNewCustomers] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // READ ALL BARANG
  const [dataBarang, setDataBarang] = useState([]);
  const [fetchNewDataBarang, setFetchNewDataBarang] = useState(false);
  const [selectedBarang, setSelectedBarang] = useState(null);

  // READ ALL PENJUALAN BY INVOICE ID
  const [invoiceIndex, setInvoiceIndex] = useState(null);
  const [selectedInvoiceData, setSelectedInvoiceData] = useState({
    nomor_invoice: "",
    tanggal: "",
    id_customer: "",
    jenis_kendaraan: "",
    nomor_polisi: "",
    nomor_rangka: "",
    nomor_mesin: "",
    nomor_spk: "",
    id_user: "",
  });
  const [selectedPenjualanData, setSelectedPenjualanData] = useState([]);
  const [fetchNewPenjualanData, setFetchNewPenjualanData] = useState(false);

  // CREATE INVOICE
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
  const [newInvoiceData, setNewInvoiceData] = useState({
    nomor_invoice: "",
    tanggal: "",
    id_customer: "",
    jenis_kendaraan: "",
    nomor_polisi: "",
    nomor_rangka: "",
    nomor_mesin: "",
    nomor_spk: "",
    id_user: "",
  });

  // CREATE PENJUALAN BY INVOICE ID
  const [showAddPenjualanModal, setShowAddPenjualanModal] = useState(false);
  const [newPenjualanData, setNewPenjualanData] = useState({
    kode_barang: "",
    nama_barang: "",
    kategori: "",
    jumlah: "",
    harga_beli: "",
    harga_jual: "",
    diskon: "",
    ppn: "",
    cost: "",
    sales: "",
    invoice_penjualan_id: "",
  });

  // UPDATE INVOICE
  const [showEditInvoiceModal, setShowEditInvoiceModal] = useState(false);
  const [editInvoiceId, setEditInvoiceId] = useState(null);

  // DELETE INVOICE
  const [showDeleteInvoiceModal, setShowDeleteInvoiceModal] = useState(false);
  const [deleteInvoiceId, setDeleteInvoiceId] = useState(null);

  // DELETE PENJUALAN
  const [showDeletePenjualanModal, setShowDeletePenjualanModal] = useState(false);
  const [deletePenjualanId, setDeletePenjualanId] = useState(null);

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

  // Mendekripsi token
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwt.verify(token, JWT_PRIVATE_KEY);
        setUserId(decodedToken.id); // Mendapatkan ID pengguna dari payload token
      } catch (error) {
        console.error('Error decoding token:', error);
        // Handle kesalahan dekripsi token
      }
    }
  }, []);

  // READ ALL INVOICE
  useEffect(() => {
    fetchAllInvoicePenjualanData(token)
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

  // READ ALL CUSTOMER
  useEffect(() => {
    fetchAllCustomerData(token)
      .then((data) => {
        const options = data.map((customer) => ({
          value: customer.id,
          label: customer.name,
        }));
        setCustomers(options);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error.message);
        setLoading(false);
      });

    setFetchNewCustomers(false);
  }, [fetchNewCustomers]);

  // READ ALL BARANG
  useEffect(() => {
    fetchAllBarangData(token)
      .then((data) => {
        const options = data.map((barang) => ({
          value: barang.id,
          label: barang.nama,
          kode_barang: barang.kode,
          nama_barang: barang.nama,
          kategori: barang.kategori,
          jumlah: barang.jumlah,
          harga_beli: barang.harga_beli,
          harga_jual: barang.harga_jual_terbaru,
          total_jumlah: barang.total_jumlah,
        }));
        setDataBarang(options);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error.message);
        setLoading(false);
      });

    setFetchNewDataBarang(false);
  }, [fetchNewDataBarang]);

  // READ ALL PENJUALAN BY INVOICE ID
  const openSelectedInvoiceModal = (invoice, idx) => {
    setInvoiceIndex(idx);
    setSelectedInvoiceData(invoice);
    setFetchNewPenjualanData(true);
    setShowAddPenjualanModal(true);
  }

  useEffect(() => {
    if (selectedInvoiceData) {
      fetchPenjualanDataByInvoiceId(token, selectedInvoiceData.id)
        .then((data) => {
          setSelectedPenjualanData(data);
        })
        .catch((error) => {
          console.error(error.message);
        });

      setFetchNewPenjualanData(false);
    }
  }, [fetchNewPenjualanData]);

  const closeAddPenjualanModal = () => {
    setInvoiceIndex(null);
    setShowAddPenjualanModal(false);
    setSelectedInvoiceData({
      nomor_invoice: "",
      tanggal: "",
      id_customer: "",
      jenis_kendaraan: "",
      nomor_polisi: "",
      nomor_rangka: "",
      nomor_mesin: "",
      nomor_spk: "",
      id_user: "",
    });
    setNewPenjualanData({
      kode_barang: "",
      nama_barang: "",
      kategori: "",
      jumlah: "",
      harga_beli: "",
      harga_jual: "",
      diskon: "",
      ppn: "",
      cost: "",
      sales: "",
      invoice_penjualan_id: "",
    });
    setSelectedBarang(null);
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
      id_customer: "",
      jenis_kendaraan: "",
      nomor_polisi: "",
      nomor_rangka: "",
      nomor_mesin: "",
      nomor_spk: "",
      id_user: "",
    });
    setSelectedCustomer(null);
  };

  useEffect(() => {
    if (selectedCustomer) {
      setNewInvoiceData((prevData) => ({
        ...prevData,
        id_customer: selectedCustomer.value,
      }));
    }
  }, [selectedCustomer]);

  const handleInputInvoiceChange = (e) => {
    const { name, value } = e.target;

    setNewInvoiceData((prevData) => ({
      ...prevData,
      [name]: value,
      id_user: userId,
    }));
  };

  const handleInvoiceSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetchCreateInvoicePenjualan(token, newInvoiceData);
      setFetchNewInvoiceData(true);
      closeAddInvoiceModal();
    } catch (error) {
      console.error("Error creating invoice:", error.message);
    }
  };

  // CREATE PENJUALAN BY INVOICE ID
  useEffect(() => {
    if (selectedBarang) {
      let defaultJumlah = 1;

      if (newPenjualanData.jumlah > 0) {
        defaultJumlah = newPenjualanData.jumlah;
      }

      setNewPenjualanData((prevData) => ({
        ...prevData,
        jumlah: defaultJumlah,
        kode_barang: selectedBarang.kode_barang,
        nama_barang: selectedBarang.nama_barang,
        kategori: selectedBarang.kategori,
        harga_beli: selectedBarang.harga_beli,
        harga_jual: selectedBarang.harga_jual,
        diskon: 0,
        ppn: 0,
        cost: defaultJumlah * selectedBarang.harga_jual,
        sales: defaultJumlah * selectedBarang.harga_jual,
        invoice_penjualan_id: selectedInvoiceData.id,
      }));
    }
  }, [selectedBarang]);

  const handleInputPenjualanChange = (e) => {
    const { name, value } = e.target;

    let currJumlah = newPenjualanData.jumlah;

    if (name === "jumlah") {
      currJumlah = value;
    }

    setNewPenjualanData((prevData) => ({
      ...prevData,
      [name]: value,
      kode_barang: selectedBarang?.kode_barang,
      nama_barang: selectedBarang?.nama_barang,
      kategori: selectedBarang?.kategori,
      harga_beli: selectedBarang?.harga_beli,
      harga_jual: selectedBarang?.harga_jual,
      diskon: 0,
      ppn: 0,
      cost: currJumlah * selectedBarang?.harga_jual || "",
      sales: currJumlah * selectedBarang?.harga_jual || "",
      invoice_penjualan_id: selectedInvoiceData.id,
    }));
  };

  // OLI

  // JASA

  // DLL

  const handlePenjualanSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetchCreatePenjualanByInvoiceId(token, newPenjualanData);
      setNewPenjualanData({
        kode_barang: "",
        nama_barang: "",
        kategori: "",
        jumlah: "",
        harga_beli: "",
        harga_jual: "",
        diskon: "",
        ppn: "",
        cost: "",
        sales: "",
        invoice_penjualan_id: "",
      });
      setSelectedBarang(null);
      setFetchNewPenjualanData(true);
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
      await fetchEditInvoicePenjualanById(token, editInvoiceId);
      setFetchNewInvoiceData(true);
      closeAddPenjualanModal();
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
      await fetchDeleteInvoicePenjualanById(token, deleteInvoiceId);
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

  // DELETE PENJUALAN BY ID
  const openDeletePenjualanModal = (penjualanId) => {
    setDeletePenjualanId(penjualanId); // Set the penjualan ID to be deleted
    setShowDeletePenjualanModal(true); // Show the delete modal
  };

  const closeDeletePenjualanModal = () => {
    setShowDeletePenjualanModal(false);
  };

  const confirmDeletePenjualan = async (e) => {
    e.preventDefault();

    try {
      await fetchDeletePenjualanById(token, deletePenjualanId);
      setFetchNewPenjualanData(true);

      setPopupMesage("Penjualan berhasil dihapus.");
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Error deleting penjualan:", error.message);

      setPopupMesage("Penjualan gagal dihapus.");
      setShowErrorPopup(true);
    } finally {
      setShowDeletePenjualanModal(false); // Close the delete modal
      setDeletePenjualanId(null); // Reset the penjualan ID to be deleted
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
                    <th className="w-1/6 truncate ... px-4 py-3">Nama Customer</th>
                    <th className="w-1/6 truncate ... px-4 py-3">Total Biaya</th>
                    <th className="w-1/6 truncate ... px-4 py-3">Status</th>
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
                    currentFilteredItems.map((invoice, index) => (
                      <tr
                        key={invoice.id}
                        className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400"
                      >
                        <td className="w-1/12 truncate ... px-4 text-sm">{index + 1 + indexOfFirstItem}</td>
                        <td className="w-1/6 truncate ... px-4 text-sm">{invoice.nomor_invoice}</td>
                        <td className="w-1/6 truncate ... px-4 text-sm">{formatISODate(invoice.tanggal)}</td>
                        <td className="uppercase w-1/6 truncate ... px-4 text-sm">{invoice.nama_customer}</td>
                        <td className="w-1/6 truncate ... px-4 text-sm">{invoice.total_sales || "0"}</td>
                        <td className="uppercase w-1/6 truncate ... px-4 text-sm">{invoice.status}</td>
                        <td className="px-4 text-sm flex justify-end">
                          <button
                            type="button"
                            className="text-gray-500 hover:text-gray-700 font-semibold py-2 px-4"
                            onClick={() => openSelectedInvoiceModal(invoice, index)}
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
                <div className="mt-2">
                  <label htmlFor="nomor_invoice" className="block text-gray-700 text-sm font-bold">
                    Nomor Invoice
                  </label>
                  <input
                    type="text"
                    id="nomor_invoice"
                    name="nomor_invoice"
                    value={dataInvoice.nomor_invoice}
                    onChange={handleInputInvoiceChange}
                    className="p-2 border border-gray-300 rounded w-full"
                    required
                  />
                </div>
                <div className="mt-2">
                  <label htmlFor="tanggal" className="block text-gray-700 text-sm font-bold">
                    Tanggal Invoice
                  </label>
                  <input
                    type="date"
                    id="tanggal"
                    name="tanggal"
                    value={dataInvoice.tanggal}
                    onChange={handleInputInvoiceChange}
                    className="p-2 border border-gray-300 rounded w-full"
                    required
                  />
                </div>
                <div className="mt-2">
                  <label htmlFor="id_customer" className="block text-gray-700 text-sm font-bold">
                    Customer
                  </label>
                  <Select
                    id="id_customer"
                    name="id_customer"
                    options={customers}
                    value={selectedCustomer}
                    onChange={(selectedOption) => setSelectedCustomer(selectedOption)}
                    isSearchable
                    placeholder="Pilih customer"
                    required
                  />
                </div>
                <div className="mt-2">
                  <label htmlFor="jenis_kendaraan" className="block text-gray-700 text-sm font-bold">
                    Jenis Kendaraan
                  </label>
                  <input
                    type="text"
                    id="jenis_kendaraan"
                    name="jenis_kendaraan"
                    value={dataInvoice.jenis_kendaraan}
                    onChange={handleInputInvoiceChange}
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div className="mt-2">
                  <label htmlFor="nomor_polisi" className="block text-gray-700 text-sm font-bold">
                    Nomor Polisi
                  </label>
                  <input
                    type="text"
                    id="nomor_polisi"
                    name="nomor_polisi"
                    value={dataInvoice.nomor_polisi}
                    onChange={handleInputInvoiceChange}
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div className="mt-2">
                  <label htmlFor="nomor_mesin" className="block text-gray-700 text-sm font-bold">
                    Nomor Mesin
                  </label>
                  <input
                    type="text"
                    id="nomor_mesin"
                    name="nomor_mesin"
                    value={dataInvoice.nomor_mesin}
                    onChange={handleInputInvoiceChange}
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div className="mt-2">
                  <label htmlFor="nomor_rangka" className="block text-gray-700 text-sm font-bold">
                    Nomor Rangka
                  </label>
                  <input
                    type="text"
                    id="nomor_rangka"
                    name="nomor_rangka"
                    value={dataInvoice.nomor_rangka}
                    onChange={handleInputInvoiceChange}
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div className="mt-2">
                  <label htmlFor="nomor_spk" className="block text-gray-700 text-sm font-bold">
                    Nomor SPK
                  </label>
                  <input
                    type="text"
                    id="nomor_spk"
                    name="nomor_spk"
                    value={dataInvoice.nomor_spk}
                    onChange={handleInputInvoiceChange}
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div className="mt-4">
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

      {showAddPenjualanModal && (
        <div className="z-50 fixed top-0 left-0 w-full h-full outline-none overflow-x-hidden overflow-y-auto">
          <div className="modal-overlay absolute inset-0 bg-gray-900 opacity-50" />
          <div className="sm:h-[calc(100%-3rem)] mx-auto w-9/12 md:w-9/12 my-6 relative w-auto pointer-events-none">
            <div className="h-full max-h-full overflow-hidden border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
              <div className="flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-300 rounded-t-md">
                <h5 className="text-xl font-medium leading-normal text-gray-800">
                  Invoice Penjualan
                </h5>
                <div className="flex justify-between items-center">
                  <p className="text-2xl font-bold"></p>
                  <button
                    className="modal-close text-gray-500 hover:text-gray-700"
                    onClick={closeAddPenjualanModal}
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
              </div>
              <div className="flex-auto overflow-y-auto relative">
                <div className="flex flex-wrap justify-between p-2">
                  <div className="w-full lg:w-2/12 px-2">
                    <div className="relative w-full">
                      <label className="block uppercase text-gray-600 text-sm font-bold" >
                        Nomor Invoice
                      </label>
                    </div>
                  </div>
                  <span className="">:</span>
                  <div className="w-full lg:w-4/12 px-2">
                    <div className="relative w-full">
                      <label className="block uppercase text-gray-600 text-sm font-bold" >
                        {selectedInvoiceData.nomor_invoice}
                      </label>
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-2">
                    <div className="relative w-full">
                      <label className="block uppercase text-gray-600 text-sm font-bold" >
                        Tanggal Invoice
                      </label>
                    </div>
                  </div>
                  <span className="">:</span>
                  <div className="w-full lg:w-2/12 px-2">
                    <div className="relative w-full">
                      <label className="block uppercase text-gray-600 text-sm font-bold" >
                        {formatISODate(selectedInvoiceData.tanggal)}
                      </label>
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-2">
                    <div className="relative w-full">
                      <label className="block uppercase text-gray-600 text-sm font-bold" >
                        Customer
                      </label>
                    </div>
                  </div>
                  <span className="">:</span>
                  <div className="w-full lg:w-4/12 px-2">
                    <div className="relative w-full">
                      <label className="block uppercase text-gray-600 text-sm font-bold" >
                        {selectedInvoiceData.nama_customer}
                      </label>
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-2">
                    <div className="relative w-full">
                      <label className="block uppercase text-gray-600 text-sm font-bold" >
                        Karyawan
                      </label>
                    </div>
                  </div>
                  <span className="">:</span>
                  <div className="w-full lg:w-2/12 px-2">
                    <div className="relative w-full">
                      <label className="block uppercase text-gray-600 text-sm font-bold" >
                        {selectedInvoiceData.nama_user}
                      </label>
                    </div>
                  </div>
                </div>
                <hr className="border-b-1 border-gray-300" />
                <div className="flex flex-wrap justify-between p-2 text-sm">
                  <div className="w-full lg:w-2/12 px-2">
                    <div className="relative w-full">
                      <label className="block uppercase text-gray-600 font-bold" >
                        Jenis Kendaraan
                      </label>
                      <label className="block uppercase text-gray-600 font-bold" >
                        {selectedInvoiceData.jenis_kendaraan || "-"}
                      </label>
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-2">
                    <div className="relative w-full">
                      <label className="block uppercase text-gray-600 font-bold" >
                        Nomor Polisi
                      </label>
                      <label className="block uppercase text-gray-600 font-bold" >
                        {selectedInvoiceData.nomor_polisi || "-"}
                      </label>
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-2">
                    <div className="relative w-full">
                      <label className="block uppercase text-gray-600 font-bold" >
                        Nomor Mesin
                      </label>
                      <label className="block uppercase text-gray-600 font-bold" >
                        {selectedInvoiceData.nomor_mesin || "-"}
                      </label>
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-2">
                    <div className="relative w-full">
                      <label className="block uppercase text-gray-600 font-bold" >
                        Nomor Rangka
                      </label>
                      <label className="block uppercase text-gray-600 font-bold" >
                        {selectedInvoiceData.nomor_rangka || "-"}
                      </label>
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-2">
                    <div className="relative w-full">
                      <label className="block uppercase text-gray-600 font-bold" >
                        Nomor SPK
                      </label>
                      <label className="block uppercase text-gray-600 font-bold" >
                        {selectedInvoiceData.nomor_spk || "-"}
                      </label>
                    </div>
                  </div>
                </div>
                <hr className="border-b-1 border-gray-300" />
                {selectedInvoiceData.status === "pending" && (
                  <form onSubmit={handlePenjualanSubmit} className="flex flex-wrap px-4 pt-1">
                    <div className="w-full lg:w-12/12 pr-2">
                      <div className="relative w-full lg:w-6/12">
                        <label className="block uppercase text-gray-600 text-sm font-bold" >
                          Nama Barang:
                        </label>
                        <Select
                          id="id_barang"
                          name="id_barang"
                          options={dataBarang}
                          value={selectedBarang}
                          onChange={(selectedOption) => setSelectedBarang(selectedOption)}
                          isSearchable
                          placeholder="Pilih barang"
                          required
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-3/12 pr-2">
                      <div className="relative w-full">
                        <label className="block uppercase text-gray-600 text-sm font-bold" >
                          Harga Beli:
                        </label>
                        <input
                          disabled
                          defaultValue={selectedBarang?.harga_beli}
                          // onChange={handleInputPenjualanChange}
                          required name="harga_beli"
                          type="number"
                          className="mt-1 p-1 bg-gray-200 border border-gray-300 rounded w-full"
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-3/12 pr-2">
                      <div className="relative w-full">
                        <label className="block uppercase text-gray-600 text-sm font-bold" >
                          Harga Jual:
                        </label>
                        <input
                          disabled
                          defaultValue={selectedBarang?.harga_jual}
                          // onChange={handleInputPenjualanChange}
                          required name="harga_jual"
                          type="number"
                          className="mt-1 p-1 bg-gray-200 border border-gray-300 rounded w-full"
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-2/12 pr-2">
                      <div className="relative w-full">
                        <label className="block uppercase text-gray-600 text-sm font-bold">
                          Jumlah {selectedBarang && <span className={selectedBarang.jumlah > 0 ? "text-sky-800 text-xs" : "text-red-500 text-xs"}>{"(Stok " + selectedBarang.jumlah + " pcs)"}</span>}:
                        </label>
                        <input
                          value={newPenjualanData.jumlah}
                          onChange={handleInputPenjualanChange}
                          required
                          name="jumlah"
                          min={0}
                          type="number" // Menggunakan tipe number
                          className="mt-1 p-1 border border-gray-300 rounded w-full"
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-3/12 pr-2">
                      <div className="relative w-full">
                        <label className="block uppercase text-gray-600 text-sm font-bold" >
                          Jumlah Harga:
                        </label>
                        <input
                          disabled
                          defaultValue={newPenjualanData.sales}
                          required
                          name="sales"
                          type="number"
                          className="mt-1 p-1 bg-gray-200 border border-gray-300 rounded w-full"
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-1/12">
                      <div className="relative w-full">
                        <label className="block uppercase text-gray-600 text-sm font-bold" >
                          <br />
                        </label>
                        <div className="text-center flex justify-end">
                          <button type="submit" className="px-4 py-2 bg-sky-700 hover:bg-sky-600 text-white active:bg-blue-600 font-bold uppercase text-sm rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150">
                            Tambah
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
                <div className="flex-auto overflow-y-auto relative p-4">
                  <div className="w-full overflow-hidden rounded-lg shadow-xs">
                    <div className="w-full overflow-x-auto overflow-y-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                            <th className="w-1/12 truncate ... px-4 py-3">No.</th>
                            <th className="w-2/12 truncate ... px-4 py-3">Kode Barang</th>
                            <th className="w-3/12 truncate ... px-4 py-3">Nama Barang</th>
                            <th className="w-2/12 truncate ... px-4 py-3">Harga Satuan</th>
                            <th className="w-1/12 truncate ... px-4 py-3">Jumlah</th>
                            <th className="w-2/12 truncate ... px-4 py-3">Jumlah Harga</th>
                            <th className="w-1/12 px-4 py-3"><br /></th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                          {selectedPenjualanData.length == 0 ?
                            (<tr>
                              <td colSpan="9" className="text-center py-2">
                                Belum ada data penjualan.
                              </td>
                            </tr>)
                            :
                            (selectedPenjualanData.map((penjualan, index) => (
                              <tr key={penjualan.id}>
                                <td className="w-1/12 truncate ... px-4">{index + 1}</td>
                                <td className="w-2/12 truncate ... px-4">{penjualan.kode_barang}</td>
                                <td className="w-3/12 truncate ... px-4">{penjualan.nama_barang}</td>
                                <td className="w-2/12 truncate ... px-4">{penjualan.harga_jual}</td>
                                <td className="w-1/12 truncate ... px-4">{penjualan.jumlah}</td>
                                <td className="w-2/12 truncate ... px-4">{penjualan.sales}</td>
                                <td className="w-1/12 px-4">
                                  {selectedInvoiceData.status === "pending" && (
                                    <button
                                      type="button"
                                      className="text-xs text-gray-500 hover:text-gray-700 font-semibold py-2 px-4"
                                      onClick={() => openDeletePenjualanModal(penjualan.id)}
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
                  <hr className="border-b-1 border-gray-300" />
                </div>
                {/* <hr className="my-2 border-b-1 border-gray-300" /> */}
                {/* <div className="flex flex-wrap justify-end">
                  <div className="w-full lg:w-2/12 px-4">
                    <div className="relative w-full">
                      <label className="block uppercase text-gray-600 text-md font-bold" >
                        Harga Total
                      </label>
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4">
                    <div className="relative w-full">
                      <label className="block uppercase text-gray-600 text-md font-bold" >
                        {currentFilteredItems[invoiceIndex].total_sales || "-"}
                      </label>
                    </div>
                  </div>
                </div> */}
              </div>
              <div className="flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
                <div className="flex w-full justify-end">
                  <div className="flex flex-wrap w-full text-end px-6">
                    <div className="w-full">
                      <label className="block uppercase text-gray-600 text-md font-bold" >
                        Harga Total
                      </label>
                    </div>
                    <div className="w-full">
                      <label className="block uppercase text-gray-600 text-md font-bold" >
                        {currentFilteredItems[invoiceIndex].total_sales || "-"}
                      </label>
                    </div>
                  </div>
                  {(selectedInvoiceData.status === "pending") ? (
                    <button
                      type="button"
                      className="bg-sky-700 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded"
                      onClick={() => openEditInvoiceModal(selectedInvoiceData.id)}
                    >
                      SELESAI
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="bg-sky-700 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded"
                      // onClick={() => openEditInvoiceModal(selectedInvoiceData.id)}
                    >
                      CETAK
                    </button>
                  )}
                </div>
              </div>
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

      {showDeletePenjualanModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal-overlay absolute inset-0 bg-gray-900 opacity-50"></div>
          <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
            <div className="modal-content py-4 text-left px-6">
              <div className="flex justify-between items-center pb-3">
                <p className="text-2xl font-bold">Hapus Barang</p>
                <button
                  className="modal-close text-gray-500 hover:text-gray-700"
                  onClick={closeDeletePenjualanModal}
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
                  onClick={confirmDeletePenjualan}
                >
                  HAPUS
                </button>
                <button
                  className="ml-2 text-gray-500 hover:text-gray-700 font-semibold py-2 px-4"
                  onClick={closeDeletePenjualanModal}
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