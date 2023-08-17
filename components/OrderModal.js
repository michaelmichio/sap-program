import React, { useState, useRef } from 'react';
import Router from 'next/router';
import ReactToPrint from 'react-to-print';
import SSModal from './SSModal';
import ubahAngkaKeBahasa from 'angka-menjadi-terbilang';
import CurrencyFormat from 'react-currency-format';
import Cookies from 'js-cookie';
import Swal from "sweetalert2";

export default function OrderModal({ isVisible, onClose, orderData, token }) {

    if(!isVisible) return null;

    const [isReadPrinted, setIsReadPrinted] = useState(false);
    const [isPrinted, setIsPrinted] = useState(true);
    if(!isReadPrinted) updatePrinted();
    function updatePrinted() {
        setIsReadPrinted(true);
        if(orderData.printCount < 1) {
            setIsPrinted(false);
        }
    }

    const componentRef = useRef();
    const d = new Date();
    const terbilang = ubahAngkaKeBahasa;

    // ss modal
    const [ssModal, setVisibleSS] = useState(false);
    const [ssGroupData, setSSGroupData] = useState();

    // close modal
    function closeHandler(e) {
        e.preventDefault();
        Router.replace('/dashboard');
        onClose();
    }
    
    const [status, setStatus] = useState('normal');

    // read users
    const [userProps, setUserProps] = useState();
    const [userRead, setUserRead] = useState(false);
    if (!userRead) readUserHandler();
    async function readUserHandler() {
        setUserRead(true);
        const readUserReq = await fetch('/api/user/read/' + Cookies.get('username'), {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .catch((error) => {
            console.log(error)
        });
        const readUserRes = await readUserReq.json();
        setUserProps(readUserRes.data);
    }

    // read ssgroups
    const [ssGroupProps, setSSGroupProps] = useState();
    const [ssGroupRead, setSSGroupRead] = useState(false);
    if (!ssGroupRead) readSSGroupHandler();
    async function readSSGroupHandler() {

        setSSGroupRead(true);
        const readSSGroupReq = await fetch('/api/ssgroup/read/' + orderData.orderId, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .catch((error) => {
            console.log(error)
        });
        const readSSGroupRes = await readSSGroupReq.json();
        setSSGroupProps(readSSGroupRes.data);
        setSSRead(false);
    }

    // create ssgroup
    async function createSSGroupHandler() {
        const createSSGroupReq = await fetch('/api/ssgroup/create', {
            method: 'POST',
            body: JSON.stringify({
                nomorKuitansi: fields.nomorKuitansi,
                orderId: orderData.orderId
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .catch((error) => {
            console.log(error)
        });
        if(!createSSGroupReq.ok) return setStatus('error' + createSSGroupReq.status);
        setSSGroupRead(false); // update read ssgroups
    }

    // read services
    const initialServiceFields = {
        name: '',
        price: '',
        orderId : orderData.orderId
    };
    const [serviceFields, setServiceFields] = useState(initialServiceFields);
    const [serviceProps, setServiceProps] = useState();
    const [serviceRead, setServiceRead] = useState(false);
    if (!serviceRead) readServiceHandler();
    async function readServiceHandler() {
        setServiceRead(true);
        const readServiceReq = await fetch('/api/service/read/' + orderData.orderId, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .catch((error) => {
            console.log(error)
        });
        const readServiceRes = await readServiceReq.json();
        setServiceProps(readServiceRes.data);
    }

    // create service handler
    async function createServiceHandler(e) {
        e.preventDefault();
        const createServiceReq = await fetch('/api/service/create', {
            method: 'POST',
            body: JSON.stringify(serviceFields),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .catch((error) => {
            console.log(error)
        });
        if(!createServiceReq.ok) return setStatus('error' + createServiceReq.status);
        setVal(initialVal);
        setServiceRead(false); // update read services
    }
    
    const [ssProps, setSSProps] = useState();
    const [ssRead, setSSRead] = useState(true);
    if (!ssRead) readSSHandler();
    async function readSSHandler() {
        setSSRead(true);
        const readSSReq = await fetch('/api/ss/order/' + orderData.orderId, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .catch((error) => {
            console.log(error)
        });
        const readSSRes = await readSSReq.json();
        setSSProps(readSSRes.data);
    }

    async function deleteHandler(id, e) {
        e.preventDefault();
        Swal.fire({
            title: 'Hapus data?',
            text: "Data tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Terhapus!',
                    'Data berhasil dihapus.',
                    'success'
                )
                deleteService(id);
            }
        })
    }

    // delete service handler
    async function deleteService(id) {
        // delete ss
        const deleteServiceReq = await fetch('/api/service/delete/' + id, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .catch((error) => {
            console.log(error)
        });
        setServiceRead(false);
    }

    // input handler
    const initialVal = {
        name: '',
        price: ''
    };
    const [val, setVal] = useState(initialVal);
    function serviceFieldHandler(e) {
        const name = e.target.getAttribute('name');
        setServiceFields({
            ...serviceFields,
            [name]: e.target.value
        });
        setVal({
            [name]: e.target.value
        });
    }

    let totalSS = 0;
    let totalService = 0;

    let totalSSGroupPrice = 0;

    function updateHandler(id, e) {
        e.preventDefault();
        Swal.fire({
          title: 'Selesaikan order?',
          text: "Order tidak dapat diubah!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ya, selesai!'
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire(
              'Selesai!',
              'Order telah selesai.',
              'success'
            )
            updateOrder(id);
          }
        })
    }
    
    async function updateOrder(id) {
        const updateOrderReq = await fetch('/api/order/update/' + orderData.orderId, {
            method: 'PUT',
            body: JSON.stringify({
                nomorPolisi: orderData.nomorPolisi,
                jenisKendaraan: orderData.jenisKendaraan,
                nomorRangka: orderData.nomorRangka,
                nomorMesin: orderData.nomorMesin,
                nomorSPK: orderData.nomorSPK,
                printCount: '1'
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .catch((error) => {
            console.log(error)
        });
        Router.replace('/dashboard');
        onClose();
    }

    async function deleteSSGroupHandler(id, e) {
        e.preventDefault();
        Swal.fire({
            title: 'Hapus data?',
            text: "Data tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Terhapus!',
                    'Data berhasil dihapus.',
                    'success'
                )
                deleteSSGroup(id);
            }
        })
    }

    // delete service handler
    async function deleteSSGroup(id) {
        // delete ss
        const deleteServiceReq = await fetch('/api/ssgroup/delete/' + id, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .catch((error) => {
            console.log(error)
        });
        setSSGroupRead(false);
    }

    async function updatePrintCount(e, id) {
        e.preventDefault();
        console.log(id);
        const updateOrderReq = await fetch('/api/order/update/' + id, {
            method: 'PUT',
            body: JSON.stringify({
                nomorPolisi: orderData.nomorPolisi,
                jenisKendaraan: orderData.jenisKendaraan,
                nomorRangka: orderData.nomorRangka,
                nomorMesin: orderData.nomorMesin,
                nomorSPK: orderData.nomorSPK,
                printCount: '2'
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .catch((error) => {
            console.log(error)
        });
        if(!updateOrderReq.ok) return setStatus('error' + updateOrderReq.status);
        notifyInfo('Data berhasil diupdate');
        Router.replace('/dashboard');
        onClose();
    }

    // buat kuitansi baru
    const [fields, setFields] = useState({
        nomorKuitansi: ''
    });
    function fieldHandler(e) {
        const name = e.target.getAttribute('name');
        setFields({
            ...fields,
            [name]: e.target.value
        });
    }

    return(
    <>

    {/* Start - Modal */}
    <div className="h-fit py-12 bg-black bg-opacity-30 transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0" id="modal">
        <div role="alert" className="container mx-auto w-11/12 md:w-2/3">

            {/* Start - Card Container */}
            <div className="w-full lg:w-full px-4 mx-auto mt-6">
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-100 border-0">
                    
                    {/* Start - Header Card */}
                    <div className="rounded-t bg-white mb-0 px-3 py-6">
                        <div className="text-center flex justify-between">
                            <h6 className="text-gray-700 text-xl font-bold" />
                            <button onClick={closeHandler.bind(this)} className="cursor-pointer absolute top-0 right-0 mt-4 mr-5 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out rounded focus:ring-2 focus:outline-none focus:ring-gray-600" aria-label="close modal" role="button">
                                <svg xmlns="http://www.w3.org/2000/svg"  className="icon icon-tabler icon-tabler-x" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" />
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    {/* End - Header Card */}

                    {/* Start - Main Card */}
                    <div className="flex-auto px-4 lg:px-10 py-10 pt-0">

                        {/* Start - Main Content */}

                        <h6 className="text-gray-400 text-sm mt-3 mb-6 font-bold uppercase">
                            Informasi Order
                        </h6>

                        <div className="flex flex-wrap">
                            <div className="w-full lg:w-2/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="pt-1 block uppercase text-gray-600 text-xs font-bold mb-2" >
                                        Nama Karyawan
                                    </label>
                                </div>
                            </div>
                            <div className="w-full lg:w-2/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-gray-600 text-sm mb-2" >
                                        {(orderData !== undefined) ? orderData.userId : ''}
                                    </label>
                                </div>
                            </div>
                            <div className="w-full lg:w-2/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="pt-1 block uppercase text-gray-600 text-xs font-bold mb-2" >
                                        Id Order
                                    </label>
                                </div>
                            </div>
                            <div className="w-full lg:w-2/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-gray-600 text-sm mb-2" >
                                        {orderData.orderId}
                                    </label>
                                </div>
                            </div>
                            <div className="w-full lg:w-2/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="pt-1 block uppercase text-gray-600 text-xs font-bold mb-2" >
                                        Tanggal Order
                                    </label>
                                </div>
                            </div>
                            <div className="w-full lg:w-2/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-gray-600 text-sm mb-2" >
                                        { orderData.orderCreatedAt.substring(0, 10) }
                                    </label>
                                </div>
                            </div>
                        </div>

                        <hr className="mt-1 border-b-1 border-gray-300"/>

                        <h6 className="text-gray-400 text-sm mt-3 mb-6 font-bold uppercase">
                            Informasi Customer
                        </h6>

                        <div className="flex flex-wrap">
                            <div className="w-full lg:w-2/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="pt-1 block uppercase text-gray-600 text-xs font-bold mb-2" >
                                        Nama Customer
                                    </label>
                                </div>
                            </div>
                            <div className="w-full lg:w-2/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-gray-600 text-sm mb-2" >
                                        {orderData.customerName}
                                    </label>
                                </div>
                            </div>
                            <div className="w-full lg:w-2/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="pt-1 block uppercase text-gray-600 text-xs font-bold mb-2" >
                                        Alamat
                                    </label>
                                </div>
                            </div>
                            <div className="w-full lg:w-2/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-gray-600 text-sm mb-2" >
                                        {orderData.customerAddress}
                                    </label>
                                </div>
                            </div>
                            <div className="w-full lg:w-2/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="pt-1 block uppercase text-gray-600 text-xs font-bold mb-2" >
                                        Nomor Telepon
                                    </label>
                                </div>
                            </div>
                            <div className="w-full lg:w-2/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-gray-600 text-sm mb-2" >
                                        {orderData.customerPhone}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <hr className="mt-1 border-b-1 border-gray-300"/>

                        <h6 className="text-gray-400 text-sm mt-3 mb-6 font-bold uppercase">
                            Informasi Kendaraan
                        </h6>

                        <div className="flex flex-wrap">
                            <div className="w-full lg:w-2/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="pt-1 block uppercase text-gray-600 text-xs font-bold mb-2" >
                                        Nomor Polisi
                                    </label>
                                </div>
                            </div>
                            <div className="w-full lg:w-2/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-gray-600 text-sm mb-2" >
                                        {orderData.nomorPolisi}
                                    </label>
                                </div>
                            </div>
                            <div className="w-full lg:w-2/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="pt-1 block uppercase text-gray-600 text-xs font-bold mb-2" >
                                        Jenis Kendaraan
                                    </label>
                                </div>
                            </div>
                            <div className="w-full lg:w-2/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-gray-600 text-sm mb-2" >
                                        {
                                        orderData.jenisKendaraan == '' ?
                                        '-'
                                        :
                                        orderData.jenisKendaraan
                                        }
                                    </label>
                                </div>
                            </div>
                            <div className="w-full lg:w-2/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="pt-1 block uppercase text-gray-600 text-xs font-bold mb-2" >
                                        Nomor Rangka
                                    </label>
                                </div>
                            </div>
                            <div className="w-full lg:w-2/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-gray-600 text-sm mb-2" >
                                        {
                                        orderData.nomorRangka == '' ?
                                        '-'
                                        :
                                        orderData.nomorRangka
                                        }
                                    </label>
                                </div>
                            </div>
                            <div className="w-full lg:w-2/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="pt-1 block uppercase text-gray-600 text-xs font-bold mb-2" >
                                        Nomor Mesin
                                    </label>
                                </div>
                            </div>
                            <div className="w-full lg:w-2/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-gray-600 text-sm mb-2" >
                                        {
                                        orderData.nomorMesin == '' ?
                                        '-'
                                        :
                                        orderData.nomorMesin
                                        }
                                    </label>
                                </div>
                            </div>
                            <div className="w-full lg:w-2/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="pt-1 block uppercase text-gray-600 text-xs font-bold mb-2" >
                                        Nomor SPK
                                    </label>
                                </div>
                            </div>
                            <div className="w-full lg:w-2/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-gray-600 text-sm mb-2" >
                                        {
                                        orderData.nomorSPK == '' ?
                                        '-'
                                        :
                                        orderData.nomorSPK
                                        }
                                    </label>
                                </div>
                            </div>
                        </div>

                        <hr className="mt-1 border-b-1 border-gray-300"/>

                        <h6 className="text-gray-400 text-sm mt-3 mb-6 font-bold uppercase">
                            Informasi Kuitansi
                        </h6>

                        <div className="mx-4">
                            <div className="flex flex-wrap mb-4">
                                <div className="w-full lg:w-10/12 px-4">
                                    <label className="block uppercase text-gray-600 text-xs font-bold mb-2" >
                                        Nomor Kuitansi:
                                    </label>
                                    <input required autoComplete="off" onChange={fieldHandler.bind(this)} name="nomorKuitansi" type="text" className="border-0 px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
                                </div>
                                <div className="w-full lg:w-2/12 px-4">
                                    <label className="block uppercase text-gray-600 text-xs font-bold mb-2" >
                                        <br/>
                                    </label>
                                    <div className="relative w-full mb-3">
                                        <div className={ssGroupProps?.length > 0 ? "text-center flex justify-end px-2 py-2 hidden" : "text-center flex justify-end px-2 py-2"}>
                                            <button onClick={() => createSSGroupHandler()} type="button" className="bg-sky-700 hover:bg-sky-600 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150">
                                                Tambah
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full overflow-hidden rounded-lg shadow-xs">
                                <div className="w-full overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                                                <th className="w-1/12 truncate ... px-4 py-3">No.</th>
                                                <th className="w-4/12 truncate ... px-4 py-3">Nomor Kuitansi</th>
                                                <th className="w-4/12 truncate ... px-4 py-3">Tanggal Kuitansi</th>
                                                <th className="truncate ... px-4 py-3"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                                            { ssGroupProps?.map((ssgroup, i) => (
                                                <tr key={ssgroup.id} className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400">
                                                    <td className="w-1/12 truncate ... px-4 py-3 text-sm">{ i+1 }</td>
                                                    <td className="w-4/12 truncate ... px-4 py-3 text-sm">{ ssgroup.id }</td>
                                                    <td className="w-4/12 truncate ... px-4 py-3 text-sm">{ ssgroup.created_at.substring(0, 10) }</td>
                                                    <td className="truncate ... px-4 py-3 text-sm flex justify-end">
                                                        <button onClick={() => {setSSGroupData(ssgroup), setVisibleSS(true)}} type="button" className="px-3 py-2 text-xs font-medium text-center text-white bg-gray-300 rounded-md hover:bg-sky-700 focus:outline-none dark:bg-gray-100 dark:hover:bg-gray-300">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon></svg>
                                                        </button>
                                                        {/* <button onClick={deleteSSGroupHandler.bind(this, ssgroup.id)} type="button" className="ml-4 px-3 py-2 text-xs font-medium text-center text-white bg-gray-300 rounded-md hover:bg-red-400 focus:outline-none dark:bg-gray-100 dark:hover:bg-gray-300">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                        </button> */}
                                                    </td>
                                                </tr>
                                                
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <hr className="mt-6 border-b-1 border-gray-300"/>

                        <h6 className="text-gray-400 text-sm mt-3 mb-6 font-bold uppercase">
                            Informasi Pekerjaan
                        </h6>

                        <div className="mt-4 mx-4">
                            <form onSubmit={createServiceHandler.bind(this)} className={(isPrinted) ? "flex flex-wrap hidden" : "flex flex-wrap"}>
                                <div className="w-full lg:w-5/12 px-4">
                                    <div className="relative w-full mb-3">
                                    <label className="block uppercase text-gray-600 text-xs font-bold mb-2" >
                                        Uraian Pekerjaan:
                                    </label>
                                    <input required autoComplete="off" onChange={serviceFieldHandler.bind(this)} name="name" value={val.name} type="text" className="border-0 px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
                                    </div>
                                </div>
                                <div className="w-full lg:w-5/12 px-4">
                                    <div className="relative w-full mb-3">
                                    <label className="block uppercase text-gray-600 text-xs font-bold mb-2" >
                                        Biaya Pekerjaan:
                                    </label>
                                    <input required autoComplete="off" onChange={serviceFieldHandler.bind(this)} name="price" value={val.price} type="text" className="border-0 px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
                                    </div>
                                </div>
                                <div className="w-full lg:w-2/12 px-4">
                                    <div className="relative w-full mb-3">
                                        <label className="block uppercase text-gray-600 text-xs font-bold mb-2" >
                                            <br/>
                                        </label>
                                        <div className="text-center flex justify-end px-2 py-2">
                                            <button type="submit" className="bg-sky-700 hover:bg-sky-600 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150">
                                                Tambah
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div className="w-full overflow-hidden rounded-lg shadow-xs">
                                <div className="w-full overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                                                <th className="w-1/12 truncate ... px-4 py-3">No.</th>
                                                <th className="w-4/12 truncate ... px-4 py-3">Uraian Pekerjaan</th>
                                                <th className="w-4/12 truncate ... px-4 py-3">Biaya Pekerjaan</th>
                                                <th className="truncate ... px-4 py-3"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                                            { serviceProps?.map((service, i) => (
                                                <tr key={service.id} className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400">
                                                    <td className="w-1/12 truncate ... px-4 py-3 text-sm">{ i+1 }</td>
                                                    <td className="w-4/12 truncate ... px-4 py-3 text-sm">{ service.name }</td>
                                                    <td className="w-4/12 truncate ... px-4 py-3 text-sm">
                                                        <CurrencyFormat value={service.price} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} />
                                                    </td>
                                                    <td className="px-4 py-3 text-sm flex justify-end">
                                                        {/* <button type="button" className="mr-4 px-3 py-2 text-xs font-medium text-center text-white bg-gray-300 rounded-md hover:bg-blue-400 focus:outline-none dark:bg-gray-100 dark:hover:bg-gray-300">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon></svg>
                                                        </button> */}
                                                        <button onClick={deleteHandler.bind(this, service.id)} type="button" className={(isPrinted) ? "px-3 py-2 text-xs font-medium text-center text-white bg-gray-300 rounded-md hover:bg-red-400 focus:outline-none dark:bg-gray-100 dark:hover:bg-gray-300 hidden" : "px-3 py-2 text-xs font-medium text-center text-white bg-gray-300 rounded-md hover:bg-red-400 focus:outline-none dark:bg-gray-100 dark:hover:bg-gray-300"}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <hr className="mt-6 border-b-1 border-gray-300"/>

                        <h6 className="text-gray-400 text-sm mt-3 mb-6 font-bold uppercase">
                            Uraian Biaya
                        </h6>
                        
                        <div className="flex flex-wrap">
                            <div className="w-full lg:w-10/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-gray-600 text-xs font-bold mb-2" >
                                        Spare Part / Oli
                                    </label>
                                </div>
                            </div>
                            <div className="w-full lg:w-2/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-gray-600 text-sm mb-2 normal-case" >
                                        {ssProps?.map((ss) => {totalSS = totalSS + ss.itemTotalPrice})}
                                        <CurrencyFormat value={totalSS} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} />
                                    </label>
                                </div>
                            </div>
                            <div className="w-full lg:w-10/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-gray-600 text-xs font-bold mb-2" >
                                        Ongkos Kerja
                                    </label>
                                </div>
                            </div>
                            <div className="w-full lg:w-2/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-gray-600 text-sm mb-2 normal-case" >
                                        {serviceProps?.map((service) => {totalService = totalService + service.price})}
                                        <CurrencyFormat value={totalService} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <hr className="mb-6 border-b-1 border-gray-300"/>

                        <div className="flex flex-wrap">
                            <div className="w-full lg:w-10/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-gray-600 text-xs font-bold mb-2" >
                                        Total
                                    </label>
                                </div>
                            </div>
                            <div className="w-full lg:w-2/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-gray-600 text-sm mb-2" >
                                        <CurrencyFormat value={totalSS + totalService} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* End - Main Content */}

                    </div>
                    {/* End - Main Card */}

                    {/* Start - Footer Card */}
                    <div className="rounded-t bg-white mb-0 px-3 py-3">
                        <div className="text-center flex justify-between">
                            <h6 className="text-gray-700 text-xl font-bold" />
                            <div>
                                {(orderData.printCount < 1) ?
                                <button onClick={updateHandler.bind(this, orderData.id)} className="bg-green-500 hover:bg-green-600 text-white active:bg-green-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150" type="button">
                                    Selesai
                                </button>
                                :
                                <ReactToPrint
                                trigger={() => {
                                    return (
                                        <button className="bg-green-500 hover:bg-green-600 text-white active:bg-green-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150" type="button">
                                            Cetak
                                        </button>
                                    )
                                }}
                                content={() => componentRef.current}
                                />
                                }
                            </div>
                        </div>
                    </div>
                    {/* End - Footer Card */}
                    
                </div>
            </div>
            {/* End - Container */}

        </div>
    </div>
    {/* End - Modal */}

    <SSModal isVisible={ssModal} onClose={() => {setVisibleSS(false); setSSGroupRead(false); setSSRead(false);}} ssGroupData={ssGroupData} token={token} orderData={orderData} />

    <div className='hidden'>
        <div className='h-full bg-white text-black flex flex-col justify-between' ref={componentRef}>
        
            {ssGroupProps?.map((ssgroup) => {
                totalSSGroupPrice = 0;
                return (
                    <div className='containerPrint'>
                    <div className='flex flex-col h-1/2 w-screen pt-6 pl-6 pr-6 uppercase'>
    
                        <div className=''>LAMPIRAN SUKU CADANG & MATERIAL</div>
    
                        <div className='flex flex-row'>
                            <div className='flex flex-row w-3/4'>
                                <div className='flex flex-col w-1/6 normal-case'>
                                    <div>Jenis Kendaraan</div>
                                    <div>No. Polisi</div>
                                    <div>Nama</div>
                                    <div>Alamat</div>
                                </div>
                                <div className='flex flex-col w-5/6'>
                                    <div>: {orderData.jenisKendaraan}</div>
                                    <div>: {orderData.nomorPolisi}</div>
                                    <div>: {orderData.customerName}</div>
                                    <div>: {orderData.customerAddress}</div>
                                </div>
                            </div>
                            <div className='flex flex-row w-1/4'>
                                <div className='flex flex-col w-1/3 normal-case'>
                                    <div>No. SPK</div>
                                    <div>No. SS</div>
                                    <div>Tanggal</div>
                                    <div>Waktu</div>
                                </div>
                                <div className='flex flex-col wsgroupid-2/3'>
                                    <div>: {orderData.nomorSPK}</div>
                                    <div>: {orderData.orderId}</div>
                                    <div>: {('0' + d.getDate()).slice(-2)+'/'+('0' + d.getMonth()).slice(-2)+'/'+d.getFullYear()}</div>
                                    <div>: {('0' + d.getHours()).slice(-2) +':'+ ('0' + d.getMinutes()).slice(-2) +':'+ ('0' + d.getSeconds()).slice(-2)}</div>
                                </div>
                            </div>
                        </div>
    
                        <hr className="border-1 border-dashed border-black mt-1"/>
                        <hr className="border-1 border-dashed border-black my-1"/>
    
                        <div className='flex flex-row normal-case'>
                            <div className='w-1/12'>No.</div>
                            <div className='w-3/12'>Kode</div>
                            <div className='w-3/12'>Nama</div>
                            <div className='w-1/12'>Jumlah</div>
                            <div className='w-2/12'>H.Satuan</div>
                            <div className='w-2/12'>Total</div>
                        </div>
    
                        <hr className="border-1 border-dashed border-black my-1"/>
                        <hr className="border-1 border-dashed border-black mb-1"/>
    
                        {ssProps?.map((ss, i) => {
                            if(ss.ssGroupId == ssgroup.id) {
                                totalSSGroupPrice = totalSSGroupPrice + ss.itemTotalPrice;
                                if(i + 1 == ssProps.length) {
                                    return (
                                        <div>
                                            <div className='flex flex-row uppercase'>
                                                <div className='w-1/12'>{i + 1}</div>
                                                <div className='w-3/12'>{ss.itemCode}</div>
                                                <div className='w-3/12'>{ss.itemName}</div>
                                                <div className='w-1/12'>{ss.itemCount}</div>
                                                <div className='w-2/12'><CurrencyFormat value={ss.itemPrice} displayType={'text'} thousandSeparator={true} prefix={''} /></div>
                                                <div className='w-2/12'><CurrencyFormat value={ss.itemTotalPrice} displayType={'text'} thousandSeparator={true} prefix={''} /></div>
                                            </div>
    
                                            <div className='flex flex-row justify-end pt-4'>
                                                <div className='flex flex-col w-1/12'>
                                                    <div>SUBTOTAL</div>
                                                    <div>TOTAL</div>
                                                </div>
                                                <div className='flex flex-col w-2/12 text-center'>
                                                    <div>{'--------->'}</div>
                                                    <div>{'--------->'}</div>
                                                </div>
                                                <div className='flex flex-col w-2/12'>
                                                    <div><CurrencyFormat value={totalSSGroupPrice} displayType={'text'} thousandSeparator={true} prefix={''} /></div>
                                                    <div><CurrencyFormat value={totalSSGroupPrice} displayType={'text'} thousandSeparator={true} prefix={''} /></div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                else {
                                    return (
                                        <div>
                                            <div className='flex flex-row uppercase'>
                                                <div className='w-1/12'>{i + 1}</div>
                                                <div className='w-3/12'>{ss.itemCode}</div>
                                                <div className='w-3/12'>{ss.itemName}</div>
                                                <div className='w-1/12'>{ss.itemCount}</div>
                                                <div className='w-2/12'><CurrencyFormat value={ss.itemPrice} displayType={'text'} thousandSeparator={true} prefix={''} /></div>
                                                <div className='w-2/12'><CurrencyFormat value={ss.itemTotalPrice} displayType={'text'} thousandSeparator={true} prefix={''} /></div>
                                            </div>
                                        </div>
                                    );
                                }
                            }
                            if(i + 1 == ssProps.length) {
                                return (
                                    <div className='flex flex-row justify-end pt-4'>
                                        <div className='flex flex-col w-1/12'>
                                            <div>SUBTOTAL</div>
                                            <div>TOTAL</div>
                                        </div>
                                        <div className='flex flex-col w-2/12 text-center'>
                                            <div>{'--------->'}</div>
                                            <div>{'--------->'}</div>
                                        </div>
                                        <div className='flex flex-col w-2/12'>
                                            <div><CurrencyFormat value={totalSSGroupPrice} displayType={'text'} thousandSeparator={true} prefix={''} /></div>
                                            <div><CurrencyFormat value={totalSSGroupPrice} displayType={'text'} thousandSeparator={true} prefix={''} /></div>
                                        </div>
                                    </div>
                                );
                            }
                        })}
    
                    </div>
                    </div>
                );
            })}
            <div className='containerPrint'>
            <div className='flex flex-col h-1/2 w-screen pt-6 pl-6 pr-6 uppercase'>
                    
                <div className='flex h-fit flex-row'>
                    <div className='flex flex-col justify-end w-1/3 text-xs'>
                        <div>PT. RADITA AUTOPRIMA</div>
                        <div>JL. ABDULRACHMAN SALEH 64</div>
                        <div>Telp : 022 6011217 . FAX : 022 6020938</div>
                    </div>
                    <div className='flex flex-col justify-end w-1/3 h-full text-center text-lg align-bottom font-bold'>
                        KAISAR PLAZA
                    </div>
                    <div className='w-1/3' />
                </div>

                <hr className="border-1 border-black"/>

                <div className='flex flex-row'>
                    <div className='flex flex-row w-2/5 text-sm'>
                        <div className='flex flex-col w-2/5'>
                            <br></br>
                            <div>NAMA CUSTOMER</div>
                            <div>ALAMAT</div>
                            <div>&nbsp;</div>
                            <div>NO.TELP</div>
                        </div>
                        <div className='flex flex-col'>
                            <br></br>
                            <div>: {orderData.customerName}</div>
                            <div>: {orderData.customerAddress}</div>
                            <div>&nbsp;</div>
                            <div>: {orderData.customerPhone}</div>
                        </div>
                    </div>
                    <div className='flex flex-col w-1/5 h-full text-center text-lg align-bottom font-bold'>
                        KWITANSI
                    </div>
                    <div className='flex flex-row justify-end w-2/5 text-sm'>
                        <div className='flex flex-col mr-2'>
                            <br></br>
                            <div>NO.POLISI</div>
                            <div>TYPE</div>
                            <div>NO.RANGKA</div>
                            <div>NO.MESIN</div>
                        </div>
                        <div className='flex flex-col w-1/2'>
                            <br></br>
                            <div>: {orderData.nomorPolisi}</div>
                            <div>: {orderData.jenisKendaraan}</div>
                            <div>: {orderData.nomorRangka}</div>
                            <div>: {orderData.nomorMesin}</div>
                        </div>
                    </div>
                </div>

                <hr className="border-1 border-black my-1"/>

                <div className='flex justify-between text-sm'>
                    <div className='flex flex-row w-1/4'>
                        <div>NO.SPK :&nbsp;</div>
                        <div>{orderData.nomorSPK}</div>
                    </div>
                    <div className='flex flex-row w-1/4'>
                        <div>KM :&nbsp;</div>
                        <div></div>
                    </div>
                    <div className='flex flex-row w-1/4'>
                        <div>SA/TEK :&nbsp;</div>
                        <div>{(orderData !== undefined) ? orderData.userId : ''}</div>
                    </div>
                    <div className='flex flex-row w-1/4'>
                        <div>NO.KWITANSI :&nbsp;</div>
                        <div>{orderData.orderId}</div>
                    </div>
                </div>

                <hr className="border-1 border-black my-1"/>

                <div className='flex flex-row justify-between text-sm text-center'>
                    <div className='flex flex-col w-1/3'>
                        <div className='font-bold'>*** URAIAN PEKERJAAN ***</div>
                        {serviceProps?.map((service) => (<div>{service.name}</div>))}
                    </div>
                    <div className='flex flex-col w-1/3'>
                        <div className='font-bold'>*** ONGKOS KERJA ***</div>
                        {serviceProps?.map((service) => (<div><CurrencyFormat value={service.price} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></div>))}
                    </div>
                    <div className='flex flex-col w-1/3'>
                        <div className='font-bold'>*** URAIAN BIAYA ***</div>
                        <div className='flex flex-row'>
                            <div className='w-1/2 text-start'>ONGKOS KERJA</div>
                            <div className='w-1/2 text-end'><CurrencyFormat value={totalService} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></div>
                        </div>
                        <div className='flex flex-row'>
                            <div className='w-1/2 text-start'>SUKU CADANG/OLI</div>
                            <div className='w-1/2 text-end'><CurrencyFormat value={totalSS} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></div>
                        </div>
                        <div className='flex flex-row'>
                            <div className='w-1/2 text-start'>&nbsp;</div>
                            <div className='w-1/2 text-end'>&nbsp;</div>
                        </div>
                        <div className='flex flex-row'>
                            <div className='w-1/2 text-start'>&nbsp;</div>
                            <div className='w-1/2 text-end'>&nbsp;</div>
                        </div>
                        <div className='flex flex-row'>
                            <div className='w-1/2 text-start'>&nbsp;</div>
                            <div className='w-1/2 text-end'>&nbsp;</div>
                        </div>
                        <div className='flex flex-row'>
                            <div className='w-1/2 text-start'>&nbsp;</div>
                            <div className='w-1/2 text-end'>&nbsp;</div>
                        </div>
                        <div className='flex flex-row'>
                            <div className='w-1/2 text-start'>&nbsp;</div>
                            <div className='w-1/2 text-end'>&nbsp;</div>
                        </div>
                        <div className='flex flex-row'>
                            <div className='w-1/2 text-start font-bold'>TOTAL</div>
                            <div className='w-1/2 text-end font-bold'><CurrencyFormat value={totalSS + totalService} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></div>
                        </div>
                    </div>
                </div>

                <hr className="border-1 border-black my-1"/>
                
                <div className='flex flex-row text-sm'>

                    <div className='flex flex-col w-3/4'>
                        <div className='flex flex-row'>
                            <div className='w-1/2'>TOTAL ONGKOS KERJA PERBAIKAN</div>
                            <div><CurrencyFormat value={totalService} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></div>
                        </div>
                        <div className='flex flex-col'>
                            <div>&nbsp;</div>
                            <div>TERBILANG</div>
                            <div className='font-bold'>{terbilang(totalSS + totalService) + ' RUPIAH'}</div>
                        </div>
                    </div>

                    <div className='flex flex-col text-center'>
                        <div>&nbsp;</div>
                        <div>BANDUNG,&nbsp;{('0' + d.getDate()).slice(-2)+'/'+('0' + d.getMonth()).slice(-2)+'/'+d.getFullYear()}</div>
                        <div>DIKERJAKAN OLEH</div>
                        <div>&nbsp;</div>
                        <div>&nbsp;</div>
                        <div>&nbsp;</div>
                        <div>KAISAR</div>
                    </div>

                </div>

            </div>
            </div>
        </div>
    </div>

    </>
    );

}