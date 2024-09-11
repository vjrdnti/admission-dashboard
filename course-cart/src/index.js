import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import BillingPage from './components/BillingPage'
import CollegeDashboard from './CollegeDashboard'
import AdminDashboard from './AdminDashboard'
import LoginModal from './components/LoginModal'
import reportWebVitals from './reportWebVitals'
import StudentTable from './components/StudentTable';

const root = ReactDOM.createRoot(document.getElementById('root'))
const currentUser = JSON.parse(localStorage.getItem('user'));

// Debugging: Check what is being retrieved from localStorage
console.log('Current User:', currentUser);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<LoginModal />} exact />
        <Route path="/dashboard" element={<App />} />
        <Route path="/college-dashboard" element={<CollegeDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/students" element={<StudentTable />} />
        <Route path="/billing" element={<BillingPage user={currentUser} />} /> {/* Use currentUser here */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)

reportWebVitals()
