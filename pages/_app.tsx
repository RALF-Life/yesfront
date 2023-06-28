import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthContextProvider } from '../context/AuthContext'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <div className="bg-slate-950 h-screen overflow-auto">
            <AuthContextProvider>
                <Component {...pageProps} />
            </AuthContextProvider>
        </div>
    )
}
