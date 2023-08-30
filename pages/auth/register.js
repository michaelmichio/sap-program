import { useState } from "react";
import Link from "next/link";
import Router from "next/router";
import { getCookies } from "cookies-next";

export const getServerSideProps = async (context) => {
    const cookies = getCookies(context);

    if (cookies.token) {
        return {
            redirect: {
                destination: "/dashboard",
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
}

export default function Register() {
    const [registrationStatus, setRegistrationStatus] = useState("");
    const [registrationData, setRegistrationData] = useState({
        username: "",
        password: "",
        name: "",
        adminkey: "",
    });
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRegistrationData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    
    const handleRegistration = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(registrationData),
            });
            
            const responseData = await response.json();
            
            if (!responseData.error) { // #
                // Registration successful, handle redirection or display a success message
                Router.push("/auth/login");
            } else {
                // Handle error case
                setRegistrationStatus(responseData.error);
            }
        } catch (error) {
            // Handle error case
            console.error('Error during registration:', error);
        }
    };
    
    return (
        <section className="font-mono flex flex-col md:flex-row h-screen items-center">
            <div className="bg-sky-800 hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
                {/* <img src="https://source.unsplash.com/random" alt="" className="w-full h-full object-cover"/> */}
            </div>
            <div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:mx-0 md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
                <div className="w-full h-100">
                    <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">
                        Register an account
                    </h1>
                    <form className="mt-6" onSubmit={handleRegistration}>
                        <div>
                            <label className="block text-gray-700">
                                Username
                            </label>
                            <input
                            className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                            type="text"
                            name="username"
                            minLength={4}
                            maxLength={18}
                            placeholder="Enter Username"
                            value={registrationData.username}
                            onChange={handleInputChange}
                            autoFocus
                            autoComplete="off"
                            required
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700">
                                Password
                            </label>
                            <input
                            className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                            type="password"
                            name="password"
                            minLength={6}
                            maxLength={18}
                            placeholder="Enter Password"
                            value={registrationData.password}
                            onChange={handleInputChange}
                            autoComplete="new-password"
                            required
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700">
                                Name
                            </label>
                            <input
                            className=" w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                            type="text"
                            name="name"
                            minLength={3}
                            maxLength={18}
                            placeholder="Enter Name"
                            value={registrationData.name}
                            onChange={handleInputChange}
                            autoComplete="off"
                            required
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700">
                                Admin Key
                            </label>
                            <input
                            className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                            type="password"
                            name="adminkey"
                            placeholder="Enter Admin Key"
                            value={registrationData.adminkey}
                            onChange={handleInputChange}
                            autoComplete="off"
                            required
                            />
                        </div>
                        <div className="text-center text-red-500 mt-6">
                            {registrationStatus ? registrationStatus : <br />}
                        </div>
                        <button
                        className="w-full block bg-sky-700 hover:bg-sky-600 focus:bg-sky-600 text-white font-semibold rounded-lg px-4 py-3 mt-6"
                        type="submit"
                        >
                            Register
                        </button>
                    </form>
                    <hr className="my-6 border-gray-300 w-full"/>
                    <p className="mt-8">
                        <Link href="/auth/login" className="text-sky-600 hover:text-sky-700 font-semibold">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
}
