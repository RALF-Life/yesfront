import Head from 'next/head'
import Link from 'next/link'
import React from 'react';
import Editor, {DiffEditor, useMonaco, loader} from '@monaco-editor/react';


let editorValue = String("tasted");
const handleDivClick = (eventText: string) => {
}
export default function Flows() {
    return (

        <div className=" h-screen">
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
                <div className="h-screen w flex justify-around items-center text-white">
                    <div className="w-1/2 ml-4">
                        <Editor height="45vh" defaultLanguage="yaml" theme="vs-dark"
                                value={editorValue}/>
                    </div>

                    <div id="inside-catalogue"
                         className="w-1/4 h-1/2 m-auto bg-[#0B0B0B] flex flex-col justify-start items-center border-[#404040] rounded-lg border-2 p-6 mr-24">
                        <div className="flex justify-around w-full">
                            <div className="w-1/2 mb-3 h-20 rounded-lg border-2 m-3"
                                 onClick={() => handleDivClick('FILTER OUT div clicked')}>
                                <p className="font-extrabold ml-3 mt-3">FILTER OUT</p>
                                <p className="ml-3">Filters an Event out</p>
                            </div>
                            <div className="w-1/2 h-20 rounded-lg border-2 m-3"
                                 onClick={() => handleDivClick('FILTER IN div clicked')}>
                                <p className="font-extrabold ml-3 mt-3">FILTER IN</p>
                                <p className="ml-3">Filters an Event in</p>
                            </div>
                        </div>
                        <div className="w-full h-20 rounded-lg border-2 m-3 mt-6"
                             onClick={() => handleDivClick('REGEX REPLACE div clicked')}>
                            <p className="font-extrabold ml-3 mt-3">REGEX REPLACE</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
