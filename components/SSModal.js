import React, { useState } from 'react';
import CurrencyFormat from "react-currency-format";
import Swal from "sweetalert2";

export default function SSModal({ isVisible, onClose, ssGroupData, token, orderData }) {

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

    // close modal
    function closeHandler(e) {
        e.preventDefault();
        onClose();
    }

    const [status, setStatus] = useState('normal');

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

    // read or update ss
    const [ssProps, setSSProps] = useState();
    const [ssRead, setSSRead] = useState(false);
    if (!ssRead) readSSHandler();
    async function readSSHandler() {
        setSSRead(true);
        const readSSReq = await fetch('/api/ss/read/' + ssGroupData.id, {
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

    // create ss handler
    async function createSSHandler(e) {
        e.preventDefault();
        if(qtyValue > 0 && selectedItem) {
            // create SS
            const createSSReq = await fetch('/api/ss/create', {
                method: 'POST',
                body: JSON.stringify({
                    itemId: selectedItem.id,
                    itemCode: selectedItem.code,
                    itemName: selectedItem.name,
                    itemCount: qtyValue,
                    itemPrice: selectedItem.price,
                    itemTotalPrice: qtyValue * selectedItem.price,
                    ssGroupId: ssGroupData.id,
                    orderId: ssGroupData.orderId
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .catch((error) => {
                console.log(error)
            });
            if(!createSSReq.ok) return setStatus('error' + createSSReq.status);
            const createSSRes = await createSSReq.json();
            const id2data = createSSRes.data;
            // subtract item stock
            const updateItemReq = await fetch('/api/item/subtractStock/' + selectedItem.id, {
                method: 'PUT',
                body: JSON.stringify({
                    stock: qtyValue,
                    orderId: orderData.orderId,
                    itemId: id2data.maxId
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .catch((error) => {
                console.log(error)
            });
            if(!updateItemReq.ok) return setStatus('error' + updateItemReq.status);
            setSSRead(false);
            setSelectedItem();
            setQtyValue("1");
        }
    }

    async function deleteHandler(selectedSS, e) {
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
            deleteSS(selectedSS);
            }
        })
    }

    // delete ss handler
    async function deleteSS(selectedSS) {
        // delete ss
        const deleteItemReq = await fetch('/api/ss/delete/' + selectedSS.id, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .catch((error) => {
            console.log(error)
        });
        if(!deleteItemReq.ok) return setStatus('error' + deleteItemReq.status);
        // add item stock
        const updateItemReq = await fetch('/api/item/addStock/' + selectedSS.itemId, {
            method: 'PUT',
            body: JSON.stringify({
                stock: selectedSS.itemCount,
                id2: selectedSS.id
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .catch((error) => {
            console.log(error)
        });
        if(!updateItemReq.ok) return setStatus('error' + updateItemReq.status);
        setSSRead(false);
    }

    // quantity input handler
    const [qtyValue, setQtyValue] = useState("1");
    function itemFieldHandler(e) {
        if(e.target.value < 1 && e.target.value !== '') {
            setQtyValue("1");
        }
        else {
            setQtyValue(e.target.value);
        }
    }
    
    // item input handler
    const [displaySearchItem, setDisplaySearchItem] = useState("hidden");
    const [selectedItem, setSelectedItem] = useState();
    const [searchItem, setSearchItem] = useState('');
    function searchItemHandler(e) {
        setSearchItem(e.target.value);
    }

    let totalPrice = 0;

    return(
    <>

    {/* Start - Modal */}
    <div onClick={() => {setDisplaySearchItem("hidden"); setSearchItem('')}} className="min-h-full h-fit py-24 bg-black bg-opacity-5 transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0" id="modal">
        <div role="alert" className="container mx-auto w-11/12 md:w-11/12">
            
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
                        <div className="mt-4 mx-4">

                            {/* Start - Main Content */}
                            
                            <h6 className="text-gray-400 text-sm mt-3 mb-6 font-bold uppercase">
                                Informasi Kuitansi
                            </h6>

                            <div className="flex flex-wrap justify-between">
                                <div className="w-full lg:w-1/12 px-4">
                                    <div className="relative w-full mb-3">
                                        <label className="block uppercase text-gray-600 text-xs font-bold mb-2" >
                                            Nomor Kuitansi :
                                        </label>
                                    </div>
                                </div>
                                <div className="w-full lg:w-8/12 px-4">
                                    <div className="relative w-full mb-3">
                                        <label className="block uppercase text-gray-600 text-sm mb-2" >
                                            {ssGroupData.id}
                                        </label>
                                    </div>
                                </div>
                                <div className="w-full lg:w-1/12 px-4">
                                    <div className="relative w-full mb-3">
                                        <label className="block uppercase text-gray-600 text-xs font-bold mb-2" >
                                            Tanggal :
                                        </label>
                                    </div>
                                </div>
                                <div className="w-full lg:w-2/12 px-4">
                                    <div className="relative w-full mb-3">
                                        <label className="block uppercase text-gray-600 text-sm mb-2" >
                                            {ssGroupData.created_at.substring(0, 10)}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <hr className="mb-6 border-b-1 border-gray-300"/>

                            <form onSubmit={createSSHandler.bind(this)} className={(isPrinted) ? "flex flex-wrap hidden" : "flex flex-wrap"}>
                                <div className="w-full lg:w-5/12 px-4">
                                    <div className="relative w-full mb-3">
                                        
                                        <label className="block uppercase text-gray-600 text-xs font-bold mb-2" >
                                            Item:
                                        </label>

                                        <button onClick={(e) => {e.stopPropagation(); (displaySearchItem == "hidden") ? setDisplaySearchItem('') : (setSearchItem(''), setDisplaySearchItem("hidden"))}} type="button" className="text-start border-0 px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" id="grid-state">
                                            <div className="h-full">{ (!selectedItem) ? <br/> : selectedItem.code + ' - ' + selectedItem.name }</div>
                                        </button>
                                        
                                        <div onClick={(e) => e.stopPropagation()} className={displaySearchItem + " w-full rounded bg-neutral-50 shadow-md my-2 absolute z-10 pin-t pin-l"}>
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

                                    </div>
                                </div>
                                <div className="w-full lg:w-1/12 px-4">
                                    <div className="relative w-full mb-3">
                                        <label className="block uppercase text-gray-600 text-xs font-bold mb-2" >
                                            Qty:
                                        </label>
                                        <input required autoComplete="off" onChange={itemFieldHandler.bind(this)} value={qtyValue} name="itemCount" type="number" min="0" step='0.01' className="border-0 px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
                                    </div>
                                </div>
                                <div className="w-full lg:w-2/12 px-4">
                                    <div className="relative w-full mb-3">
                                        <label className="block uppercase text-gray-600 text-xs font-bold mb-2" >
                                            Harga Satuan:
                                        </label>
                                        <input disabled readOnly required autoComplete="off" value={ (!selectedItem) ? '' : selectedItem.price } name="itemPrice" type="text" className="bg-gray-300 border-0 px-3 py-3 placeholder-gray-300 text-gray-600 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
                                    </div>
                                </div>
                                <div className="w-full lg:w-2/12 px-4">
                                    <div className="relative w-full mb-3">
                                        <label className="block uppercase text-gray-600 text-xs font-bold mb-2" >
                                            Harga Total:
                                        </label>
                                        <input disabled readOnly required autoComplete="off" value={ (!selectedItem) ? '' : selectedItem.price * qtyValue } name="itemTotalPrice" type="text" className="bg-gray-300 border-0 px-3 py-3 placeholder-gray-300 text-gray-600 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
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
                                                <th className="w-2/12 truncate ... px-4 py-3">Kode Item</th>
                                                <th className="w-2/12 truncate ... px-4 py-3">Nama Item</th>
                                                <th className="w-1/12 truncate ... px-4 py-3">Qty</th>
                                                <th className="w-2/12 truncate ... px-4 py-3">Harga Satuan</th>
                                                <th className="w-2/12 truncate ... px-4 py-3">Harga Total</th>
                                                {/* <th className="truncate ... px-4 py-3"></th> */}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                                            { ssProps?.map((ss, i) => (
                                                <tr key={ss.id} className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400">
                                                    <td className="w-1/12 truncate ... px-4 py-3 text-sm">{ i+1 }</td>
                                                    <td className="w-2/12 truncate ... px-4 py-3 text-sm">{ ss.itemCode }</td>
                                                    <td className="w-2/12 truncate ... px-4 py-3 text-sm">{ ss.itemName }</td>
                                                    <td className="w-1/12 truncate ... px-4 py-3 text-sm">{ ss.itemCount }</td>
                                                    <td className="w-2/12 truncate ... px-4 py-3 text-sm"><CurrencyFormat value={ss.itemPrice} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></td>
                                                    <td className="w-2/12 truncate ... px-4 py-3 text-sm"><CurrencyFormat value={ss.itemTotalPrice} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></td>
                                                    <td className="px-4 py-3 text-sm flex justify-end">
                                                        <button onClick={deleteHandler.bind(this, ss)} type="button" className={(isPrinted) ? "px-3 py-2 text-xs font-medium text-center text-white bg-gray-300 rounded-md hover:bg-red-400 focus:outline-none dark:bg-gray-100 dark:hover:bg-gray-300 hidden" : "px-3 py-2 text-xs font-medium text-center text-white bg-gray-300 rounded-md hover:bg-red-400 focus:outline-none dark:bg-gray-100 dark:hover:bg-gray-300"}>
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

                            <hr className="mt-6 border-b-1 border-gray-300"/>

                            <h6 className="text-gray-400 text-sm mt-3 mb-6 font-bold uppercase">
                                Uraian Biaya SS
                            </h6>

                            <div className="flex flex-wrap justify-end">
                                <div className="w-full lg:w-1/12 px-4">
                                    <div className="relative w-full mb-3">
                                        <label className="block uppercase text-gray-600 text-xs font-bold mb-2" >
                                            Total
                                        </label>
                                    </div>
                                </div>
                                <div className="w-full lg:w-2/12 px-4">
                                    <div className="relative w-full mb-3">
                                        <label className="block uppercase text-gray-600 text-sm mb-2 normal-case" >
                                            {ssProps?.map((ss) => {totalPrice = totalPrice + ss.itemTotalPrice})}
                                            <CurrencyFormat value={totalPrice} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* End - Main Content */}

                        </div>
                    </div>
                    {/* End - Main Card */}
                    
                    {/* Start - Footer Card */}
                    <div className="rounded-t bg-white mb-0 px-3 py-3">
                        <div className="text-center flex justify-between">
                            <h6 className="text-gray-700 text-xl font-bold" />
                            <button onClick={closeHandler.bind(this)} type="button" className="bg-green-500 text-white active:bg-green-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150">
                                Selesai
                            </button>
                        </div>
                    </div>
                    {/* End - Footer Card */}
                    
                </div>
            </div>
            {/* End - Container */}

        </div>
    </div>
    {/* End - Modal */}

    </>
    );

}