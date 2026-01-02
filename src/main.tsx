import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import ReactDOM from 'react-dom/client'
import "./i18n.ts"
import App from './App.tsx'
import { Loader } from './shared/ui'
import { AuthProvider } from './features/auth'
import theme from './theme.ts'

const rootElement = document.getElementById('root')!
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <React.Suspense fallback={<Loader />}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </React.Suspense>
    </ChakraProvider>
  </React.StrictMode>,
)
