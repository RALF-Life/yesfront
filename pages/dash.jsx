import Head from 'next/head'
import Link from 'next/link'
import React, { useState, useEffect } from 'react';
import { useAuthContext } from "../context/AuthContext";
import { useRouter } from "next/router";
import Flow from '../components/Flow';
import { ETBaseURL } from '../components/Var';

export default function Dash() {
    const [flows, setFlows] = useState([]);
    const [token, setToken] = useState(null);

    const { user } = useAuthContext()
    const router = useRouter()

    React.useEffect(() => {
        if (user == null) {
            router.push("/")
            return
        }

        user.getIdToken().then((token) => {
            setToken(token)

            fetch(ETBaseURL + '/flows', {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
                .then((response) => response.json())
                .then((data) => setFlows(data || []))
        })
    }, []);

    return (
        <div className="h-screen flex justify-between items-center text-white pt-20">
            <ul className='w-full'>
                {flows.length > 0
                    ? flows.map((flow, index) => (
                        <li key={index} className='mb-4'>
                            <Flow flow={flow} token={token} />
                        </li>
                    ))
                    : <span className='text-red-400'>No flow found</span>
                }
            </ul>
        </div>
    )
}
