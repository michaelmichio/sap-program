import { deleteCookie } from "cookies-next";
import Router from "next/router";

export default function Navbar() {

    function logoutHandler(e) {
        e.preventDefault();

        deleteCookie("token");
        Router.push("/auth/login");
        // Router.replace("/auth/login");
    }

    return (
        <>
        <div className="fixed w-full flex items-center justify-start h-14 text-white z-10">
            <div className="flex items-center justify-start md:justify-center pl-3 w-14 md:w-64 h-14 bg-sky-800 dark:bg-gray-800 border-none">
                <span className="hidden md:block">PT. RADITA AUTOPRIMA</span>
            </div>
            <div className="flex justify-end items-center h-14 bg-sky-800 dark:bg-gray-800 header-right">
                <ul className="flex items-center">
                    <li>
                        <div className="block w-px h-6 mx-3 bg-gray-400 dark:bg-gray-700"></div>
                    </li>
                    <li>
                        <a href="#" onClick={logoutHandler.bind(this)} className="flex items-center mr-4 hover:text-blue-100">
                            <span className="inline-flex mr-1">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                            </span>
                            Logout
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        </>
    );
}
