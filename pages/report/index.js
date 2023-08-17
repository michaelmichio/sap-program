import { authPage } from "@/middlewares/authorizationPage";

import Nav from "@/components/Nav";
import Sidebar from "@/components/Sidebar";

import { CSVLink, CSVDownload } from "react-csv";
import React, { useState } from 'react';

export async function getServerSideProps(ctx) {
  
    const { token } = await authPage(ctx);
  
    const orderReq = await fetch('http://localhost:3000/api/order', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .catch((error) => {
      console.log(error)
    });
    
    const orders = await orderReq.json();
    
    return {
      props: {
        token,
        orders: orders.data
      }
    }
  }

export default function ReportIndex(props) {

    const [status, setStatus] = useState('normal');

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    const strThisPeriod = yyyy + '-' + mm + '-01';
    const strToday = yyyy + '-' + mm + '-' + dd;

    const [fields, setFields] = useState({
        type: 'stock',
        start: strThisPeriod,
        end: strToday
    });

    const [data, setData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [readData, setReadData] = useState(true);

    function fieldHandler(e) {
        const name = e.target.getAttribute('name');
        setFields({
            ...fields,
            [name]: e.target.value
        });
        printReportHandler();

    }

    if(readData) printReportHandler();

    async function printReportHandler() {
        setReadData(false);
        
        if(fields.type == 'stock') {
            setHeaders([
                { label: "Kode Barang", key: "item_code" },
                { label: "Nama Barang", key: "item_name" },
                { label: "Jumlah Awal", key: "initial_qty" },
                { label: "Jumlah Akhir", key: "updated_qty" },
                { label: "Harga Satuan", key: "price" },
                { label: "Harga Total", key: "total_price" },
                { label: "ID Penjualan", key: "order_id" },
                { label: "ID Pembelian", key: "purchase_id" },
                { label: "Tipe", key: "type" },
                { label: "Tanggal", key: "updated_at" }
            ]);

            const reportReq = await fetch('/api/item/print', {
                method: 'POST',
                body: JSON.stringify({
                    start : fields.start,
                    end: fields.end
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .catch((error) => {
                console.log(error)
            });
            if(!reportReq.ok) return setStatus('error' + reportReq.status);
    
            const reports = await reportReq.json();
            
            setData(reports.data);
        }
        else if(fields.type == 'gp') {
            setData([]);
        }

    }

    return(

    <div className="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-white dark:bg-gray-700 text-black dark:text-white">
    
        <Nav />
        
        <Sidebar />
        
        <div className="h-full ml-14 mt-14 md:ml-64">

            <div className="flex justify-between w-full px-4 mt-4">
                <h6 className="text-gray-400 text-sm font-bold uppercase">
                    Laporan Bulanan
                </h6>
            </div>

            <div className="mt-2 mx-4">

                <form>
                    
                    <div className="flex items-center my-8">
                        <span className="mx-4 text-gray-500 w-1/12">Document</span>
                        <select onChange={fieldHandler.bind(this)} name="type" id="type" className="bg-gray-100 p-2 rounded-md">
                            <option value='stock'>Stock</option>
                            {/* <option value='gp'>Gross Profit</option> */}
                        </select>
                    </div>
                    
                    <div className="flex items-center">
                        <span className="mx-4 text-gray-500 w-1/12">Date</span>
                        <div className="flex items-center">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
                                </div>
                                <input defaultValue={strThisPeriod} onChange={fieldHandler.bind(this)} name="start" type="date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date start"/>
                            </div>
                            <span className="mx-4 text-gray-500">to</span>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
                                </div>
                                <input defaultValue={strToday} onChange={fieldHandler.bind(this)} name="end" type="date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date end"/>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center m-4 mt-8 w-fit">
                        <CSVLink className="px-8 bg-sky-700 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded" data={data} headers={headers} filename={('laporan-' + fields.end +'.csv')}>Export data</CSVLink>
                    </div>

                </form>

            </div>

        </div>
        
    </div>

    );

}