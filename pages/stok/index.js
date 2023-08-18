// import { useEffect, useState } from "react";
import { getCookies } from "cookies-next";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export const getServerSideProps = async (context) => {
    const cookies = getCookies(context);

    if (!cookies.token) {
        return {
            redirect: {
                destination: "/auth/login",
                permanent: false,
            },
        };
    }

    return {
        props: {}
    };
}

export default function Stok() {
    return (
        <>
            <Navbar />
            <Sidebar />
        </>
    )
}