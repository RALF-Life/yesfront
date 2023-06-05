import React from 'react';

const IfBlock = ({block, blockIndex, handleIfChange, handleRemoveIf, jsonData}) => {
    return (
        <div>
            {block.ifs.map((selectedIf, ifIndex) => (
                <div key={ifIndex} className="flex items-center space-x-4">
                    <div>if:</div>
                    {jsonData &&
                        <select style={{color: 'black'}} value={selectedIf.option}
                                onChange={event => handleIfChange(event, blockIndex, ifIndex, 1)}>
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
        </div>
    );
}

export default IfBlock;