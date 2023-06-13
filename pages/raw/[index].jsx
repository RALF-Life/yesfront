import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { ETBaseURL } from "../../components/Var";
import Head from "next/head";
import Link from "next/link";
import { getAuth, signOut } from "firebase/auth";

export default function Raw() {
    const router = useRouter()
    const { user } = useAuthContext()

    const flowID = router.query.index

    const [flow, setFlow] = useState(null);
    const [content, setContent] = useState('')
    const [error, setError] = useState('')
    const [source, setSource] = useState('')

    useEffect(() => {
        if (user == null) {
            router.push("/")
            return
        }

        user.getIdToken().then((token) => {
            fetch(ETBaseURL + '/' + flowID + ".json", {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    setFlow(data)
                    setSource(data['source'])
                    setContent(JSON.stringify(data['flows'], null, 4))
                })
        })
    }, []);

    function save() {
        flow['flows'] = JSON.parse(content)
        flow['source'] = source

        user.getIdToken().then((token) => {
            fetch(ETBaseURL + '/flows', {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(flow)
            })
                .then((response) => {
                    if (Math.floor(response.status / 100) == 2) {
                        alert("Saved Flow!")
                        router.push("/dash")
                    } else {
                        response.text().then((text) => {
                            alert("Error saving flow: " + text)
                        })
                    }
                })
        })
    }

    function reset() {
        setContent(JSON.stringify(flow['flows'], null, 4))
    }

    function onUpdate(e) {
        setContent(e.target.value)

        // try to parse JSON
        try {
            JSON.parse(e.target.value)
            setError('')
        } catch (e) {
            setError(e.toString())
        }
    }

    return <>
        <div className="h-screen">
            <div className="mb-10">
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
                        <Link href="/dash"
                            className="bg-white rounded-lg px-5 py-1 font-semibold text-center">{user?.email}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <label
                    htmlFor="helper-text"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Source:
                </label>
                <input
                    value={source}
                    onChange={e => setSource(e.target.value)}
                    type="email"
                    id="helper-text"
                    aria-describedby="helper-text-explanation"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="https://rapla.dhbw.de/abdefgh.ics" />
                <p id="helper-text-explanation" className="mt-2 text-sm text-gray-500 dark:text-gray-400">Please enter a <span className="text-green-400">valid</span> .ics URL</p>
            </div>

            <form>
                <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">


                    <div className="flex items-center justify-between px-3 py-2 border-b dark:border-gray-600">
                        <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x dark:divide-gray-600">
                            <div className="flex items-center space-x-1 sm:pr-4">
                                {flow && <h1 className="text-white">Editing <span className="font-semibold">{flow['name']}</span> <span className="bg-slate-600 p-2 rounded-sm">{flow['flow-id']}</span> in JSON mode</h1>}
                            </div>
                        </div>
                        <button
                            type="button"
                            className="p-2 text-gray-500 rounded cursor-pointer sm:ml-auto hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                            onClick={reset}
                        >
                            <span>Reset</span>
                        </button>
                    </div>
                    <div className="px-4 py-2 bg-white dark:bg-gray-800">
                        <label htmlFor="editor" className="sr-only">Publish post</label>
                        <textarea
                            id="editor"
                            rows="30"
                            className="block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                            placeholder="[ ]"
                            value={content}
                            onChange={onUpdate}
                            required></textarea>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 rounded-b-lg  dark:border-gray-600">
                        <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x dark:divide-gray-600">
                            {error
                                ? <div id="alert-additional-content-2" className="text-red-800 dark:text-red-400" role="alert">
                                    <div className="flex items-center">
                                        <svg aria-hidden="true" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                                        <span className="sr-only">Info</span>
                                        <h3 className="text-lg font-medium">JSON Parse Error</h3>
                                    </div>
                                    <div className="mt-2 mb-4 text-sm">
                                        {error}
                                    </div>
                                </div>
                                : <div id="alert-additional-content-3" className="text-green-800 dark:text-green-400 dark:border-green-800" role="alert">
                                    <div className="flex items-center mt-2 mb-4">
                                        <svg aria-hidden="true" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                                        <span className="sr-only">Info</span>
                                        <h3 className="text-lg font-medium">JSON is valid</h3>
                                    </div>
                                    <div className="flex">
                                        <button
                                            onClick={save}
                                            type="button"
                                            className="text-white bg-green-800 hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 mr-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                            <svg aria-hidden="true" className="-ml-0.5 mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path></svg>
                                            Save Flow
                                        </button>
                                    </div>
                                </div>}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </>
}