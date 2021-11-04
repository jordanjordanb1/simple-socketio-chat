import type { AppProps } from 'next/app'
import 'tailwindcss/tailwind.css'

function App({ Component, pageProps }: AppProps) {
  return (
    <div className="w-screen h-auto min-h-screen bg-blue-50">
      <Component {...pageProps} />
    </div>
  )
}

export default App
