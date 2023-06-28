import Head from "next/head";
import Link from "next/link";
import { useAuthContext } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { ETBaseURL } from "./Var";

export default function NavBar() {
    const { user } = useAuthContext()
    const [info, setInfo] = useState({})

    useEffect(() => {
        const controller = new AbortController()
        const interval = setInterval(() => {
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
        }, 1000)
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
            <p id="logo"
                className="mr-6 font-black bg-cover text-4xl text-transparent bg-clip-text bg-gradient-to-r from-RALF-gradient-start to-RALF-gradient-end">
                RALF
            </p>
            <div className="flex space-x-6 items-center">
                {info
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
                <Link href="/dash"
                    className="bg-white rounded-lg px-5 py-1 font-semibold text-center">{user?.email}
                </Link>
            </div>
        </div>
    </div>
}