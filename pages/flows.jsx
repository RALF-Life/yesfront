import Head from 'next/head'
import Link from 'next/link'
import React from 'react';
import Editor, {DiffEditor, useMonaco, loader} from '@monaco-editor/react';


export default function Flows() {
    const [input, setInput] = React.useState("//Your YAML Code");
    const [showExtraButtons, setShowExtraButtons] = React.useState(false);
    const [showFilters, setShowFilters] = React.useState(true);
    const [showFinalButtons, setShowFinalButtons] = React.useState(false);

    const editorRef = React.useRef(null);

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
    }

    function handleExtraButtonClick(value) {
        setInput(prevInput => prevInput.replace('$1', value));
        setShowExtraButtons(false);
        setShowFinalButtons(true);
    }

    function handleFilterOutClick() {
        setInput(prevInput => prevInput + "\n" + "if: '$1' \nthen: '$2'");
        setShowExtraButtons(true);
        setShowFilters(false);
    }

    function handleFilterInClick() {
        setInput(prevInput => prevInput + "\n" + "if: '$1' \nthen: '$2'");
        setShowExtraButtons(true);
        setShowFilters(false);
    }

    function handleRegexReplaceClick() {
        setInput(prevInput => prevInput + "\n" + "if: '$1' \nthen: '$2'");
        setShowExtraButtons(true);
        setShowFilters(false);
    }

    function handleFinalButtonClick(value) {
        if (value === 'if') {
            setInput(prevInput => prevInput.replace('$2', '\n  - if: \'$1\' \n    then: \'$2\''));
        } else if (value === 'finished') {
            setInput(prevInput => prevInput.replace('$2', '\ndo: filters/filter-out/filters/filter-in/actions/regex-replace'));
            setShowFinalButtons(false);
            setShowFilters(true);
        }
    }

    React.useEffect(() => {
        if (editorRef.current) {
            const state = editorRef.current.saveViewState();
            editorRef.current.setValue(input);
            editorRef.current.restoreViewState(state);
        }
    }, [input]);

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
                        <Editor
                            height="70vh"
                            theme="vs-dark"
                            defaultValue={input}
                            onChange={setInput}
                            onMount={handleEditorDidMount}
                            saveViewState
                        />
                    </div>

                    <div id="inside-catalogue"
                         className="w-2/5 h-1/2 m-auto bg-[#0B0B0B] flex flex-col justify-start items-center border-[#404040] rounded-lg border-2 p-6">
                        <div className="relative w-full flex justify-start mt-3">
                            <div
                                className="absolute top-1/2 w-full border-t-2 border-dotted border-white opacity-70"></div>
                            <p className="font-bold text-white z-10 bg-[#0B0B0B] px-2">Action</p>
                        </div>
                        {showFilters && <div className="flex justify-around w-full mt-3">
                            <div className="w-1/2 mb-3 h-20 rounded-lg border-2 m-3 mt-3"
                                 onClick={handleFilterOutClick}>
                                <p className="font-extrabold ml-3 mt-3">FILTER OUT</p>
                                <p className="ml-3">Filters an Event out</p>
                            </div>
                            <div className="w-1/2 h-20 rounded-lg border-2 m-3 mt-3 mb-3"
                                 onClick={handleFilterInClick}>
                                <p className="font-extrabold ml-3 mt-3">FILTER IN</p>
                                <p className="ml-3">Filters an Event in</p>
                            </div>
                        </div>}
                        {showFilters && <div className="w-full h-20 rounded-lg border-2 mt-3 mb-3"
                                             onClick={handleRegexReplaceClick}>
                            <p className="font-extrabold ml-3 mt-3">REGEX REPLACE</p>
                            <p className="ml-3">Replaces Text in an Event</p>
                        </div>}
                        {showExtraButtons && <div className="flex justify-around w-full mt-3">
                            <button className="w-1/2 mb-3 h-20 rounded-lg border-2 m-3 mt-3"
                                    onClick={() => handleExtraButtonClick('Lorem')}>
                                Lorem
                            </button>
                            <button className="w-1/2 h-20 rounded-lg border-2 m-3 mt-3 mb-3"
                                    onClick={() => handleExtraButtonClick('Ipsum')}>
                                Ipsum
                            </button>
                            <button className="w-full h-20 rounded-lg border-2 mt-3 mb-3"
                                    onClick={() => handleExtraButtonClick('Dolor')}>
                                Dolor
                            </button>
                        </div>}
                        {showFinalButtons && <div className="flex justify-around w-full mt-3">
                            <button className="w-1/2 h-20 rounded-lg border-2 m-3 mt-3"
                                    onClick={() => handleFinalButtonClick('if')}>
                                if
                            </button>
                            <button className="w-1/2 h-20 rounded-lg border-2 m-3 mt-3"
                                    onClick={() => handleFinalButtonClick('finished')}>
                                finished
                            </button>
                        </div>}
                    </div>
                </div>
            </div>

        </div>
    )
}
