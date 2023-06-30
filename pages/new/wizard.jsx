import { useState, useEffect } from 'react';
import { useAuthContext } from "../../context/AuthContext";
import { useRouter } from "next/router";
import { ETBaseURL } from '../../components/Var';
import NavBar from '../../components/NavBar';

const StepSelectSource = 0
const StepFlowCreator = 10
const StepSelectSourceRapla = 100

function SelectSource({ setStep }) {
    return <>
        <div className="flex flex-row justify-center items-center space-x-5">
            <div className="items-center justify-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
                <button
                    className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 focus:ring-4 focus:outline-none focus:ring-gray-300 text-white rounded-lg inline-flex items-center justify-center px-4 py-2.5 dark:bg-slate-700 dark:hover:bg-slate-600 dark:focus:ring-slate-700"
                    onClick={() => setStep(StepSelectSourceRapla)}
                >
                    <svg className="mr-3 w-7 h-7" width="970" height="949" viewBox="0 0 970 949" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M737.146 243.294V436.498C737.146 446.115 728.873 461.972 719.254 471.561L522.443 668.342C517.634 673.151 512.71 675.498 509.561 675.498C506.412 675.498 504.552 673.151 504.552 668.342V689.809C504.552 699.427 512.825 707.699 522.443 707.699H951.133C960.752 707.699 969.025 699.427 969.025 689.809V260.468C969.025 250.85 960.752 243.294 951.133 243.294H737.146ZM464.474 689.809C464.474 699.427 456.172 707.699 446.582 707.699H232.595V940.974C232.595 945.783 234.484 948.13 237.604 948.13C240.725 948.13 244.962 945.783 249.771 940.974L446.582 744.193C456.172 734.575 464.474 718.747 464.474 709.13V689.809Z" fill="#7D8990" />
                        <path d="M732.136 0C728.973 0 724.064 2.34699 719.254 7.15564L522.443 204.653C512.853 214.242 504.551 229.383 504.551 239V260.467V668.342C504.551 677.959 512.853 677.959 522.443 668.342L719.254 471.56C728.873 461.943 737.146 446.115 737.146 436.497V243.294V7.15564C737.146 2.34699 735.3 0 732.136 0ZM17.8918 243.294C8.27317 243.294 0 250.85 0 260.467V689.809C0 699.426 8.27317 707.698 17.8918 707.698H446.582C456.2 707.698 464.474 699.426 464.474 689.809V260.467C464.474 250.85 456.2 243.294 446.582 243.294H17.8918Z" fill="#E2001A" />
                        <path d="M522.443 243.294C512.825 243.294 504.552 251.566 504.552 261.183V668.342C504.552 673.151 506.414 675.498 509.561 675.498C512.71 675.498 517.634 673.151 522.443 668.342L719.254 471.561C728.873 461.943 737.146 446.086 737.146 436.498V243.294H522.443ZM459.464 272.632C456.286 272.632 451.391 275.008 446.582 279.788L249.771 477.285C240.181 487.074 232.595 502.044 232.595 511.633V707.699H446.582C456.2 707.699 464.474 699.427 464.474 689.809V279.788C464.474 275.008 462.612 272.632 459.464 272.632Z" fill="#8E1016" />
                    </svg>

                    <div className="text-left">
                        <div className="mb-1 text-xs">Import Calendar from</div>
                        <div className="-mt-1 font-sans text-sm font-semibold">RAPLA (DHBW)</div>
                    </div>
                </button>
            </div>
            <div>
                or
            </div>
            <div>
                <button
                    className="text-blue-500 inline-flex items-center"
                    onClick={() => setStep(StepFlowCreator)}>
                    Manual Setup
                    <svg class="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path></svg>
                </button>
            </div>
        </div>
    </>
}

function SelectSourceRapla({ setSource, setStep }) {
    const [error, setError] = useState("")
    const [value, setValue] = useState("")

    const [user, setUser] = useState("")
    const [file, setFile] = useState("")

    useEffect(() => {
        // check if value is valid
        let url
        try {
            url = new URL(value)
            setError("")
        } catch (e) {
            return setError(e.toString())
        }

        if (!url.host.includes("rapla.")) {
            return setError("This URL doesn't appear to be a RAPLA URL.")
        }

        const user = url.searchParams.get('user')
        const file = url.searchParams.get('file').toUpperCase()

        setUser(user)
        setFile(file)

        return setSource(`https://rapla.dhbw-karlsruhe.de/rapla?page=ical&user=${user}&file=${file}`)
    }, [value])

    return <>
        {error && <div class="mb-4 p-4 border border-gray-300 rounded-lg bg-gray-50 dark:border-gray-600 dark:bg-gray-800" role="alert">
            <div class="flex items-center">
                <svg aria-hidden="true" class="w-5 h-5 mr-2 text-gray-800 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                <span class="sr-only">Error</span>
                <h3 class="text-lg font-medium text-gray-800 dark:text-gray-300">Error</h3>
            </div>
            <div class="mt-2 text-sm text-gray-800 dark:text-gray-300">{error}</div>
        </div>}
        <div className="flex mb-4">
            <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                @
            </span>
            <input
                onChange={e => setValue(e.target.value)}
                value={value}
                type="text"
                className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="RAPLA URL " />
        </div>
        {user && file && <div>
            <div className="mt-4">
                <button
                    type="button"
                    class="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 mr-2 mb-2"
                    onClick={() => setStep(StepFlowCreator)}>
                    <svg className="mr-3 w-7 h-7" width="970" height="949" viewBox="0 0 970 949" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M737.146 243.294V436.498C737.146 446.115 728.873 461.972 719.254 471.561L522.443 668.342C517.634 673.151 512.71 675.498 509.561 675.498C506.412 675.498 504.552 673.151 504.552 668.342V689.809C504.552 699.427 512.825 707.699 522.443 707.699H951.133C960.752 707.699 969.025 699.427 969.025 689.809V260.468C969.025 250.85 960.752 243.294 951.133 243.294H737.146ZM464.474 689.809C464.474 699.427 456.172 707.699 446.582 707.699H232.595V940.974C232.595 945.783 234.484 948.13 237.604 948.13C240.725 948.13 244.962 945.783 249.771 940.974L446.582 744.193C456.172 734.575 464.474 718.747 464.474 709.13V689.809Z" fill="#7D8990" />
                        <path d="M732.136 0C728.973 0 724.064 2.34699 719.254 7.15564L522.443 204.653C512.853 214.242 504.551 229.383 504.551 239V260.467V668.342C504.551 677.959 512.853 677.959 522.443 668.342L719.254 471.56C728.873 461.943 737.146 446.115 737.146 436.497V243.294V7.15564C737.146 2.34699 735.3 0 732.136 0ZM17.8918 243.294C8.27317 243.294 0 250.85 0 260.467V689.809C0 699.426 8.27317 707.698 17.8918 707.698H446.582C456.2 707.698 464.474 699.426 464.474 689.809V260.467C464.474 250.85 456.2 243.294 446.582 243.294H17.8918Z" fill="#E2001A" />
                        <path d="M522.443 243.294C512.825 243.294 504.552 251.566 504.552 261.183V668.342C504.552 673.151 506.414 675.498 509.561 675.498C512.71 675.498 517.634 673.151 522.443 668.342L719.254 471.561C728.873 461.943 737.146 446.086 737.146 436.498V243.294H522.443ZM459.464 272.632C456.286 272.632 451.391 275.008 446.582 279.788L249.771 477.285C240.181 487.074 232.595 502.044 232.595 511.633V707.699H446.582C456.2 707.699 464.474 699.427 464.474 689.809V279.788C464.474 275.008 462.612 272.632 459.464 272.632Z" fill="#8E1016" />
                    </svg>
                    Continue with RAPLA
                    <span class="ml-2 bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                        {user}
                    </span>
                    <span class="bg-gray-100 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                        {file}
                    </span>
                </button>
            </div>
        </div>}
    </>
}

function FlowCreator({ user, source, setSource }) {
    const router = useRouter()

    const [jsonData, setJsonData] = useState(null);
    const [selectedIfOptions, setSelectedIfOptions] = useState([{ option: '', subOption: '' }]);
    const [selectedThenActionOptions, setSelectedThenActionOptions] = useState([{ action: '' }]);
    const [selectedElseActionOptions, setSelectedElseActionOptions] = useState([{ action: '' }]);
    const [inputValues, setInputValues] = useState({});  // new state for input values
    const [title, setTitle] = useState("Test Flow");
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
                { "do": selectedThenActionOptions[0]?.action || "" }
            ],
            "else": [
                { "do": selectedElseActionOptions[0]?.action || "" }
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

    return <>
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
    </>
}


function Step({ user, step, setStep, source, setSource }) {
    switch (step) {
        case StepSelectSource:
            return <SelectSource setStep={setStep} />
        case StepSelectSourceRapla:
            return <SelectSourceRapla setStep={setStep} setSource={setSource} />
        case StepFlowCreator:
            return <FlowCreator source={source} setSource={setSource} user={user} />
    }
}

export default function Flows() {
    const { user } = useAuthContext()
    const router = useRouter()

    useEffect(() => {
        if (user == null) router.push("/")
    }, [])

    const [source, setSource] = useState("")
    const [step, setStep] = useState(StepSelectSource)

    return (
        <div className="h-screen">
            <NavBar />

            <div className="w-screen">
                <div className="h-full flex justify-center items-center text-white pt-20">
                    <div className="w-2/3 ml-8">
                        {user &&
                            <Step
                                user={user}
                                step={step}
                                setStep={setStep}
                                source={source}
                                setSource={setSource}
                            />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
