import React, { useState } from 'react';
import Cookie from 'js-cookie';
import Router from 'next/router';
import Link from 'next/link';

import { unauthPage } from '@/middlewares/authorizationPage';

export async function getServerSideProps(ctx) {
    await unauthPage(ctx);
    return { props: {} }
}

export default function Login() {

    const [loginStatus, setLoginStatus] = useState('');

    async function loginHandler(e) {
        e.preventDefault();
        const loginReq = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fields)
        })
        .catch((error) => {
            console.log(error)
        });
        if(!loginReq.ok) return setLoginStatus('Pengguna tidak ditemukan');
        const loginRes = await loginReq.json();
        Cookie.set('token', loginRes.token);
        Cookie.set('username', loginRes.userData.name);
        Router.replace('/dashboard');
    }

    const [fields, setFields] = useState({
        username: '',
        password: ''
    });

    function fieldHandler(e) {
        const name = e.target.getAttribute('name');
        setFields({
            ...fields,
            [name]: e.target.value
        });
    }

    return(
    
        <section className="flex flex-col md:flex-row h-screen items-center">
            <div className="bg-sky-800 hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
                {/* <img src="https://source.unsplash.com/random" alt="" className="w-full h-full object-cover"/> */}
            </div>
            <div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:mx-0 md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
                <div className="w-full h-100">
                    <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">Log in to your account</h1>
                    <form className="mt-6" onSubmit={loginHandler.bind(this)}>
                        <div>
                            <label className="block text-gray-700">Username</label>
                            <input onChange={fieldHandler.bind(this)} type="text" name="username" placeholder="Enter Username" className="lowercase w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" autoFocus autoComplete="true" required/>
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700">Password</label>
                            <input onChange={fieldHandler.bind(this)} type="password" name="password" placeholder="Enter Password" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" required/>
                        </div>
                        <div className="text-center text-red-500 mt-6">
                            {(loginStatus == '') ? <br/> : loginStatus }
                        </div>
                        {/* <div className="text-right mt-2">
                            <a href="#" className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700">Forgot Password?</a>
                        </div> */}
                        <button type="submit" className="w-full block bg-sky-700 hover:bg-sky-600 focus:bg-sky-600 text-white font-semibold rounded-lg px-4 py-3 mt-6">Log In</button>
                    </form>
                    <hr className="my-6 border-gray-300 w-full"/>
                    <p className="mt-8"><Link href="/auth/register" className="text-sky-600 hover:text-sky-700 font-semibold">Register an account</Link></p>
                </div>
            </div>
        </section>

    );

}