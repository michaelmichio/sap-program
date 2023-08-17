import { useState } from "react";
import Router from "next/router";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

import { authPage } from "@/middlewares/authorizationPage";
import Nav from "@/components/Nav";
import Sidebar from "@/components/Sidebar";
import CreateCustomerModal from "@/components/CreateCustomerModal";
import UpdateCustomerModal from "@/components/UpdateCustomerModal";

export async function getServerSideProps(ctx) {
  const { token } = await authPage(ctx);

  const customerReq = await fetch('http://localhost:3000/api/customer', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
  .catch((error) => {
    console.log(error)
  });
  
  const customers = await customerReq.json();
  
  return {
    props: {
      token,
      customers: customers.data
    }
  }
}

export default function CustomerIndex(props) {

  const notifyInfo = (msg) => toast.info(msg, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    }
  );

  const { token } = props;

  const { customers } = props;

  const [createModal, setVisibleCreate] = useState(false);
  const [updateModal, setVisibleUpdate] = useState(false);
  const [customerData, setCustomerData] = useState();

  async function deleteHandler(id, e) {
    e.preventDefault();
    Swal.fire({
      title: 'Hapus data',
      html: `<input autoComplete="new-password" type="password" id="password" class="swal2-input" placeholder="Admin key">`,
      confirmButtonText: 'Hapus',
      focusConfirm: false,
      preConfirm: () => {
        const password = Swal.getPopup().querySelector('#password').value
        if (!password) {
          Swal.showValidationMessage(`Invalid admin key`)
        }
        return { password: password }
      }
    }).then((result) => {
      try {
        adminKey(id, result.value.password);
      } catch {}
    })
  }

  async function adminKey(id, key) {
    const keyCheck = await fetch('/api/adminkey', {
      method: 'POST',
      body: JSON.stringify({
        key: key
      }),
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    })
    .catch((error) => {
      console.log(error)
    });
    if(!keyCheck.ok) return Swal.fire(
      'Admin key salah!',
      'Data gagal dihapus.',
      'error'
    );
    deleteCustomer(id);
  }

  
  async function deleteCustomer(id) {
    const deleteCustomer = await fetch('/api/customer/delete/' + id, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .catch((error) => {
      console.log(error)
    });
    Router.replace('/customer');
    Swal.fire(
      'Terhapus!',
      'Data berhasil dihapus.',
      'success'
    )
  }

  const [page, setPage] = useState('0');
  const [itemPerPage, setItemPerPage] = useState('7');
  const [itemLength, setItemLength] = useState(customers.length);
  const [limit, setLimit] = useState(itemLength/itemPerPage);

  // search handler
  const [searchItem, setSearchItem] = useState('');
  function searchItemHandler(e) {
    setSearchItem(e.target.value);
  }
  
  return (

    <div className="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-white dark:bg-gray-700 text-black dark:text-white">
      
      <ToastContainer />

      <Nav />
      
      <Sidebar />

      <div className="h-full ml-14 mt-14 md:ml-64">

        <div className="flex justify-between w-full px-4 mt-4">

          <div className="w-1/2 box flex flex-col justify-center">
              <div className="box-wrapper">
                  <div className=" bg-white rounded flex items-center w-full p-3 shadow-sm border border-gray-200">
                    <button className="outline-none focus:outline-none"><svg className=" w-5 text-gray-600 h-5 cursor-pointer" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></button>
                    <input autoComplete="off" onChange={searchItemHandler.bind(this)} type="search" name="" id="" placeholder="search for customers" x-model="q" className="w-full pl-4 text-sm outline-none focus:outline-none bg-transparent"/>
                    {/* <div className="select">
                      <select name="" id="" x-model="image_type" className="text-sm outline-none focus:outline-none bg-transparent">
                        <option value="all" selected>All</option>
                        <option value="photo">Photo</option>
                        <option value="illustration">Illustration</option>
                        <option value="vector">Vector</option>
                        </select>
                    </div> */}
                  </div>
              </div>
          </div>

          <div className="flex flex-col justify-center ml-4 mr-4">
            <button onClick={() => setVisibleCreate(true)} type="button" className="bg-sky-700 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded">
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
                    <th className="w-1/6 truncate ... px-4 py-3">ID Customer</th>
                    <th className="w-1/6 truncate ... px-4 py-3">Nama</th>
                    <th className="w-1/6 truncate ... px-4 py-3">Alamat</th>
                    <th className="w-1/6 truncate ... px-4 py-3">Telepon</th>
                    <th className="w-1/6 truncate ... px-4 py-3">Tanggal Daftar</th>
                    <th className="truncate ... px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                  { props.customers?.filter(customer => {
                    const filterId = searchItem.toLowerCase();
                    const fullId = customer.id.toLowerCase();
                    const fullName = customer.name.toLowerCase();

                    if(filterId == '') {
                      return fullId;
                    }
                    else {
                      return searchItem && fullId.includes(filterId) || searchItem && fullName.includes(filterId);
                    }
                  })
                  .slice(page*itemPerPage, (page+1)*itemPerPage).map((customer, i) => (
                      <tr key={ customer.id } className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400">
                        <td className="w-1/12 truncate ... px-4 py-3 text-sm">{(itemPerPage*page)+(i+1)}</td>
                        <td className="w-1/6 truncate ... px-4 py-3 text-sm">{ customer.id }</td>
                        <td className="w-1/6 truncate ... px-4 py-3 text-sm">{ customer.name }</td>
                        <td className="w-1/6 truncate ... px-4 py-3 text-sm">{ customer.address }</td>
                        <td className="w-1/6 truncate ... px-4 py-3 text-sm">{ customer.phone }</td>
                        <td className="w-1/6 truncate ... px-4 py-3 text-sm">{ customer.created_at.substring(0, 10) }</td>
                        <td className="px-4 py-3 text-sm flex justify-end">
                          <button onClick={() => {setVisibleUpdate(true); setCustomerData(customer)}} type="button" className="mr-4 px-3 py-2 text-xs font-medium text-center text-white bg-gray-300 rounded-md hover:bg-sky-700 focus:outline-none dark:bg-gray-100 dark:hover:bg-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon></svg>
                          </button>
                          <button onClick={deleteHandler.bind(this, customer.id)} type="button" className="px-3 py-2 text-xs font-medium text-center text-white bg-gray-300 rounded-md hover:bg-red-400 focus:outline-none dark:bg-gray-100 dark:hover:bg-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>

            <div className="flex flex-col px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
              <div className="flex flex-row justify-end">
                <span className="flex text-xs xs:text-sm text-gray-500 normal-case text-center">
                    Showing {itemPerPage*page+1} to {((page+1)*itemPerPage > itemLength) ? itemLength : (page+1)*itemPerPage} of {itemLength} Entries
                </span>
              </div>
              <div className="flex flex-row justify-end mt-1">
                <div className="flex xs:mt-0">
                    <button
                      onClick={() => (page > 0) ? setPage(page*1-1*1) : ''}
                      className="text-sm bg-gray-300 hover:bg-sky-700 text-white hover:text-white font-semibold py-2 px-4 rounded-l">
                      Prev
                    </button>
                    <button
                      onClick={() => (page < limit-1) ? setPage(page*1+1*1) : ''}
                      className="text-sm bg-gray-300 hover:bg-sky-700 text-white hover:text-white font-semibold py-2 px-4 rounded-r">
                      Next
                    </button>
                </div>
              </div>
            </div>
            
          </div>
        </div>
        
      </div>

      <CreateCustomerModal isVisible={createModal} onClose={() => setVisibleCreate(false)} />

      <UpdateCustomerModal isVisible={updateModal} onClose={() => setVisibleUpdate(false)} notifyInfo={(msg) => notifyInfo(msg)} customerData={customerData} />

    </div>
        
  );

}