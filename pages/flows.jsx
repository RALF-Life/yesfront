import Head from 'next/head'
import Link from 'next/link'
import React, {useState, useEffect} from 'react';

export default function Flows() {
    // JSON data
    const [jsonData, setJsonData] = useState(null);

    const [ifButtonClicked, setIfButtonClicked] = useState(false);
    // Selected options
    const [selectedOptions, setSelectedOptions] = useState([{option: '', subOption: ''}]);
    const [blocks, setBlocks] = useState([
        {
            ifs: [{option: '', subOption: ''}],
            thens: [],
        },
    ]);
    // Selected JSON
    const [selectedJson, setSelectedJson] = useState({$if: {}});

    // Selected Ifs
    const [selectedIfs, setSelectedIfs] = useState([{option: '', subOption: ''}]);

    // Selected Thens
    const [selectedThens, setSelectedThens] = useState([{type: 'if', option: '', subOption: ''}]);

    // Get JSON data on component mount
    useEffect(() => {
        fetch('/spec.json')
            .then((response) => response.json())
            .then((data) => setJsonData(data))
            .catch((error) => console.error('Error:', error));
    }, []);

    const handleRemoveIf = (blockIndex, ifIndex) => {
        const blocksCopy = [...blocks];
        blocksCopy[blockIndex].ifs.splice(ifIndex, 1);
        setBlocks(blocksCopy);
    };

    const handleRemoveThen = (blockIndex, thenIndex) => {
        const blocksCopy = [...blocks];
        blocksCopy[blockIndex].thens.splice(thenIndex, 1);
        setBlocks(blocksCopy);
    };
    const handleIfChange = (blockIndex, ifIndex, level, value) => {
        const blocksCopy = [...blocks];
        blocksCopy[blockIndex].ifs[ifIndex][level === 1 ? 'option' : 'subOption'] = value;
        setBlocks(blocksCopy);

        // Construct nested JSON object
        let nestedJson = {...selectedJson};
        let currentOption = blocksCopy[blockIndex].ifs[ifIndex].option;
        let currentSubOption = blocksCopy[blockIndex].ifs[ifIndex].subOption;
        if (!nestedJson.$if[currentOption]) {
            nestedJson.$if[currentOption] = {};
        }
        nestedJson.$if[currentOption][currentSubOption] = {};
        setSelectedJson(nestedJson);
    };

    const handleThenChange = (blockIndex, thenIndex, type, level, value) => {
        const blocksCopy = [...blocks];
        if (type === 'action') {
            blocksCopy[blockIndex].thens[thenIndex].type = type;
            blocksCopy[blockIndex].thens[thenIndex].option = value;
        } else if (type === 'if') {
            blocksCopy[blockIndex].thens[thenIndex][level === 1 ? 'option' : 'subOption'] = value;
        }
        setBlocks(blocksCopy);

        // Construct nested JSON object
        let nestedJson = {...selectedJson};
        if (type === 'action') {
            let currentAction = blocksCopy[blockIndex].thens[thenIndex].option;
            if (!nestedJson.$actions[currentAction]) {
                nestedJson.$actions[currentAction] = {};
            }
        } else if (type === 'if') {
            let currentOption = blocksCopy[blockIndex].thens[thenIndex].option;
            let currentSubOption = blocksCopy[blockIndex].thens[thenIndex].subOption;
            if (!nestedJson.$if[currentOption]) {
                nestedJson.$if[currentOption] = {};
            }
            nestedJson.$if[currentOption][currentSubOption] = {};
        }
        setSelectedJson(nestedJson);
    };

    const handleAddIf = (blockIndex) => {
        const blocksCopy = [...blocks];
        blocksCopy[blockIndex].ifs.push({option: '', subOption: ''});
        setBlocks(blocksCopy);
    };

    const handleAddThen = (blockIndex, type) => {
        const blocksCopy = [...blocks];
        if (type === 'action') {
            if (isLastBlock(blockIndex)) {
                const exists = blocksCopy[blockIndex].thens.some((then) => then.type === 'action');
                if (!exists) {
                    blocksCopy[blockIndex].thens.push({type: type, option: '', subOption: ''});
                    setBlocks(blocksCopy);
                }
            }
        } else {
            blocksCopy[blockIndex].thens.push({type: type, option: '', subOption: ''});
            if (isLastBlock(blockIndex)) {
                setBlocks([...blocksCopy, {
                    ifs: [],
                    thens: [],
                }]);
            } else {
                setBlocks(blocksCopy);
            }
        }
    };

    const isLastBlock = (blockIndex) => blockIndex === blocks.length - 1;
    console.log(selectedJson);

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
                    <Link href="/signup" className="bg-white rounded-lg px-5 py-1 font-semibold text-center">Sign
                        Up</Link>
                </div>
            </div>

            <div className="w-screen">
                <div className="h-full flex justify-between items-center text-white pt-20">
                    <div className="w-1/2 ml-8">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-white font-bold mb-8 text-4xl">Test Flow</p>
                            <button className=" text-black font-semibold px-4 py-2 rounded-lg bg-[#50FFD5] h-10">Save
                            </button>
                        </div>
                        {blocks.map((block, blockIndex) => (
                            <div key={blockIndex}>
                                <div className="space-y-4">
                                    {block.ifs.map((selectedIf, ifIndex) => (
                                        <div key={ifIndex} className="flex items-center space-x-4">
                                            <div>if:</div>
                                            {jsonData &&
                                                <select style={{color: 'black'}} value={selectedIf.option}
                                                        onChange={event => handleIfChange(blockIndex, ifIndex, 1, event.target.value)}>
                                                    <option value="">Select an option...</option>
                                                    {Object.keys(jsonData.$if).map(key => (
                                                        <option key={key} value={key}>{key}</option>
                                                    ))}
                                                </select>
                                            }
                                            {jsonData && selectedIf.option &&
                                                <select style={{color: 'black'}} value={selectedIf.subOption}
                                                        onChange={event => handleIfChange(blockIndex, ifIndex, 2, event.target.value)}>
                                                    <option value="">Select an option...</option>
                                                    {Object.keys(jsonData.$if[selectedIf.option]).map(key => (
                                                        <option key={key} value={key}>{key}</option>
                                                    ))}
                                                </select>
                                            }
                                            <button onClick={() => handleRemoveIf(blockIndex, ifIndex)}>-</button>
                                        </div>
                                    ))}
                                    <button
                                        style={{
                                            backgroundColor: 'black',
                                            borderRadius: '50%',
                                            color: 'white',
                                            padding: '10px'
                                        }}
                                        onClick={() => handleAddIf(blockIndex)}>+
                                    </button>
                                </div>
                                <hr style={{borderColor: 'gray'}}/>
                                <div className="mt-4">then:</div>
                                <div className="space-y-4">
                                    {block.thens.map((selectedThen, thenIndex) => (
                                        <div key={thenIndex} className="flex items-center space-x-4">
                                            {selectedThen.type === 'if' &&
                                                <div className="flex items-center space-x-4">
                                                    <div>if:</div>
                                                    {jsonData &&
                                                        <select style={{color: 'black'}} value={selectedThen.option}
                                                                onChange={event => handleThenChange(blockIndex, thenIndex, 'if', 1, event.target.value)}>
                                                            <option value="">Select an option...</option>
                                                            {Object.keys(jsonData.$if).map(key => (
                                                                <option key={key} value={key}>{key}</option>
                                                            ))}
                                                        </select>
                                                    }
                                                    {jsonData && selectedThen.option &&
                                                        <select style={{color: 'black'}} value={selectedThen.subOption}
                                                                onChange={event => handleThenChange(blockIndex, thenIndex, 'if', 2, event.target.value)}>
                                                            <option value="">Select an option...</option>
                                                            {Object.keys(jsonData.$if[selectedThen.option]).map(key => (
                                                                <option key={key} value={key}>{key}</option>
                                                            ))}
                                                        </select>
                                                    }
                                                    <button onClick={() => handleRemoveThen(blockIndex, thenIndex)}>-
                                                    </button>
                                                </div>
                                            }
                                            {selectedThen.type === 'action' &&
                                                <div className="flex items-center space-x-4">
                                                    <div>action:</div>
                                                    {jsonData &&
                                                        <select style={{color: 'black'}} value={selectedThen.option}
                                                                onChange={event => handleThenChange(blockIndex, thenIndex, 'action', 1, event.target.value)}>
                                                            <option value="">Select an action...</option>
                                                            {Object.keys(jsonData.$actions).map(key => (
                                                                <option key={key} value={key}>{key}</option>
                                                            ))}
                                                        </select>
                                                    }
                                                    <button onClick={() => handleRemoveThen(blockIndex, thenIndex)}>-
                                                    </button>
                                                </div>
                                            }
                                        </div>
                                    ))}
                                    {isLastBlock(blockIndex) && !block.thens.find(then => then.type === 'action') &&
                                        <div>
                                            <button
                                                style={{
                                                    backgroundColor: 'black',
                                                    borderRadius: '50%',
                                                    color: 'white',
                                                    padding: '10px'
                                                }}
                                                onClick={() => handleAddThen(blockIndex, 'if')}>if +
                                            </button>
                                            <button
                                                style={{
                                                    backgroundColor: 'black',
                                                    borderRadius: '50%',
                                                    color: 'white',
                                                    padding: '10px'
                                                }}
                                                onClick={() => handleAddThen(blockIndex, 'action')}>action +
                                            </button>
                                        </div>
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
