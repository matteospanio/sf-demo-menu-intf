import React from 'react'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import {  MultiSelectTheme } from 'chakra-multiselect'
import ReactDOM from 'react-dom/client'
import "./i18n.ts"
import App from './App.tsx'
import Loader from './components/Loader.tsx'

const theme = extendTheme({
  components: {
    MultiSelect: MultiSelectTheme
  }
})

const rootElement = document.getElementById('root')!
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <React.Suspense fallback={<Loader />}>
        <App />
      </React.Suspense>
    </ChakraProvider>
  </React.StrictMode>,
)