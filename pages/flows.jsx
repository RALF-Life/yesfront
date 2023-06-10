import Head from 'next/head'
import Link from 'next/link'
import React, {useState, useEffect} from 'react';
import {useAuthContext} from "../context/AuthContext";
import {useRouter} from "next/router";
import {getAuth, signOut} from "firebase/auth";

export default function Flows() {
    // JSON data
    const [jsonData, setJsonData] = useState(null);
    const [selectedIfOptions, setSelectedIfOptions] = useState([{option: '', subOption: ''}]);
    const [selectedThenIfOptions, setSelectedThenIfOptions] = useState([{option: '', subOption: ''}]);
    const [selectedThenActionOptions, setSelectedThenActionOptions] = useState([{action: ''}]);

    // Get JSON data on component mount
    useEffect(() => {
        fetch('/spec.json')
            .then((response) => response.json())
            .then((data) => setJsonData(data))
            .catch((error) => console.error('Error:', error));
    }, []);

    const handleOptionChange = (index, level, value, options, setOptions) => {
        const optionsCopy = [...options];
        if (!optionsCopy[index]) {
            optionsCopy[index] = {};
        }
        if (level === 1) {
            optionsCopy[index].option = value;
            optionsCopy[index].subOption = '';
        } else if (level === 2) {
            optionsCopy[index].subOption = value;
        } else if (level === 3) {
            optionsCopy[index].action = value;
        }
        setOptions(optionsCopy);
    };

    const handleAddIf = () => {
        setSelectedIfOptions(prev => [...prev, {option: '', subOption: ''}]);
    };

    const {user} = useAuthContext()
    const router = useRouter()

    React.useEffect(() => {
        if (user == null) router.push("/")
    }, [user])

    const handleLogout = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            router.push("/")
        });
    }
    return (
        <div className="h-screen">
            <Head>
                <title>Ralf</title>
                <meta name="description" content="RALF Flow creation"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <div id="top-navigation" className="ml-5 mt-3 flex items-center">
                <p id="logo"
                   className="mr-6 font-black bg-cover text-4xl text-transparent bg-clip-text bg-gradient-to-r from-RALF-gradient-start to-RALF-gradient-end">RALF</p>
                <div className="flex space-x-6 items-center">
                    <Link href="/imprint" className="text-footer-color font-semibold">Imprint</Link>
                    <Link href="https://ralf-p.medium.com/" className="text-footer-color font-semibold">Blog</Link>
                </div>
                <div className="ml-auto flex items-center mr-10">
                    <button onClick={handleLogout}
                            className="bg-white rounded-lg px-5 py-1 font-semibold text-center">{user?.email}
                    </button>
                </div>
            </div>

            <div className="w-screen">
                <div className="h-full flex justify-between items-center text-white pt-20">
                    <div className="w-1/2 ml-8">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-white font-bold mb-8 text-4xl">Test Flow</p>
                            <button
                                className=" text-black font-semibold px-4 py-2 rounded-lg bg-[#50FFD5] h-10">Save
                            </button>
                        </div>
                        <div className="flex justify-between">
                            <div className="space-y-4">
                                {selectedIfOptions.map((selectedOption, index) => (
                                    <div key={index} className="flex items-center space-x-4">
                                        <div>if:</div>
                                        {jsonData &&
                                            <select style={{color: 'black'}} value={selectedOption.option}
                                                    onChange={event => handleOptionChange(index, 1, event.target.value, selectedIfOptions, setSelectedIfOptions)}>
                                                <option value="">Select an option...</option>
                                                {Object.keys(jsonData.$if).map(key => (
                                                    <option key={key} value={key}>{key}</option>
                                                ))}
                                            </select>
                                        }
                                        {jsonData && selectedOption.option &&
                                            <select style={{color: 'black'}} value={selectedOption.subOption}
                                                    onChange={event => handleOptionChange(index, 2, event.target.value, selectedIfOptions, setSelectedIfOptions)}>
                                                <option value="">Select an option...</option>
                                                {Object.keys(jsonData.$if[selectedOption.option]).map(key => (
                                                    <option key={key} value={key}>{key}</option>
                                                ))}
                                            </select>
                                        }
                                    </div>
                                ))}
                                <button
                                    style={{
                                        backgroundColor: 'black',
                                        borderRadius: '50%',
                                        color: 'white',
                                        padding: '10px'
                                    }}
                                    onClick={handleAddIf}
                                >+
                                </button>
                                <hr style={{borderColor: 'gray'}}/>
                                <div className="mt-4">then:</div>

                                {selectedThenIfOptions.map((selectedOption, index) => (
                                    <div key={index} className="flex items-center space-x-4">
                                        <div>if:</div>
                                        {jsonData &&
                                            <select style={{color: 'black'}} value={selectedOption.option}
                                                    onChange={event => handleOptionChange(index, 1, event.target.value, selectedThenIfOptions, setSelectedThenIfOptions)}>
                                                <option value="">Select an option...</option>
                                                {Object.keys(jsonData.$if).map(key => (
                                                    <option key={key} value={key}>{key}</option>
                                                ))}
                                            </select>
                                        }
                                        {jsonData && selectedOption.option &&
                                            <select style={{color: 'black'}} value={selectedOption.subOption}
                                                    onChange={event => handleOptionChange(index, 2, event.target.value, selectedThenIfOptions, setSelectedThenIfOptions)}>
                                                <option value="">Select an option...</option>
                                                {Object.keys(jsonData.$if[selectedOption.option]).map(key => (
                                                    <option key={key} value={key}>{key}</option>
                                                ))}
                                            </select>
                                        }
                                    </div>
                                ))}
                                {selectedThenActionOptions.map((selectedOption, index) => (
                                    <div key={index} className="flex items-center space-x-4">
                                        <div>Action:</div>
                                        {jsonData &&
                                            <select style={{color: 'black'}} value={selectedOption.action}
                                                    onChange={event => handleOptionChange(index, 3, event.target.value, selectedThenActionOptions, setSelectedThenActionOptions)}>
                                                <option value="">Select an action...</option>
                                                {Object.keys(jsonData.$actions).map(key => (
                                                    <option key={key} value={key}>{key}</option>
                                                ))}
                                            </select>
                                        }
                                    </div>
                                ))}
                                <button
                                    style={{
                                        backgroundColor: 'black',
                                        borderRadius: '50%',
                                        color: 'white',
                                        padding: '10px'
                                    }}
                                    onClick={() => setSelectedThenIfOptions(prev => [...prev, {
                                        option: '',
                                        subOption: ''
                                    }])} // Adds a new "if" dropdown to the "then" section
                                >Add If
                                </button>
                                <button
                                    style={{
                                        backgroundColor: 'black',
                                        borderRadius: '50%',
                                        color: 'white',
                                        padding: '10px'
                                    }}
                                    onClick={() => setSelectedThenActionOptions(prev => [...prev, {action: ''}])} // Adds a new "action" dropdown to the "then" section
                                >Add Action
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
