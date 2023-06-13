import Head from 'next/head'
import Link from 'next/link'
import React, { useState, useEffect } from 'react';
import { useAuthContext } from "../context/AuthContext";
import { useRouter } from "next/router";
import Flow from '../components/Flow';
import { ETBaseURL } from '../components/Var';
import { getAuth, signOut } from 'firebase/auth';

export default function Dash() {
    const [flows, setFlows] = useState([]);
    const [token, setToken] = useState(null);

    const { user } = useAuthContext()
    const router = useRouter()

    React.useEffect(() => {
        if (user == null) {
            router.push("/")
            return
        }

        user.getIdToken().then((token) => {
            setToken(token)

            fetch(ETBaseURL + '/flows', {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
                .then((response) => response.json())
                .then((data) => setFlows(data || []))
        })
    }, []);

    function handleLogout() {
        const auth = getAuth()
        signOut(auth).then(() => router.push("/"))
    }

    return (
        <>
            <div className="h-screen">
                <div className='mb-10'>
                    <Head>
                        <title>Ralf</title>
                        <meta name="description" content="RALF Flow creation" />
                        <link rel="icon" href="/favicon.ico" />
                    </Head>

                    <div id="top-navigation" className="ml-5 mt-3 flex items-center">
                        <p id="logo"
                            className="mr-6 font-black bg-cover text-4xl text-transparent bg-clip-text bg-gradient-to-r from-RALF-gradient-start to-RALF-gradient-end">RALF</p>
                        <div className="flex space-x-6 items-center">
                            <Link href="/imprint" className="text-footer-color font-semibold">Imprint</Link>
                            <Link href="https://ralf-p.medium.com/" className="text-footer-color font-semibold">Blog</Link>
                        </div>
                        <div className="ml-auto flex items-center mr-10">
                            <button
                                className="bg-white rounded-lg px-5 py-1 font-semibold text-center">{user?.email}
                            </button>
                        </div>
                    </div>
                </div>

                <div className='w-screen text-center'>
                    <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                        <span className="underline underline-offset-3 decoration-8 decoration-blue-400 dark:decoration-blue-600">{user?.displayName || user?.email}</span>&apos;s Dashboard
                    </h1>
                    <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">Manage your Flows or Create New!</p>
                    <Link href="/new/wizard" className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
                        Create New Flow
                        <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    </Link>
                    <button
                        onClick={handleLogout}
                        href="/new/wizard" className="ml-4 inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900">
                        Logout
                    </button>
                </div>

                <div className="flex items-center justify-center text-white mt-10">
                    {flows.length > 0
                        ? flows.map((flow, index) => (
                            <div key={index} className='mr-4'>
                                <Flow flow={flow} token={token} />
                            </div>
                        ))
                        : <span className='text-red-400'>No flow found</span>
                    }
                </div>
            </div>
        </>
    )
}
