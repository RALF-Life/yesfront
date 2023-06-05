'use client'
import React from "react";
import signIn from "../firebase/auth/signin";
import { useRouter } from 'next/navigation'
import Link from "next/link";

function Page() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const router = useRouter()

    const handleForm = async (event) => {
        event.preventDefault()

        const { result, error } = await signIn(email, password);

        if (error) {
            return console.log(error)
        }

        // else successful
        console.log(result)
        return router.push("/flows")
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
                <div className="ml-auto flex items-center mr-10">
                    <Link href="/signup" className="bg-white rounded-lg px-5 py-1 font-semibold text-center">Sign
                        Up</Link>
                </div>
            </div>

            <div
                className="w-auto m-auto bg-[#0B0B0B] flex flex-col justify-center items-center border-[#404040] rounded-lg border-2 p-6"
                id="login-center-box">
                <div id="welcome-text" className="text-center mb-6">
                    <p className="font-black bg-cover text-4xl text-transparent bg-clip-text bg-gradient-to-r from-RALF-gradient-start to-RALF-gradient-end">RALF</p>
                    <p className="text-white font-bold">Welcome back! 😊</p>
                </div>
                <div className="">
                    <form onSubmit={handleForm} className="flex flex-col items-center">
                        <input
                               onChange={(e) => setEmail(e.target.value)} required type="email" name="email" id="email" placeholder="example@mail.com"
                               className="text-footer-color rounded-lg mb-2 w-full h-10 bg-[#0B0B0B] border-2 border-[#404040]"
                               />
                        <div className="flex w-auto">
                            <input onChange={(e) => setPassword(e.target.value)} required type="password" name="password" id="password" placeholder="password"
                                   className="text-footer-color rounded-lg mr-2 w-full h-10 bg-[#0B0B0B] border-2 border-[#404040]"
                                   />
                            <button type="submit"
                                    className=" text-black font-semibold px-4 py-2 rounded-lg bg-[#50FFD5] h-10">Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
    </div>
    );
}

export default Page;