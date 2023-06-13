import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { ETBaseURL } from "../../components/Var";

export default function Raw() {
    const router = useRouter()
    const flowID = router.query.index

    const [text, setText] = useState(null);
    const [token, setToken] = useState(null);

    const { user } = useAuthContext()

    useEffect(() => {
        if (user == null) {
            router.push("/")
            return
        }

        user.getIdToken().then((token) => {
            setToken(token)

            fetch(ETBaseURL + '/' + flowID + ".json", {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
                .then((response) => response.text())
                .then((text) => {
                    const parsed = JSON.parse(text)
                    delete parsed['user-id']
                    setText(JSON.stringify(parsed, null, 2))
                })
        })
    }, []);

    function saveFlow() {
        
    }

    function onChange(val) {
        // console.log(val.target.value)
    }

    return <>
        <div className='h-screen flex justify-between items-center text-white pt-20'>
            <h1>Hello, {user.email}</h1>
            <div className='w-full bg-gray-800 p-4 rounded-md flex justify-between'>
                <div className='flex flex-col'>
                    <h2 className='text-xl font-bold'>{flowID}</h2>
                    <textarea className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
                </div>
                <div>
                    <button className='bg-green-500 px-4 py-2 rounded-md mr-3' onClick={saveFlow}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    </>
}