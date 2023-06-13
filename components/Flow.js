import React from 'react';
import { ETBaseURL } from './Var';
import { useRouter } from 'next/router';

export default function Flow({ flow, token }) {
    const url = ETBaseURL + "/" + flow['flow-id']
    const icsUrl = url + ".ics"

    const router = useRouter();

    function copyICalURL() {
        const u = url + ".ics"
        navigator.clipboard.writeText(u)
        alert("copied: " + u)
    }

    function deleteFlow() {
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then((result) => {
                if (result.status == 200) {
                    router.reload()
                } else {
                    result.text().then((text) => {
                        alert("Cannot delete Flow: " + text)
                    })
                }
            })
    }

    function duplicateFlow() {
        const copy = JSON.parse(JSON.stringify(flow)) // don't tell anyone.

        // modify duplicate
        delete copy['flow-id'] // clear flow-id to generate new
        copy['name'] += " (copy)"

        fetch(ETBaseURL + "/flows", {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(copy)
        })
            .then((result) => {
                if (Math.floor(result.status / 100) == 2) {
                    router.reload()
                } else {
                    result.text().then((text) => {
                        alert("Cannot duplicate Flow: " + text)
                    })
                }
            })
    }

    function editFlow() {
        router.push("/raw/" + flow['flow-id'])
    }

    return <>
        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className='flex justify-between'>
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {flow['name']}
                </h5>
                <button onClick={duplicateFlow}>
                    <svg className="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 46 53" xmlns="http://www.w3.org/2000/svg">
                        <rect x="12.5" y="12.5" width="31" height="38" rx="2.5" stroke="white" strokeWidth="5" />
                        <path d="M5 38V5H31H36C36 2.23858 33.7614 0 31 0H5C2.23858 0 0 2.23858 0 5V38C0 40.7614 2.23858 43 5 43V38Z" fill="white" />
                    </svg>
                </button>
            </div>
            <p className="mb-1 font-normal text-gray-700 dark:text-gray-400">{flow['flow-id']}</p>
            <a href={icsUrl} className="mb-4 inline-flex items-center text-blue-600 hover:underline">
                Output URL
                <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path></svg>
            </a>
            <br />
            <div>
                <button onClick={editFlow} className="mr-3 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Edit
                    <svg aria-hidden="true" className="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
                <button onClick={deleteFlow} className="mr-3 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                    Delete
                    <svg aria-hidden="true" className="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
            </div>
        </div>
    </>
}