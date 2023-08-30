import { useState } from "react";
import Link from "next/link";
import Router from "next/router";
import { getCookies, setCookie } from "cookies-next";

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

export default function Login() {
    const [loginStatus, setLoginStatus] = useState("");
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            [name]: value,
        }));
    };
    
    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });
            
            const responseData = await response.json();
            
            if (!responseData.error) { // #
                // Set cookies for the client
                setCookie("token", responseData.token);
                
                // Redirect to dashboard
                Router.push("/dashboard");
            } else {
                // Handle error case
                setLoginStatus(responseData.error);
            }
        } catch (error) {
            // Handle error case
            console.error('Error during login:', error);
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
                        Log in to your account
                    </h1>
                    <form className="mt-6" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-gray-700">Username</label>
                            <input
                            className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                            type="text"
                            name="username"
                            placeholder="Enter Username"
                            value={credentials.username}
                            onChange={handleInputChange}
                            autoFocus
                            pattern="^[a-zA-Z0-9]{4,18}$"
                            title="Username must be alphanumeric and between 4 to 18 characters."
                            required
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700">Password</label>
                            <input
                            className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                            type="password"
                            name="password"
                            placeholder="Enter Password"
                            value={credentials.password}
                            onChange={handleInputChange}
                            pattern=".{6,18}"
                            title="Password must be between 6 to 18 characters."
                            required
                            />
                        </div>
                        <div className="text-center text-red-500 mt-6">
                            {loginStatus ? loginStatus : <br />}
                        </div>
                        <button
                            type="submit"
                            className="w-full block bg-sky-700 hover:bg-sky-600 focus:bg-sky-600 text-white font-semibold rounded-lg px-4 py-3 mt-6"
                        >
                            Log In
                        </button>
                    </form>
                    <hr className="my-6 border-gray-300 w-full" />
                    <p className="mt-8">
                        <Link href="/auth/register" className="text-sky-600 hover:text-sky-700 font-semibold">
                            Register an account
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
}
