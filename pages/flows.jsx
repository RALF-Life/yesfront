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
    const [selectedThenActionOptions, setSelectedThenActionOptions] = useState([{action: ''}]);
    const [selectedElseActionOptions, setSelectedElseActionOptions] = useState([{action: ''}]);
    const [inputValues, setInputValues] = useState({});  // new state for input values
    const [title, setTitle] = useState("Test Flow");
    // New state for the list of JSON files and the selected file
    const [jsonFiles, setJsonFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    function parseConditionString(conditionString) {
        const [option, subOption] = conditionString.split('.');
        return {option, subOption: subOption.split('()')[0]};
    }

    // Get the list of JSON files on component mount
    useEffect(() => {
        fetch('/test.json')
            .then((response) => response.json())
            .then((data) => {
                setJsonData(data)
                // Parse the conditions and actions from the JSON data
                if (data) {
                    const conditions = data.if.map(conditionString => parseConditionString(conditionString));
                    console.log("Parsed conditions: ", conditions);
                    const thenActions = data.then.map(action => ({action: action.do}));
                    const elseActions = data.else.map(action => ({action: action.do}));
                    setSelectedIfOptions(conditions);
                    setSelectedThenActionOptions(thenActions);
                    setSelectedElseActionOptions(elseActions);
                }
            })
            .catch((error) => console.error('Error:', error));
    }, []);

    // New function to load a selected JSON file
    const loadJsonFile = (fileName) => {
        fetch(`${JSON_FILES_PATH}/${fileName}`)
            .then((response) => response.json())
            .then((data) => {
                // Assuming that your JSON data has the same structure as your form
                setSelectedIfOptions(data.if.map((condition) => ({
                    option: condition.option,
                    subOption: condition.subOption
                })));
                setSelectedThenActionOptions([{action: data.then[0].do}]);
                setSelectedElseActionOptions([{action: data.else[0].do}]);
            })
            .catch((error) => console.error('Error:', error));
    };

    // New function to handle file selection
    const handleFileChange = (event) => {
        setSelectedFile(event.target.value);
        loadJsonFile(event.target.value);
    };
    // Get JSON data on component mount
    useEffect(() => {
        fetch('/spec.json')
            .then((response) => response.json())
            .then((data) => setJsonData(data))
            .catch((error) => console.error('Error:', error));
    }, []);

    const saveToJson = () => {
        let currentData = {
            "if": selectedIfOptions.map((opt, index) => {
                let inputVal = inputValues[`${index}_${opt.subOption}`] || '';
                if (opt.option === "Event") {
                    return `${opt.option}.${opt.subOption}() contains '${inputVal}'`;
                } else { // For "Date" and possibly other options
                    return `${opt.option}.${opt.subOption}()`;
                }
            }),
            "then": [
                {
                    "do": selectedThenActionOptions[0]?.action || ""
                }
            ],
            "else": [
                {
                    "do": selectedElseActionOptions[0]?.action || ""
                }
            ]
        };

        let jsonData = JSON.stringify([currentData], null, 2);

        // Send a POST request to your backend
        fetch('https://your-backend-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        }).then(response => {
            if (response.ok) {
                console.log('Success:', response);
            } else {
                console.error('Error:', response);
            }
        }).catch((error) => console.error('Error:', error));
    };
    const handleOptionChange = (index, level, value, options, setOptions) => {
        const optionsCopy = [...options];
        if (!optionsCopy[index]) {
            optionsCopy[index] = {};
        }
        if (level === 1) {
            optionsCopy[index].option = value;
            optionsCopy[index].subOption = '';
        } else if (level === 2) {
            if (level === 2) {
                const returnType = jsonData.$if[optionsCopy[index].option][value].returns;
                if (returnType === 'string') {
                    setInputValues(prevState => ({...prevState, [`${index}_${value}`]: ''}));
                } else {
                    const newInputValues = {...inputValues};
                    delete newInputValues[`${index}_${value}`];
                    setInputValues(newInputValues);
                }
            }
            optionsCopy[index].subOption = value;
        } else if (level === 3) {
            optionsCopy[index].action = value;
        }
        setOptions(optionsCopy);
    };

    const handleAddIf = () => {
        setSelectedIfOptions(prev => [...prev, {option: '', subOption: ''}]);
    };

    const handleInputChange = (event, index, option) => {
        setInputValues(prevState => ({...prevState, [`${index}_${option}`]: event.target.value}));
    };

    const handleRemoveIf = (index, options, setOptions) => {
        const optionsCopy = [...options];
        optionsCopy.splice(index, 1);
        setOptions(optionsCopy);
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
                            <input
                                className="text-white font-bold mb-8 text-4xl bg-transparent border-none"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                            <button
                                className=" text-black font-semibold px-4 py-2 rounded-lg bg-[#50FFD5] h-10"
                                onClick={saveToJson}>Save
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
                                                {jsonData?.$if && Object.keys(jsonData.$if).map(key => (
                                                    <option key={key} value={key}>{key}</option>
                                                ))}
                                            </select>
                                        }
                                        {jsonData && jsonData.$if && selectedOption.option && jsonData.$if.hasOwnProperty(selectedOption.option) &&
                                            <select style={{color: 'black'}} value={selectedOption.subOption}
                                                    onChange={event => handleOptionChange(index, 2, event.target.value, selectedIfOptions, setSelectedIfOptions)}>
                                                <option value="">Select an option...</option>
                                                {Object.keys(jsonData.$if[selectedOption.option]).map((optionKey, i) => (
                                                    <option key={i} value={optionKey}>{optionKey}</option>
                                                ))}
                                            </select>
                                        }
                                        {
                                            jsonData &&
                                            selectedOption.option &&
                                            selectedOption.subOption &&
                                            jsonData.$if &&
                                            jsonData.$if[selectedOption.option] &&
                                            jsonData.$if[selectedOption.option][selectedOption.subOption] &&
                                            jsonData.$if[selectedOption.option][selectedOption.subOption].returns === 'string' && (
                                                <input
                                                    type="text"
                                                    style={{color: 'black'}}
                                                    value={inputValues[`${index}_${selectedOption.subOption}`] || ''}
                                                    onChange={event => handleInputChange(event, index, selectedOption.subOption)}
                                                />
                                            )
                                        }
                                        <button
                                            style={{
                                                backgroundColor: 'black',
                                                borderRadius: '50%',
                                                color: 'white',
                                                padding: '10px'
                                            }}
                                            onClick={() => handleRemoveIf(index, selectedIfOptions, setSelectedIfOptions)}
                                        >-
                                        </button>
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
                                >Add Condition
                                </button>

                                <hr style={{borderColor: 'gray'}}/>
                                <div className="mt-4">then:</div>

                                {selectedThenActionOptions.map((selectedOption, index) => (
                                    <div key={index} className="flex items-center space-x-4">
                                        <div>Action:</div>
                                        {jsonData &&
                                            <select style={{color: 'black'}} value={selectedOption.action}
                                                    onChange={event => handleOptionChange(index, 3, event.target.value, selectedThenActionOptions, setSelectedThenActionOptions)}>
                                                <option value="">Select an action...</option>
                                                {jsonData?.$actions && Object.keys(jsonData.$actions).map(key => (
                                                    <option key={key} value={key}>{key}</option>
                                                ))}
                                            </select>
                                        }
                                    </div>
                                ))}
                                <hr style={{borderColor: 'gray', width: '100%'}}/>
                                <div className="mt-4">else:</div>
                                {selectedElseActionOptions.map((selectedOption, index) => (
                                    <div key={index} className="flex items-center space-x-4">
                                        <div>Action:</div>
                                        {jsonData &&
                                            <select style={{color: 'black'}} value={selectedOption.action}
                                                    onChange={event => handleOptionChange(index, 3, event.target.value, selectedElseActionOptions, setSelectedElseActionOptions)}>
                                                <option value="">Select an action...</option>
                                                {jsonData?.$actions && Object.keys(jsonData.$actions).map(key => (
                                                    <option key={key} value={key}>{key}</option>
                                                ))}
                                            </select>
                                        }
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
