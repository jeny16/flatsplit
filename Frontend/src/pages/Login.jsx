import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import { ShieldCheck, ArrowRight } from 'lucide-react'
import '../styles/Auth.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      
      if (res.data.user.flat) {
        navigate('/dashboard')
      } else {
        navigate('/setup')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container" style={{ background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px' }}>
      <motion.div 
        initial={{ opacity: 0, y: 12 }} 
        animate={{ opacity: 1, y: 0 }}
        className="auth-card" 
        style={{ 
          maxWidth: '440px', 
          width: '100%', 
          backgroundColor: 'var(--surface-low)', 
          padding: '48px', 
          borderRadius: '40px', 
          boxShadow: 'var(--shadow-ambient)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'linear-gradient(90deg, var(--primary) 0%, var(--primary-container) 100%)' }}></div>
        
        <header style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 className="logo-text" style={{ fontSize: '1.75rem', marginBottom: '8px' }}>FlatSplit</h1>
          <p className="visual-quiet" style={{ fontSize: '0.85rem' }}>Welcome to the Architectural Record.</p>
        </header>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="form-group">
            <label>ARCHIVAL EMAIL</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="e.g. jeny@flatsplit.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div className="flex-between" style={{ marginBottom: '8px' }}>
              <label style={{ marginBottom: 0 }}>SECURITY KEY</label>
              <Link to="/forgot" className="visual-quiet" style={{ fontSize: '0.7rem' }}>FORGOT KEY?</Link>
            </div>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p style={{ color: 'var(--error)', fontSize: '0.8rem', textAlign: 'center' }}>{error}</p>}

          <button type="submit" className="btn-primary" style={{ height: '60px', marginTop: '12px', fontSize: '1rem' }} disabled={loading}>
            {loading ? 'VALIDATING SESSION...' : 'ACCESS LEDGER'}
          </button>
        </form>

        <footer style={{ marginTop: '40px', textAlign: 'center' }}>
          <p className="visual-quiet" style={{ marginBottom: '16px' }}>New to J26 Shivdhara?</p>
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 800, textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            CREATE ARCHIVAL ACCOUNT <ArrowRight size={16} />
          </Link>
          
          <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: 0.6 }}>
            <ShieldCheck size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>End-to-End Encryption Active</span>
          </div>
        </footer>
      </motion.div>
    </div>
  )
}

export default Login
