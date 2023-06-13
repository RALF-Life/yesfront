'use client'
import React from "react";
import signUp from "../firebase/auth/signup";
import { useRouter } from 'next/navigation'
import Link from "next/link";
import Head from "next/head";

function Page() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const router = useRouter()

    const handleForm = async (event) => {
        event.preventDefault()

        const { result, error } = await signUp(email, password);

        if (error) {
            return console.log(error)
        }

        // else successful
        console.log(result)
        return router.push("/flows")
    }
    return (
        <div className="bg-black h-screen flex justify-center items-center">
            <Head>
                <title>Ralf</title>
                <meta name="description" content="RALF Landing page"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <div id="top-navigation" className="ml-5 mt-3 flex items-center absolute top-0 left-0 right-0">
                <p id="logo"
                   className="mr-6 font-black bg-cover text-4xl text-transparent bg-clip-text bg-gradient-to-r from-RALF-gradient-start to-RALF-gradient-end">RALF</p>
                <div className="flex space-x-6 items-center">
                    <Link href="/imprint" className="text-footer-color font-semibold">Imprint</Link>
                    <Link href="https://ralf-p.medium.com/" className="text-footer-color font-semibold">Blog</Link>
                </div>
                <div className="ml-auto flex items-center mr-10">
                    <Link href="/" className="bg-white rounded-lg px-5 py-1 font-semibold text-center">Login</Link>
                </div>
            </div>

            <div
                className="w-auto m-auto bg-[#0B0B0B] flex flex-col justify-center items-center border-[#404040] rounded-lg border-2 p-6"
                id="login-center-box">
                <div id="welcome-text" className="text-center mb-6">
                    <p className="font-black bg-cover text-4xl text-transparent bg-clip-text bg-gradient-to-r from-RALF-gradient-start to-RALF-gradient-end">RALF</p>
                    <p className="text-white font-bold">Create your account! 😊</p>
                </div>
                <div className="">
                    <form onSubmit={handleForm} className="form flex flex-col items-center">
                        <input type="email" id="email" placeholder="    Email" name="email"
                               className="text-footer-color rounded-lg mb-2 w-full h-10 bg-[#0B0B0B] border-2 border-[#404040]"
                               onChange={(e) => setEmail(e.target.value)}
                               required/>
                        <input type="password" id="password" placeholder="    Password" name="password"
                               className="text-footer-color rounded-lg mb-2 w-full h-10 bg-[#0B0B0B] border-2 border-[#404040]"
                               onChange={(e) => setPassword(e.target.value)}
                               required/>
                        <div className="flex w-auto">
                            <button type="submit"
                                    className=" text-black font-semibold px-8 py-2 rounded-lg bg-[#50FFD5] h-10">
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Page;
