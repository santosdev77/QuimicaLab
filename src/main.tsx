import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthProvider } from "./auth/AuthContext"
import { ProgressProvider } from "./progress/ProgressContext"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider><ProgressProvider><App /></ProgressProvider></AuthProvider>
  </React.StrictMode>,
)
