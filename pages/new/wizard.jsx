import { useState, useEffect } from 'react';
import { useAuthContext } from "../../context/AuthContext";
import { useRouter } from "next/router";
import { ETBaseURL } from '../../components/Var';
import NavBar from '../../components/NavBar';

export default function Flows() {
    // JSON data
    const [jsonData, setJsonData] = useState(null);
    const [selectedIfOptions, setSelectedIfOptions] = useState([{ option: '', subOption: '' }]);
    const [selectedThenActionOptions, setSelectedThenActionOptions] = useState([{ action: '' }]);
    const [selectedElseActionOptions, setSelectedElseActionOptions] = useState([{ action: '' }]);
    const [inputValues, setInputValues] = useState({});  // new state for input values
    const [title, setTitle] = useState("Test Flow");
    const [source, setSource] = useState("");
    const [error, setError] = useState("");

    // Get JSON data on component mount
    useEffect(() => {
        fetch('/spec.json')
            .then((response) => response.json())
            .then((data) => setJsonData(data))
            .catch((error) => console.error('Error:', error));
    }, []);

    function saveToJson() {
        // make sure we have a source
        if (!source) {
            return setError('source cannot be empty')
        }

        // check if source is a valid URL
        try {
            new URL(source)
        } catch (e) {
            return setError(`source is not a valid url: ${e.toString()}`)
        }

        const flows = {
            "if": selectedIfOptions.map((opt, index) => {
                const inputVal = inputValues[`${index}_${opt.subOption}`] || '';
                // technically, this is cheating - but for the demo it works :)
                if (opt.option === "Event") {
                    return `${opt.option}.${opt.subOption}() contains '${inputVal.replace("'", "\'")}'`
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

        // check if there is any if
        if (flows.if[0] == '.()') {
            return setError('at least 1 if condition is required.')
        }

        const flow = {
            name: title,
            source: source,
            flows: [flows],
        }

        user.getIdToken().then((token) => {
            fetch(ETBaseURL + '/flows', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(flow)
            })
                .then((response) => {
                    if (Math.floor(response.status / 100) == 2) {
                        setError('')
                        router.push("/dash")
                    } else {
                        response.text().then((text) => {
                            setError(text)
                        })
                    }
                })
        })
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
                    setInputValues(prevState => ({ ...prevState, [`${index}_${value}`]: '' }));
                } else {
                    const newInputValues = { ...inputValues };
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
        setSelectedIfOptions(prev => [...prev, { option: '', subOption: '' }]);
    };

    const handleInputChange = (event, index, option) => {
        setInputValues(prevState => ({ ...prevState, [`${index}_${option}`]: event.target.value }));
    };

    const handleRemoveIf = (index, options, setOptions) => {
        const optionsCopy = [...options];
        optionsCopy.splice(index, 1);
        setOptions(optionsCopy);
    };

    const { user } = useAuthContext()
    const router = useRouter()

    useEffect(() => {
        if (user == null) router.push("/")
    }, [])

    return (
        <div className="h-screen">
            <NavBar />

            <div className="w-screen">
                <div className="h-full flex justify-center items-center text-white pt-20">
                    <div className="w-2/3 ml-8">
                        <div className="flex justify-between items-center mb-8">
                            <input
                                className="text-white font-bold text-4xl bg-transparent border-none"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                            <button
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                onClick={saveToJson}>Save
                            </button>
                        </div>

                        {error && <div id="alert-additional-content-2" className="p-4 mb-4 text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
                            <div className="flex items-center">
                                <svg aria-hidden="true" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                                <span className="sr-only">Error</span>
                                <h3 className="text-lg font-medium">Error Saving Flow</h3>
                            </div>
                            <div className="mt-2 mb-4 text-sm">
                                Something went wrong saving your flow:

                                <pre className='mt-2 bg-slate-900 p-3 rounded-md whitespace-pre-wrap'>
                                    {error}
                                </pre>
                            </div>
                            <div className="flex">
                                <a
                                    href='https://github.com/ralf-life'
                                    type="button"
                                    className="text-white bg-red-800 hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 mr-2 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                                    <svg aria-hidden="true" className="-ml-0.5 mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path></svg>
                                    Contact Us
                                </a>
                            </div>
                        </div>}


                        <div>
                            <div className="space-y-4">
                                <div className="flex mb-4">
                                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                                        @
                                    </span>
                                    <input
                                        onChange={e => setSource(e.target.value)}
                                        value={source}
                                        type="text"
                                        id="website-admin"
                                        className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="source URL " />
                                </div>

                                <hr style={{ borderColor: 'gray' }} />

                                <div className='p-4 bg-slate-800 rounded-md'>
                                    {selectedIfOptions.map((selectedOption, index) => (
                                        <div key={index} className="flex items-center space-x-4 mb-3">
                                            <div className='font-bold'>{index === 0 ? 'if' : 'or'}:</div>
                                            {jsonData &&
                                                <select
                                                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                                    value={selectedOption.option}
                                                    onChange={event => handleOptionChange(index, 1, event.target.value, selectedIfOptions, setSelectedIfOptions)}>
                                                    <option value="">Select an option...</option>
                                                    {jsonData?.$if && Object.keys(jsonData.$if).map(key => (
                                                        <option key={key} value={key}>{key}</option>
                                                    ))}
                                                </select>
                                            }
                                            {jsonData && jsonData.$if && selectedOption.option && jsonData.$if.hasOwnProperty(selectedOption.option) &&
                                                <select
                                                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                                    value={selectedOption.subOption}
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
                                                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                                        placeholder='Contains...'
                                                        value={inputValues[`${index}_${selectedOption.subOption}`] || ''}
                                                        onChange={event => handleInputChange(event, index, selectedOption.subOption)}
                                                    />
                                                )
                                            }
                                            <button
                                                className='px-3 py-1 bg-red-400 rounded-md'
                                                onClick={() => handleRemoveIf(index, selectedIfOptions, setSelectedIfOptions)}
                                            >-
                                            </button>
                                        </div>
                                    ))}

                                    <button
                                        className='px-3 py-1 bg-slate-400 rounded-md'
                                        onClick={handleAddIf}
                                    >
                                        + OR
                                    </button>
                                </div>

                                <hr style={{ borderColor: 'gray' }} />

                                <div className='p-4 bg-slate-900 rounded-md'>
                                    <div className="font-bold">then:</div>

                                    {selectedThenActionOptions.map((selectedOption, index) => (
                                        <div key={index} className="flex items-center space-x-4">
                                            {jsonData &&
                                                <select
                                                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                                    value={selectedOption.action}
                                                    onChange={event => handleOptionChange(index, 3, event.target.value, selectedThenActionOptions, setSelectedThenActionOptions)}>
                                                    <option value="">Select an action...</option>
                                                    {jsonData?.$actions && Object.keys(jsonData.$actions).map(key => (
                                                        <option key={key} value={key}>{key}</option>
                                                    ))}
                                                </select>
                                            }
                                        </div>
                                    ))}
                                </div>
                                <hr style={{ borderColor: 'gray', width: '100%' }} />

                                <div className='p-4 bg-slate-900 rounded-md'>
                                    <div className="font-bold">else:</div>
                                    {selectedElseActionOptions.map((selectedOption, index) => (
                                        <div key={index} className="flex items-center space-x-4">
                                            {jsonData &&
                                                <select
                                                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                                    value={selectedOption.action}
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
        </div>
    )
}
