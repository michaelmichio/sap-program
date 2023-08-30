// import Head from 'next/head'
// import Image from 'next/image'
// import { Inter } from '@next/font/google'
// import styles from '@/styles/Home.module.css'
import { getCookies } from "cookies-next";

// const inter = Inter({ subsets: ['latin'] })

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
        redirect: {
            destination: "/auth/login",
            permanent: false,
        },
    };
}

export default function Home() {
    return null;
}
