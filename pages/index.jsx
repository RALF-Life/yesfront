'use client'
import React, { useState } from "react";
import signIn from "../firebase/auth/signin";
import { useRouter } from 'next/navigation'
import Link from "next/link";

function Page() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleForm = async (event) => {
        event.preventDefault()

        const { error } = await signIn(email, password);
        if (error) {
            return setError(error.message)
        }

        return router.push("/dash")
    }

    return (
        <div className="bg-black h-screen flex justify-center items-center">
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
                        <p className="text-white font-bold">Welcome back! 😊</p>
                    </div>

                    {error && <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-900 dark:text-red-400" role="alert">
                        <span className="font-medium">Cannot Login:</span> {error}
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
                        Not registered? <Link href="/signup" className="text-blue-700 hover:underline dark:text-blue-500">Create Account</Link>
                    </div>
                </form>
            </div>

            <div id="marketing-banner" tabIndex="-1" className="fixed z-50 flex flex-col md:flex-row justify-between w-[calc(100%-2rem)] p-4 -translate-x-1/2 bg-white border border-gray-100 rounded-lg shadow-sm lg:max-w-7xl left-1/2 bottom-6 dark:bg-gray-700 dark:border-gray-600">
                <div className="flex flex-col items-start mb-3 mr-4 md:items-center md:flex-row md:mb-0">
                    <a href="https://github.com/darmiel/today" className="flex items-center mb-2 border-gray-200 md:pr-4 md:mr-4 md:border-r md:mb-0 dark:border-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="256" cy="256" r="256" fill="#0589FC" />
                            <circle cx="146" cy="256" r="65" fill="white" />
                            <circle cx="279" cy="256" r="38" fill="white" />
                            <rect x="347" y="191" width="59" height="130" fill="white" />
                        </svg>
                        <span className="self-center text-lg font-semibold whitespace-nowrap dark:text-white">today</span>
                    </a>
                    <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
                        <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">NEW</span>
                        Official RALF Companion for the CLI ✨
                    </p>
                </div>
                <div className="flex items-center flex-shrink-0">
                    <a
                        href="https://github.com/darmiel/today/releases"
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-2 mr-2 text-xs font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        Get it Now
                    </a>
                </div>
            </div>

        </div>
    );
}

export default Page;
