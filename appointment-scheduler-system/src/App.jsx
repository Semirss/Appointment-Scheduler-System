import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import EnhancedAdmin from '../AdminPages/EnhancedAdmin'
import Login from '../AdminPages/Adminlogin'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Check authentication status on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem('admin') || sessionStorage.getItem('admin')
    setIsAuthenticated(!!authStatus)
  }, [])

  return (
    <Router>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Login route */}
        <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
        
        {/* Protected routes - only accessible when authenticated */}
        <Route 
          path="/admin/*" 
          element={isAuthenticated ? <EnhancedAdmin onLogout={() => setIsAuthenticated(false)} /> : <Navigate to="/login" replace />} 
        />
        
        
        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App