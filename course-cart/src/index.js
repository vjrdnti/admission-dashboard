import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import BillingPage from './components/BillingPage'
import CollegeDashboard from './CollegeDashboard'
import LoginModal from './components/LoginModal'
import reportWebVitals from './reportWebVitals'
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
    	<Route path="*" element={<LoginModal />} exact />
        <Route path="/dashboard" element={<App />} />
        <Route path="/college-dashboard" element={<CollegeDashboard />} />
        <Route path="/billing" element={<BillingPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
