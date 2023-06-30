import Head from "next/head";
import Link from "next/link";
import { useAuthContext } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { ETBaseURL } from "./Var";

export default function NavBar() {
    const { user } = useAuthContext()
    const [info, setInfo] = useState({ loading: true })

    useEffect(() => {
        const controller = new AbortController()

        const check = () => {
            fetch(ETBaseURL + "/icanhazralf", { signal: controller.signal })
                .then((response) => {
                    if (response.ok) {
                        response.json().then((data) => setInfo(data))
                    } else {
                        setInfo({})
                    }
                })
                .catch((err) => {
                    setInfo(null)
                    console.error(err)
                })
        }
        check()
        const interval = setInterval(check, 1000)
        return () => {
            clearInterval(interval)
            controller.abort()
        }
    }, [])

    return <div className="mb-10">
        <Head>
            <title>RALF</title>
            <meta name="description" content="RALF Flow creation" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <div id="top-navigation" className="ml-5 mt-3 flex items-center">
            <Link href="/">
                <p id="logo"
                    className="mr-6 font-black bg-cover text-4xl text-transparent bg-clip-text bg-gradient-to-r from-RALF-gradient-start to-RALF-gradient-end">
                    RALF
                </p>
            </Link>
            <div className="flex space-x-6 items-center">
                {info?.loading
                    ? <div className="bg-orange-400 px-3 py-1 rounded-md">
                        Backend: Connecting...
                    </div>
                    : info
                        ? <div className="bg-green-400 px-3 py-1 rounded-md">
                            Backend: {info?.version} | #{info?.commit?.substring(0, 8)}
                        </div>
                        : <div className="bg-red-400 px-3 py-1 rounded-md">
                            Backend unavailable
                        </div>
                }
                <Link href="/imprint" className="text-footer-color font-semibold">Imprint</Link>
                <Link href="https://ralf-p.medium.com/" className="text-footer-color font-semibold">Blog</Link>
            </div>
            <div className="ml-auto flex items-center mr-10">
                {user
                    ? <Link href="/dash" className="bg-slate-700 text-slate-100 rounded-lg px-3 py-2 text-center">
                        <div className="flex flex-row justify-center items-center ">
                            <img
                                className="h-6 mr-2 rounded-full"
                                alt="Avatar"
                                src={`https://api.dicebear.com/6.x/bottts-neutral/svg?seed=${btoa(user?.email)}`}
                            />
                            <span>
                                {user?.email}
                            </span>
                        </div>
                    </Link>
                    : <Link href="/" className="bg-blue-700 text-slate-100 rounded-lg px-3 py-2 text-center">
                        <div className="flex flex-row justify-center items-center ">
                            Login to RALF 🤩
                        </div>
                    </Link>
                }
            </div>
        </div>
    </div>
}
