import React, { useState } from 'react';
import Router from 'next/router';
import Cookies from 'js-cookie';

export default function CreateOrderModal({ isVisible, onClose, token }) {

    if(!isVisible) return null;

    function closeHandler(e) {
        e.preventDefault();
        onClose();
    }

    const [status, setStatus] = useState('normal');

    // read customers
    const [customerProps, setCustomerProps] = useState();
    const [customerRead, setCustomerRead] = useState(false);
    if (!customerRead) readCustomerHandler();
    async function readCustomerHandler() {
        setCustomerRead(true);
        const customerReq = await fetch('/api/customer', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .catch((error) => {
            console.log(error)
        });
        const customers = await customerReq.json();
        setCustomerProps(customers.data);
    }

    // customer input handler
    const [displaySearchCustomer, setDisplaySearchCustomer] = useState("hidden");
    const [selectedCustomer, setSelectedCustomer] = useState();
    const [searchCustomer, setSearchCustomer] = useState('');
    function searchCustomerHandler(e) {
        setSearchCustomer(e.target.value);
    }

    const [fields, setFields] = useState({
        nomorPolisi: '',
        jenisKendaraan: '',
        nomorRangka: '',
        nomorMesin: '',
        nomorSPK: '',
        printCount: '0'
    });

    function fieldHandler(e) {
        const name = e.target.getAttribute('name');
        setFields({
            ...fields,
            [name]: e.target.value
        });
    }

    async function createOrderHandler(e) {
        e.preventDefault();
        const createOrderReq = await fetch('/api/order/create', {
            method: 'POST',
            body: JSON.stringify({
                nomorPolisi: fields.nomorPolisi,
                jenisKendaraan: fields.jenisKendaraan,
                nomorRangka: fields.nomorRangka,
                nomorMesin: fields.nomorMesin,
                nomorSPK: fields.nomorSPK,
                printCount: '0',
                customerId: selectedCustomer.id,
                userId: Cookies.get('username')
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .catch((error) => {
            console.log(error)
        });
        if(!createOrderReq.ok) return setStatus('error' + createOrderReq.status);
        Router.replace('/dashboard');
        onClose();
    }

    return(
    <>

    <div className="h-full py-12 bg-black bg-opacity-30 transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0" id="modal">
        <div role="alert" className="container mx-auto w-11/12 md:w-2/3 max-w-lg">
            <div className="relative py-8 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400">
                <form onSubmit={createOrderHandler.bind(this)} action="">

                    <label htmlFor="customerId" className="text-gray-800 text-sm font-bold leading-tight tracking-normal">Customer ID</label>
                    <button onClick={(e) => {e.stopPropagation(); (displaySearchCustomer == "hidden") ? setDisplaySearchCustomer('') : (setSearchCustomer(''), setDisplaySearchCustomer("hidden"))}} type="button" className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" id="grid-state">
                        <div>{ (!selectedCustomer) ? <br/> : selectedCustomer.id + ' - ' + selectedCustomer.name }</div>
                    </button>
                    <div onClick={(e) => e.stopPropagation()} className={displaySearchCustomer + " w-3/4 rounded bg-neutral-50 shadow-md absolute z-10 pin-t pin-l"}>
                        <ul className="list-reset">
                            <li className="p-2"><input value={searchCustomer} autoComplete="off" onChange={searchCustomerHandler.bind(this)} placeholder="Cari ID atau nama customer" type="text" className="focus:placeholder-transparent p-2 border-2 rounded h-8 w-full"/><br/></li>
                            { customerProps?.filter(customer => {
                                const filterName = searchCustomer.toLowerCase();
                                const fullID = customer.id.toLowerCase();
                                const fullName = customer.name.toLowerCase();

                                return searchCustomer && fullID.startsWith(filterName) || searchCustomer && fullName.startsWith(filterName);
                            })
                            .slice(0, 5)
                            .map((customer) => (
                                <li key={customer.id} onClick={() => {setSelectedCustomer(customer); setSearchCustomer(''); setDisplaySearchCustomer("hidden")}}><p className="p-2 block text-black hover:bg-blue-500 hover:text-white cursor-pointer">{customer.id + ' - ' + customer.name}</p></li>
                            ))}
                        </ul>
                    </div>

                    {/* <label htmlFor="customerId" className="text-gray-800 text-sm font-bold leading-tight tracking-normal">Customer ID</label>
                    <input required autoComplete="off" onChange={fieldHandler.bind(this)} name="customerId" id="customerId" className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="" /> */}
                    
                    <label htmlFor="nomorPolisi" className="text-gray-800 text-sm font-bold leading-tight tracking-normal">Nomor Polisi</label>
                    <input required autoComplete="off" onChange={fieldHandler.bind(this)} name="nomorPolisi" id="nomorPolisi" className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="" />
                    <label htmlFor="jenisKendaraan" className="text-gray-800 text-sm font-bold leading-tight tracking-normal">Jenis Kendaraan</label>
                    <input autoComplete="off" onChange={fieldHandler.bind(this)} name="jenisKendaraan" id="jenisKendaraan" className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="" />
                    <label htmlFor="nomorRangka" className="text-gray-800 text-sm font-bold leading-tight tracking-normal">Nomor Rangka</label>
                    <input autoComplete="off" onChange={fieldHandler.bind(this)} name="nomorRangka" id="nomorRangka" className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="" />
                    <label htmlFor="nomorMesin" className="text-gray-800 text-sm font-bold leading-tight tracking-normal">Nomor Mesin</label>
                    <input autoComplete="off" onChange={fieldHandler.bind(this)} name="nomorMesin" id="nomorMesin" className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="" />
                    <label htmlFor="nomorSPK" className="text-gray-800 text-sm font-bold leading-tight tracking-normal">Nomor SPK</label>
                    <input autoComplete="off" onChange={fieldHandler.bind(this)} name="nomorSPK" id="nomorSPK" className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="" />
                    <div className="flex items-center justify-end w-full">
                        <button type="submit" className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition duration-150 ease-in-out hover:bg-sky-600 bg-sky-700 rounded text-white px-8 py-2 text-sm">Simpan</button>
                        <button type="button" onClick={closeHandler.bind(this)} className="focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-gray-400 ml-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm">Batal</button>
                    </div>
                </form>
                <button onClick={closeHandler.bind(this)} className="cursor-pointer absolute top-0 right-0 mt-4 mr-5 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out rounded focus:ring-2 focus:outline-none focus:ring-gray-600" aria-label="close modal" role="button">
                    <svg xmlns="http://www.w3.org/2000/svg"  className="icon icon-tabler icon-tabler-x" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>
        </div>
    </div>

    </>
    );

}