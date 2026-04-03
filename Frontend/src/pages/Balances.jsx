import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { ShieldCheck, ArrowRight, CheckCircle } from 'lucide-react'
import Loading from '../components/Loading'
import { useAuth } from '../context/AuthContext'
import '../styles/Dashboard.css'

const Balances = () => {
    const { token } = useAuth()
    const [balances, setBalances] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBalances = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/analytics/balances`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setBalances(res.data.data)
            } catch (err) {
                console.error('Error fetching balances:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchBalances()
    }, [token])

    if (loading) return <Loading message="Validating Cryptographic Ledger..." />

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="balances-container"
        >
            <header className="page-header" style={{ marginBottom: 'var(--space-xl)' }}>
                <h2 className="display-lg" style={{ fontSize: '2rem', marginBottom: '8px' }}>Global Positions</h2>
                <p className="visual-quiet">Settlement architecture for the J26 ecosystem.</p>
            </header>

            <div className="balances-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {balances.map(user => (
                    <div key={user.id} className="card ghost-border" style={{ 
                        backgroundColor: 'var(--surface-low)', 
                        padding: '24px', 
                        position: 'relative'
                    }}>
                        <div className="flex-between">
                            <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <img 
                                    src={user.avatar} 
                                    alt={user.name} 
                                    style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', background: 'var(--surface-high)' }}
                                />
                                <div>
                                    <h4 style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--on-surface)' }}>{user.name}</h4>
                                    <p className="visual-quiet" style={{ fontSize: '0.75rem' }}>{user.role}</p>
                                </div>
                            </div>
                            <div className="balance-info" style={{ textAlign: 'right' }}>
                                <p className="visual-quiet" style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem', marginBottom: '4px' }}>
                                    {user.netBalance >= 0 ? 'CREDIT' : 'DEBIT'}
                                </p>
                                <p className="amount" style={{ 
                                    fontWeight: 800, 
                                    fontSize: '1.5rem', 
                                    fontFamily: 'var(--font-display)',
                                    color: user.netBalance >= 0 ? 'var(--primary)' : 'var(--error)' 
                                }}>
                                    ₹{Math.abs(user.netBalance).toLocaleString('en-IN')}
                                </p>
                            </div>
                        </div>
                        
                        {user.netBalance < 0 && (
                            <button className="btn-primary" style={{ width: '100%', marginTop: '24px', height: '48px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                ORGANIZE SETTLEMENT
                            </button>
                        )}
                        
                        {user.netBalance >= 0 && (
                          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                             <CheckCircle size={14} color="var(--primary)" />
                             <span className="visual-quiet" style={{ fontSize: '0.7rem' }}>Surplus confirmed in ledger.</span>
                          </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="card" style={{ marginTop: 'var(--space-xl)', background: 'var(--on-surface)', color: 'white', display: 'flex', gap: '20px', alignItems: 'center', padding: '32px' }}>
                <ShieldCheck size={32} color="var(--primary-container)" />
                <div>
                   <h4 style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem' }}>Cryptographic Verification Enabled</h4>
                   <p style={{ opacity: 0.7, fontSize: '0.8rem' }}>All settlements are cross-referenced across the J26 shivdhara archival record for audit integrity.</p>
                </div>
            </div>
        </motion.div>
    )
}

export default Balances
