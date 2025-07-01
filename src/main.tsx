import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { azureConfig } from './services/azureConfigLoader'

// Initialize Azure services
const initializeApp = async () => {
  try {
    await azureConfig.initialize()
    console.log('✅ Azure services initialized successfully')
  } catch (error) {
    console.warn('⚠️ Azure services initialization error:', error)
  }

  // Render the app after initialization attempt (even if it fails)
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  )
}

// Start initialization
initializeApp()