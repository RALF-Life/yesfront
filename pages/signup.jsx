'use client'
import React, { useState } from "react";
import signUp from "../firebase/auth/signup";
import { useRouter } from 'next/navigation'
import Link from "next/link";
import Head from "next/head";

function Page() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleForm = async (event) => {
        event.preventDefault()

        const { error } = await signUp(email, password);
        if (error) {
            return setError(error.message)
        }

        return router.push("/dash")
    }
    return (
        <div className="bg-black h-screen flex justify-center items-center">
            <Head>
                <title>Ralf</title>
                <meta name="description" content="RALF Landing page" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div id="top-navigation" className="ml-5 mt-3 flex items-center absolute top-0 left-0 right-0">
                <p id="logo"
                    className="mr-6 font-black bg-cover text-4xl text-transparent bg-clip-text bg-gradient-to-r from-RALF-gradient-start to-RALF-gradient-end">RALF</p>
                <div className="flex space-x-6 items-center">
                    <Link href="/imprint" className="text-footer-color font-semibold">Imprint</Link>
                    <Link href="https://ralf-p.medium.com/" className="text-footer-color font-semibold">Blog</Link>
                </div>
            </div>

            <div className="w-full flex-col justify-center items-center max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
                <form className="space-y-6" action="#" onSubmit={handleForm}>
                    <div id="welcome-text" className="text-center mb-6">
                        <p className="font-black bg-cover text-4xl text-transparent bg-clip-text bg-gradient-to-r from-RALF-gradient-start to-RALF-gradient-end">RALF</p>
                        <p className="text-white font-bold">Create your account! 😊</p>
                    </div>

                    {error && <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-900 dark:text-red-400" role="alert">
                        <span class="font-medium">Cannot Register:</span> {error}
                    </div>}

                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            name="email"
                            id="email"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            placeholder="name@ralf.life"
                            required />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            name="password"
                            id="password"
                            placeholder="••••••••"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            required />
                    </div>
                    <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login to your account</button>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                        Already registered? <Link href="/" className="text-blue-700 hover:underline dark:text-blue-500">Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Page;
