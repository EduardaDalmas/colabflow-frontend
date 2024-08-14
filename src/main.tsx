import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app'
import './globals.css'
import { AuthProvider } from './context/authProvider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)