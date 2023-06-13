import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { ETBaseURL } from "../../components/Var";
import Head from "next/head";
import Link from "next/link";
import { getAuth, signOut } from "firebase/auth";

function Tree({ val }) {
    const tags = {
        'update': <span className="ml-3 bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">Update</span>,
        'execute': <span className="ml-3 bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">Execute</span>,
    }
    console.log(val)
    return <li className="mb-10 ml-4">
        <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
        <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{val.timestamp}</time>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            <span className="flex items-center text-lg font-medium text-gray-900 dark:text-white">
                {val.success
                    ? <span className="flex w-2.5 h-2.5 bg-blue-600 rounded-full mr-1.5 flex-shrink-0"></span>
                    : <span className="flex w-2.5 h-2.5 bg-red-600 rounded-full mr-1.5 flex-shrink-0"></span>}
                {val.address}
                {tags[val.action] ?? ''}
            </span>
        </h3>
        {val.debug && <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
            <ul>
                {val.debug.slice(0, 10).map((k, v) => <li key={v}><code>{k}</code></li>)}
                {val.debug.length > 10 ? <li>and {val.debug.length - 10} more ...</li> : ''}
            </ul>
        </p>}
    </li>
}

export default function Raw() {
    const router = useRouter()
    const { user } = useAuthContext()

    const flowID = router.query.index

    const [flow, setFlow] = useState(null);
    const [content, setContent] = useState('')
    const [error, setError] = useState('')
    const [source, setSource] = useState('')
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [saved, setSaved] = useState(false)

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

        const interval = setInterval(updateLog, 2000)
        return () => clearInterval(interval)
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
                        setSaved(true)
                    } else {
                        setSaved(false)
                        response.text().then((text) => {
                            alert("Error saving flow: " + text)
                        })
                    }
                })
        })
    }

    function updateLog() {
        setLoading(true)

        user.getIdToken().then((token) => {
            fetch(ETBaseURL + '/' + flowID + "/history", {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    setHistory(data)
                    setLoading(false)
                })
        })
    }

    function reset() {
        setContent(JSON.stringify(flow['flows'], null, 4))
    }

    function onUpdate(e) {
        setSaved(false)
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

            <div className="mx-8 flex flex-row justify-between">
                <div className="w-full">
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
                                                    {saved ? 'Saved!' : 'Save Flow'}
                                                </button>
                                            </div>
                                        </div>}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="ml-8">


                    <ul className="max-w-md space-y-2 text-gray-500 list-inside dark:text-gray-400">
                        {loading
                            ? <li className="flex items-center">
                                <div role="status">
                                    <svg aria-hidden="true" className="w-5 h-5 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                                    <span className="sr-only">Loading...</span>
                                </div>
                                Live Updating ...
                            </li>
                            : <li className="flex items-center">
                                <svg aria-hidden="true" className="w-5 h-5 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                                Live Updating ...
                            </li>
                        }
                    </ul>

                    <ol className="relative border-l border-gray-200 dark:border-gray-700">
                        {history.map((val, index) => <Tree key={index} val={val} />)}
                    </ol>
                </div>
            </div>
        </div>
    </>
}