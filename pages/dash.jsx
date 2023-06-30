import Link from 'next/link'
import React, { useState, useEffect } from 'react';
import { useAuthContext } from "../context/AuthContext";
import { useRouter } from "next/router";
import Flow from '../components/Flow';
import { ETBaseURL } from '../components/Var';
import { getAuth, signOut } from 'firebase/auth';
import NavBar from '../components/NavBar';

export default function Dash() {
    const [flows, setFlows] = useState([])
    const [token, setToken] = useState(null)

    const { user } = useAuthContext()
    const router = useRouter()

    useEffect(() => {
        if (user == null) {
            router.push("/")
            return
        }

        const controller = new AbortController()
        user.getIdToken().then((token) => {
            setToken(token)

            fetch(ETBaseURL + '/flows', {
                signal: controller.signal,
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
                .then((response) => response.json())
                .then((data) => setFlows(data || []))
                .catch((err) => console.error(err))
        })

        return () => controller.abort()
    }, []);

    function handleLogout() {
        const auth = getAuth()
        signOut(auth).then(() => router.push("/"))
    }

    return (
        <>
            <NavBar />

            <div className='w-screen text-center'>
                <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                    <span className="underline underline-offset-3 decoration-8 decoration-blue-400 dark:decoration-blue-600">{user?.displayName || user?.email}</span>&apos;s Dashboard
                </h1>
                <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">Manage your Flows or Create New!</p>
                <Link href="/new/wizard" className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
                    Create New Flow
                    <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
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
        </>
    )
}
