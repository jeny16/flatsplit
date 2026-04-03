import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ExpensesList from './pages/ExpensesList'
import Analytics from './pages/Analytics'
import Balances from './pages/Balances'
import Layout from './components/Layout'
import FlatSetup from './pages/FlatSetup'

function App() {
  const { isAuthenticated, hasFlat, loading } = useAuth();

  if (loading) return null; // Or a loading spinner

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />

        {/* Onboarding Route */}
        <Route path="/setup" element={isAuthenticated ? (!hasFlat ? <FlatSetup /> : <Navigate to="/dashboard" />) : <Navigate to="/login" />} />

        {/* Private Routes - Only accessible if user has a flat */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={isAuthenticated ? (hasFlat ? <Dashboard /> : <Navigate to="/setup" />) : <Navigate to="/login" />} />
          <Route path="/expenses" element={isAuthenticated ? (hasFlat ? <ExpensesList /> : <Navigate to="/setup" />) : <Navigate to="/login" />} />
          <Route path="/analytics" element={isAuthenticated ? (hasFlat ? <Analytics /> : <Navigate to="/setup" />) : <Navigate to="/login" />} />
          <Route path="/balances" element={isAuthenticated ? (hasFlat ? <Balances /> : <Navigate to="/setup" />) : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
