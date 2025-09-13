import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import EnhancedAdmin from '../AdminPages/EnhancedAdmin'
import Login from '../AdminPages/Adminlogin'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = () => {
    const authStatus = localStorage.getItem('admin') || sessionStorage.getItem('admin')
    setIsAuthenticated(!!authStatus)
    setIsLoading(false)
  }

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('admin')
    sessionStorage.removeItem('admin')
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground mt-2">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        {/* Redirect root to appropriate page based on auth status */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/admin" replace /> : <Navigate to="/login" replace />} 
        />
        
        {/* Login route */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
            <Navigate to="/admin" replace /> : 
            <Login onLogin={handleLogin} />
          } 
        />
        
        {/* Protected routes */}
        <Route 
          path="/admin/*" 
          element={
            isAuthenticated ? 
            <EnhancedAdmin onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } 
        />
        
        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}
export default App