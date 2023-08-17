import React, { useState } from 'react';
import Router from 'next/router';

export default function CreatePurchaseModal({ isVisible, onClose, token }) {

    if(!isVisible) return null;

    function closeHandler(e) {
        e.preventDefault();
        onClose();
    }

    const [status, setStatus] = useState('normal');

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    const strToday = yyyy + '-' + mm + '-' + dd;

    // read items
    const [itemProps, setItemProps] = useState();
    const [itemRead, setItemRead] = useState(false);
    if (!itemRead) readItemHandler();
    async function readItemHandler() {
        setItemRead(true);
        const itemReq = await fetch('/api/item', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .catch((error) => {
            console.log(error)
        });
        const items = await itemReq.json();
        setItemProps(items.data);
    }

    // item input handler
    const [displaySearchItem, setDisplaySearchItem] = useState("hidden");
    const [selectedItem, setSelectedItem] = useState();
    const [searchItem, setSearchItem] = useState('');
    function searchItemHandler(e) {
        setSearchItem(e.target.value);
    }

    const [fields, setFields] = useState({
        document_id: '',
        date: strToday,
        supplier: '',
        item_code: '',
        qty: 0,
        price: 0,
        disc: 0,
        ppn: 0
    });

    async function createPurchaseHandler(e) {
        e.preventDefault();
        const createPurchaseReq = await fetch('/api/purchase/create', {
            method: 'POST',
            body: JSON.stringify({
                document_id: fields.document_id,
                date: fields.date,
                supplier: fields.supplier,
                item_code: selectedItem.code,
                qty: fields.qty,
                price: fields.price,
                disc: fields.disc,
                ppn: fields.ppn
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .catch((error) => {
            console.log(error)
        });
        if(!createPurchaseReq.ok) return setStatus('error' + createPurchaseReq.status);
        Router.replace('/purchase');
        onClose();
    }

    function fieldHandler(e) {
        const name = e.target.getAttribute('name');
        setFields({
            ...fields,
            [name]: e.target.value
        });
    }

    return(
    <>

    <div className="h-full py-12 transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0" id="modal">
        <div role="alert" className="container mx-auto w-11/12 md:w-2/3 max-w-lg">
            <div className="relative py-8 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400">
                <form onSubmit={createPurchaseHandler.bind(this)} action="">
                    <label htmlFor="document_id" className="text-gray-800 text-sm font-bold leading-tight tracking-normal">No. Dokumen</label>
                    <input required autoComplete="off" onChange={fieldHandler.bind(this)} name="document_id" id="document_id" className="mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="" />
                    <div className="text-red-500">
                        {(status == 'normal') ? <br className='mb-5'/> : 'Nomor dokumen sudah terdaftar' }
                    </div>

                    <label htmlFor="date" className="text-gray-800 text-sm font-bold leading-tight tracking-normal">Tanggal</label>
                    <div className="flex items-center mb-5 mt-2">
                        <div className="flex items-center">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
                                </div>
                                <input defaultValue={strToday} onChange={fieldHandler.bind(this)} name="date" type="date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date end"/>
                            </div>
                        </div>
                    </div>
                    
                    <label htmlFor="supplier" className="text-gray-800 text-sm font-bold leading-tight tracking-normal">Supplier</label>
                    <input required autoComplete="off" onChange={fieldHandler.bind(this)} name="supplier" id="supplier" className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="" />
                    
                    <label htmlFor="item_code" className="text-gray-800 text-sm font-bold leading-tight tracking-normal">Kode Barang</label>

                    <button onClick={(e) => {e.stopPropagation(); (displaySearchItem == "hidden") ? setDisplaySearchItem('') : (setSearchItem(''), setDisplaySearchItem("hidden"))}} type="button" className="text-start border-0 px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" id="grid-state">
                        <div className="h-full">{ (!selectedItem) ? <br/> : selectedItem.code + ' - ' + selectedItem.name }</div>
                    </button>
                    
                    <div onClick={(e) => e.stopPropagation()} className={displaySearchItem + " w-10/12 rounded bg-neutral-50 shadow-md my-2 absolute z-10 pin-t pin-l"}>
                        <ul className="list-reset">
                            <li className="p-2"><input value={searchItem} autoComplete="off" onChange={searchItemHandler.bind(this)} placeholder="Cari kode atau nama barang" type="text" className="focus:placeholder-transparent p-2 border-2 rounded h-8 w-full"/><br/></li>
                            { itemProps?.filter(item => {
                                const filterName = searchItem.toLowerCase();
                                const fullCode = item.code.toLowerCase();
                                const fullName = item.name.toLowerCase();

                                return searchItem && fullCode.includes(filterName) || searchItem && fullName.includes(filterName);
                            })
                            .slice(0, 5)
                            .map((item) => (
                                <li key={item.id} onClick={() => {setSelectedItem(item); setSearchItem(''); setDisplaySearchItem("hidden")}}><p className="p-2 block text-black hover:bg-blue-500 hover:text-white cursor-pointer">{item.code + ' - ' + item.name}</p></li>
                            ))}
                        </ul>
                    </div>
                    
                    <label htmlFor="qty" className="text-gray-800 text-sm font-bold leading-tight tracking-normal">Qty</label>
                    <input required autoComplete="off" onChange={fieldHandler.bind(this)} name="qty" id="qty" className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="" />

                    <label htmlFor="price" className="text-gray-800 text-sm font-bold leading-tight tracking-normal">Harga</label>
                    <input required autoComplete="off" onChange={fieldHandler.bind(this)} name="price" id="price" className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="" />

                    <label htmlFor="gross" className="text-gray-800 text-sm font-bold leading-tight tracking-normal">Gross</label>
                    <input disabled required value={fields.price*fields.qty} autoComplete="off" name="gross" id="gross" className="bg-gray-200 mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="" />

                    <label htmlFor="disc" className="text-gray-800 text-sm font-bold leading-tight tracking-normal">Disc (0.00 - 1.00)</label>
                    <input autoComplete="off" onChange={fieldHandler.bind(this)} name="disc" id="disc" className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="" />

                    <label htmlFor="ppn" className="text-gray-800 text-sm font-bold leading-tight tracking-normal">PPN (0.00 - 1.00)</label>
                    <input autoComplete="off" onChange={fieldHandler.bind(this)} name="ppn" id="ppn" className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="" />

                    <label htmlFor="total" className="text-gray-800 text-sm font-bold leading-tight tracking-normal">Total</label>
                    <input disabled required value={((fields.price*fields.qty) - ((fields.price*fields.qty) * fields.disc) + (((fields.price*fields.qty) - ((fields.price*fields.qty) * fields.disc)) * fields.ppn))} autoComplete="off" name="total" id="total" className="bg-gray-200 mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="" />


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