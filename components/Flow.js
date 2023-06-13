import React from 'react';
import { ETBaseURL } from './Var';
import { useRouter } from 'next/router';

export default function Flow({ flow, token }) {
    const url = ETBaseURL + "/" + flow['flow-id']

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
        const copy = { ...flow }
        copy['flow-id'] = '' // clear flow-id to generate new

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
        <div className='bg-gray-800 p-4 rounded-md flex justify-between items-center'>
            <div className='flex flex-col'>
                <h2 className='text-xl font-bold'>{flow['name']}</h2>
                <span className='text-gray-400'>{flow['flow-id']}</span>
                <span className='text-gray-600'>{flow['source']}</span>
            </div>
            <div>
                <button className='bg-green-500 px-4 py-2 rounded-md mr-3' onClick={editFlow}>
                    Edit
                </button>
                <button className='bg-red-500 px-4 py-2 rounded-md mr-3' onClick={deleteFlow}>
                    Delete
                </button>
                <button className='bg-blue-500 px-4 py-2 rounded-md mr-3' onClick={duplicateFlow}>
                    Duplicate
                </button>
                <button className='bg-gray-600 px-4 py-2 rounded-md' onClick={copyICalURL}>
                    Copy
                </button>
            </div>
        </div>
    </>
}