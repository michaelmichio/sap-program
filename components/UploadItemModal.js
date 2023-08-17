import React, { useState } from 'react';
import Router from 'next/router';
import * as XLSX from 'xlsx';
import Swal from "sweetalert2";

export default function UploadItemModal({ isVisible, onClose }) {

    if(!isVisible) return null;

    function closeHandler(e) {
        e.preventDefault();
        onClose();
    }

    const [status, setStatus] = useState('normal');

    const [items, setItems] = useState([]);
    const [fileName, setFileName] = useState('No file choosen');

    const readExcel = (file) => {
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            fileReader.onload = (e) => {
                try {
                    const bufferArray = e.target.result;
    
                    const wb = XLSX.read(bufferArray, {type:'buffer'});
    
                    const wsname = wb.SheetNames[0];
    
                    const ws = wb.Sheets[wsname];
    
                    const data = XLSX.utils.sheet_to_json(ws);
    
                    resolve(data);
                } catch (error) {
                    console.log(error);
                }
            };

            fileReader.onerror = ((error) => {
                reject(error);
            });
        });
        promise.then((d) => {
            setItems(d);
        });
    };

    async function createItemsHandler(e) {
        e.preventDefault();
        console.log({items});
        const createItemsReq = await fetch('/api/item/import', {
            method: 'POST',
            body: JSON.stringify({items}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .catch((error) => {
            console.log(error);
        });
        if(!createItemsReq.ok) return Swal.fire(
            'Gagal!',
            'Data gagal ditambahkan.',
            'error'
        );
        else {
            Router.replace('/stock');
            onClose();
            Swal.fire(
                'Sukses!',
                'Data berhasil ditambahkan.',
                'success'
            );
        }
    }

    return(
    <>

    <div className="h-full py-12 bg-black bg-opacity-30 transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0" id="modal">
        <div role="alert" className="container mx-auto w-11/12 md:w-2/3 max-w-lg">
            <div className="relative py-8 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400">
                <form onSubmit={(e) => createItemsHandler(e)} action="">
                    <svg className="text-gray-500 w-24 mx-auto mt-12 mb-4" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 8l-5-5-5 5M12 4.2v10.3"/></svg>
                    <label className="flex items-center justify-center w-full text-center">
                        <input onChange={(e) => {const file = e.target.files[0]; readExcel(file); setFileName(e.target.files[0].name)}} className="text-sm cursor-pointer w-36 hidden" type="file" multiple />
                        <div className="w-1/2 text hover:bg-sky-600 bg-sky-700 text-white border border-gray-300 rounded cursor-pointer p-1 px-3">Upload File</div>
                    </label>
                    <div className="mt-4 mb-24 flex items-center justify-center w-full text-gray-800 text-sm font-bold leading-tight tracking-normal">{fileName}</div>
                    <div className="flex items-center justify-end w-full">
                        <button type="submit" className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition duration-150 ease-in-out hover:bg-green-600 bg-green-500 rounded text-white px-8 py-2 text-sm">Submit</button>
                        <button type="button" onClick={closeHandler.bind(this)} className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 ml-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm">Batal</button>
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