import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'
// import { UGFProvider } from '@tychilabs/react-ugf' // Uncomment once package is available

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <UGFProvider> */}
      <App />
    {/* </UGFProvider> */}
  </React.StrictMode>,
)
