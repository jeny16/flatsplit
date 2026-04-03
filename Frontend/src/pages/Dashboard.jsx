import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownLeft, Calendar, Copy, User } from 'lucide-react'
import Loading from '../components/Loading'
import { useAuth } from '../context/AuthContext'
import '../styles/Dashboard.css'

const Dashboard = () => {
    const { user, token } = useAuth()
    const [summary, setSummary] = useState({
        totalOwedToUser: 0,
        totalUserOwes: 0,
        balance: 0,
        categoryData: []
    })
    const [flat, setFlat] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = { Authorization: `Bearer ${token}` }
                const apiUrl = import.meta.env.VITE_API_URL
                
                const [summaryRes, flatRes] = await Promise.all([
                    axios.get(`${apiUrl}/analytics/summary`, { headers }),
                    axios.get(`${apiUrl}/flats/me`, { headers })
                ])
                
                setSummary(summaryRes.data.data)
                setFlat(flatRes.data.data)
            } catch (err) {
                console.error('Error fetching dashboard data:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [token])

    const isRentWindow = () => {
        const day = new Date().getDate()
        return day >= 1 && day <= 5
    }

    if (loading) return <Loading message="Synchronizing Ledger..." />

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="dashboard-container"
        >
            <header className="dashboard-header">
                <div className="flex-between" style={{ marginBottom: '8px' }}>
                    <p className="visual-quiet">{flat?.name || 'Architectural Flat'}</p>
                    <div className="invite-badge-tonal">
                        <span className="visual-quiet" style={{ fontSize: '0.6rem', fontWeight: 800 }}>INVITE CODE</span>
                        <div className="flex-between" style={{ gap: '12px' }}>
                            <code style={{ fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em' }}>{flat?.inviteCode}</code>
                            <Copy size={14} className="visual-quiet" style={{ cursor: 'pointer' }} />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                    <h2 className="display-lg">₹{Math.abs(summary.balance).toLocaleString('en-IN')}</h2>
                    <span className={`balance-status ${summary.balance >= 0 ? 'status-surplus' : 'status-deficit'}`}>
                        {summary.balance >= 0 ? 'SURPLUS' : 'DEFICIT'}
                    </span>
                </div>
                <p className="visual-quiet">Current Position Overview</p>
            </header>

            {isRentWindow() && (
                <div className="card rent-alert">
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <Calendar size={32} />
                        <div>
                            <h4 style={{ color: 'white', marginBottom: '4px', fontSize: '1.1rem' }}>Monthly Rent Window Active</h4>
                            <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>1st-5th is for organizational harmony. Organize recurring bills.</p>
                        </div>
                    </div>
                </div>
            )}

            <section className="stats-grid">
                <div className="stat-card ghost-border">
                    <div className="accent-strip accent-debit"></div>
                    <div className="flex-between">
                        <span className="visual-quiet">DEBIT</span>
                        <ArrowDownLeft size={18} color="var(--error)" />
                    </div>
                    <h3 className="amount-display">₹{summary.totalUserOwes.toLocaleString('en-IN')}</h3>
                    <p className="visual-quiet" style={{ fontSize: '0.65rem' }}>TOTAL YOU OWE</p>
                </div>

                <div className="stat-card ghost-border">
                    <div className="accent-strip accent-credit"></div>
                    <div className="flex-between">
                        <span className="visual-quiet">CREDIT</span>
                        <ArrowUpRight size={18} color="var(--primary)" />
                    </div>
                    <h3 className="amount-display">₹{summary.totalOwedToUser.toLocaleString('en-IN')}</h3>
                    <p className="visual-quiet" style={{ fontSize: '0.65rem' }}>TOTAL OWED TO YOU</p>
                </div>
            </section>

            <section className="recent-activity">
                <div className="section-header">
                    <h3>Recent Transactions</h3>
                    <button className="btn-text" style={{ color: 'var(--primary)', fontWeight: 700, background: 'none', border: 'none', fontSize: '0.85rem' }}>View Ledger</button>
                </div>
                
                <div className="activity-list">
                    <div className="activity-item">
                        <div className="item-main">
                            <div className="category-chip">Utilities</div>
                            <div className="item-content">
                                <h4>Electricity Bill (March)</h4>
                                <p className="visual-quiet">Paid by Akshay • Split with 7 members</p>
                            </div>
                        </div>
                        <p className="amount-text amount-negative">₹145</p>
                    </div>

                    <div className="activity-item">
                        <div className="item-main">
                            <div className="category-chip" style={{ background: '#d0feda', color: '#006b55' }}>Food</div>
                            <div className="item-content">
                                <h4>Jio Mart Refreshments</h4>
                                <p className="visual-quiet">Paid by Jay M • 7 flatmates split</p>
                            </div>
                        </div>
                        <p className="amount-text amount-negative">₹45</p>
                    </div>
                    
                    <div className="activity-item">
                        <div className="item-main">
                            <div className="category-chip" style={{ background: '#d4e5f4', color: '#50606d' }}>Rent</div>
                            <div className="item-content">
                                <h4>Base Maintenance</h4>
                                <p className="visual-quiet">Monthly reoccurring fee</p>
                            </div>
                        </div>
                        <p className="amount-text">₹2,500</p>
                    </div>
                </div>
            </section>

            <section className="flatmates-preview" style={{ marginTop: 'var(--space-xl)' }}>
                <div className="section-header">
                    <h3>Flatmates</h3>
                    <span className="visual-quiet">{flat?.members?.length || 0} Members</span>
                </div>
                <div className="card bg-subtle" style={{ padding: '0', display: 'flex', gap: '12px', padding: '16px', overflowX: 'auto' }}>
                    {flat?.members?.map(m => (
                        <div key={m._id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '70px', gap: '8px' }}>
                            <img src={m.avatar} alt="" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--surface-high)' }} />
                            <p className="visual-quiet" style={{ fontSize: '0.65rem' }}>{m.name.split(' ')[0]}</p>
                        </div>
                    ))}
                </div>
            </section>
        </motion.div>
    )
}

export default Dashboard
