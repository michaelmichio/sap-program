import Link from 'next/link';

export default function Sidebar() {

    return (
    <>
    
    <div className="fixed flex flex-col top-14 left-0 w-14 hover:w-64 md:w-64 bg-sky-900 dark:bg-gray-900 h-full text-white transition-all duration-300 border-none z-10 sidebar">
        <div className="overflow-y-auto overflow-x-hidden flex flex-col justify-between flex-grow">
            <ul className="flex flex-col py-4 space-y-1">
                <li className="px-5 hidden md:block">
                    <div className="flex flex-row items-center h-8">
                        <div className="text-sm font-light tracking-wide text-gray-400 uppercase">Halaman</div>
                    </div>
                </li>
                <li>
                    <Link href="/dashboard" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-sky-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-sky-500 dark:hover:border-gray-800 pr-6">
                        <span className="inline-flex justify-center items-center ml-4">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        </span>
                        <span className="ml-2 text-sm tracking-wide truncate">Dashboard</span>
                    </Link>
                </li>
                <li>
                    <Link href="/customer" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-sky-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-sky-500 dark:hover:border-gray-800 pr-6">
                        <span className="inline-flex justify-center items-center ml-4">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" cx="9" cy="7" r="4"></circle><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            
                        </span>
                        <span className="ml-2 text-sm tracking-wide truncate">Customer</span>
                    </Link>
                </li>
                <li>
                    <Link href="/stock" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-sky-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-sky-500 dark:hover:border-gray-800 pr-6">
                        <span className="inline-flex justify-center items-center ml-4">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                        </span>
                        <span className="ml-2 text-sm tracking-wide truncate">Stock</span>
                    </Link>
                </li>
                <li>
                    <Link href="/purchase" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-sky-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-sky-500 dark:hover:border-gray-800 pr-6">
                        <span className="inline-flex justify-center items-center ml-4">
                            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="20.5" r="1"/><circle cx="18" cy="20.5" r="1"/><path d="M2.5 2.5h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6l1.6-8.4H7.1"/></svg>
                        </span>
                        <span className="ml-2 text-sm tracking-wide truncate">Purchase</span>
                    </Link>
                </li>
                <li>
                    <Link href="/report" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-sky-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-sky-500 dark:hover:border-gray-800 pr-6">
                        <span className="inline-flex justify-center items-center ml-4">
                            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 3v5h5M16 13H8M16 17H8M10 9H8"/></svg>
                        </span>
                        <span className="ml-2 text-sm tracking-wide truncate">Report</span>
                    </Link>
                </li>
                {/* <li>
                    <Link href="/stock" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6">
                        <span className="inline-flex justify-center items-center ml-4">
                            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                        </span>
                        <span className="ml-2 text-sm tracking-wide truncate">Entry</span>
                    </Link>
                </li>
                <li className="px-5 hidden md:block">
                    <div className="flex flex-row items-center mt-5 h-8">
                        <div className="text-sm font-light tracking-wide text-gray-400 uppercase">Settings</div>
                    </div>
                </li>
                <li>
                    <a href="#" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6">
                        <span className="inline-flex justify-center items-center ml-4">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        </span>
                        <span className="ml-2 text-sm tracking-wide truncate">Profile</span>
                    </a>
                </li> */}
            </ul>
            <p className="mb-14 px-5 py-3 hidden md:block text-center text-xs">Copyright @2023</p>
        </div>
    </div>

    </>
    );

}