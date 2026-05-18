import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'
import { UGFProvider } from '@tychilabs/react-ugf'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* UGFProvider enables the Universal Gas Framework hooks and components */}
    <UGFProvider>
      <App />
    </UGFProvider>
  </React.StrictMode>,
)
