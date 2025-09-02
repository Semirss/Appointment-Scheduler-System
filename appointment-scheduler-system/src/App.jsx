import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AppointmentBooking from '../UserFrontend/User'
import Admin from '../AdminPages/Admin'
import EnhancedAdmin from '../AdminPages/EnhancedAdmin'
import AdvancedLogin from '../AdminPages/Adminlogin'
import Login from '../AdminPages/Adminlogin'

function App() {
  const [count, setCount] = useState(0)
  
  // Check if user is authenticated (you can enhance this with context/state management)
  const isAuthenticated = localStorage.getItem('admin') || sessionStorage.getItem('admin')

  return (
    <Router>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Login route */}
        <Route path="/login" element={<Login/>} />
        
        {/* Protected route - only accessible when authenticated */}
        <Route 
          path="/admin" 
          element={isAuthenticated ? <EnhancedAdmin /> : <Navigate to="/login" replace />} 
        />
        
        {/* Other routes */}
        <Route path="/booking" element={<AppointmentBooking />} />
        <Route path="/basic-admin" element={<Admin />} />
      </Routes>
    </Router>
  )
}

export default App