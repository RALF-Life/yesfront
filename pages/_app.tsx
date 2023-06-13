import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {AuthContextProvider} from '../context/AuthContext'

export default function App({Component, pageProps}: AppProps) {
    return (
        <div className="bg-black overflow-auto">
            <AuthContextProvider>
                <Component {...pageProps} />
            </AuthContextProvider>
        </div>
    )
}
