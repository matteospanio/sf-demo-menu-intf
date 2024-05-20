import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import ReactDOM from 'react-dom/client'
import "./i18n.ts"
import App from './App.tsx'
import Loader from './components/Loader.tsx'

const rootElement = document.getElementById('root')!
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <React.Suspense fallback={<Loader />}>
        <App />
      </React.Suspense>
    </ChakraProvider>
  </React.StrictMode>,
)