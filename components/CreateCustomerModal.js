import React, { useState } from 'react';
import Router from 'next/router';

export default function CreateCustomerModal({ isVisible, onClose }) {

    if(!isVisible) return null;

    function closeHandler(e) {
        e.preventDefault();
        onClose();
    }

    const [status, setStatus] = useState('normal');

    const [fields, setFields] = useState({
        name: '',
        address: '',
        phone: ''
    });

    async function createCustomerHandler(e) {
        e.preventDefault();
        const createCustomerReq = await fetch('/api/customer/create', {
            method: 'POST',
            body: JSON.stringify(fields),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .catch((error) => {
            console.log(error)
        });
        if(!createCustomerReq.ok) return setStatus('error' + createCustomerReq.status);
        Router.replace('/customer');
        onClose();
    }

    function fieldHandler(e) {
        const name = e.target.getAttribute('name');

        let text = e.target.value;
        let filteredText = '';

        if(name === 'name') {
            if(text.startsWith(' ')) {
                filteredText = text.trimStart();
            }
            else if(text.length <= 32) {
                // Menghapus karakter selain huruf dan spasi
                const sanitizedText = text.replace(/[^a-zA-Z\s]/g, '');
                
                // Mengubah setiap kata menjadi huruf kapital di awal
                const capitalizedText = sanitizedText.replace(/\b\w/g, (char) => char.toUpperCase());
                
                // Menghapus double spasi
                const singleSpacedText = capitalizedText.replace(/\s+/g, ' ');

                filteredText = singleSpacedText;
            }
            else {
                filteredText = fields.name;
            }
        }
        if(name === 'address') {
            if(text.startsWith(' ')) {
                filteredText = text.trimStart();
            }
            else if(text.length <= 108) {
                // Mengubah setiap kata menjadi huruf kapital di awal
                const capitalizedText = text.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                
                // Menghapus double spasi
                const singleSpacedText = capitalizedText.replace(/\s+/g, ' ');

                filteredText = singleSpacedText;
            }
            else {
                filteredText = fields.address;
            }
        }
        else if(name === 'phone') {
            if(text.startsWith(' ')) {
                filteredText = text.trimStart();
            }
            else if(text.length <= 18) {
                // Menerapkan regex untuk menghapus karakter selain angka dan simbol '+'
                const sanitizedText = text.replace(/[^0-9+]/g, '');

                filteredText = sanitizedText;
            }
            else {
                filteredText = fields.phone;
            }
        }

        setFields({
            ...fields,
            [name]: filteredText
        });
    }

    return(
    <>

    <div className="h-full py-12 bg-black bg-opacity-30 transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0" id="modal">
        <div role="alert" className="container mx-auto w-11/12 md:w-2/3 max-w-lg">
            <div className="relative py-8 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400">
                <form onSubmit={createCustomerHandler.bind(this)} action="">
                    <label htmlFor="name" className="text-gray-800 text-sm font-bold leading-tight tracking-normal">Nama</label>
                    <input required autoComplete="off" onChange={fieldHandler.bind(this)} name="name" value={fields.name} id="name" className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="" />
                    <label htmlFor="address" className="text-gray-800 text-sm font-bold leading-tight tracking-normal">Alamat</label>
                    <input required autoComplete="off" onChange={fieldHandler.bind(this)} name="address" value={fields.address} id="address" className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="" />
                    <label htmlFor="phone" className="text-gray-800 text-sm font-bold leading-tight tracking-normal">Nomor Telepon</label>
                    <input required autoComplete="off" onChange={fieldHandler.bind(this)} name="phone" value={fields.phone} id="phone" className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="" />
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