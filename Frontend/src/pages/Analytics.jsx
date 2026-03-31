import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { TrendingUp, BarChart3, PieChart } from 'lucide-react'
import Loading from '../components/Loading'
import '../styles/Dashboard.css'

const Analytics = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token')
                const res = await axios.get('http://localhost:5000/api/analytics/summary', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setData(res.data.data)
            } catch (err) {
                console.error('Error fetching analytics:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) return <Loading message="Analyzing Flat Architecture..." />

    if (!data) return <div className="loading">No archival data found.</div>

    const maxVal = Math.max(...data.categoryData.map(c => c.value), 1)

    return (
        <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="analytics-container"
        >
            <header className="page-header" style={{ marginBottom: 'var(--space-xl)' }}>
                <h2 className="display-lg" style={{ fontSize: '2rem', marginBottom: '8px' }}>Structural Insights</h2>
                <p className="visual-quiet">Visualizing the flow of resources within J26.</p>
            </header>

            <section className="analytics-summary" style={{ marginBottom: 'var(--space-xl)' }}>
                <div className="card" style={{ background: 'linear-gradient(135deg, #1B2B36 0%, #2D3131 100%)', color: 'white', padding: '32px', position: 'relative', overflow: 'hidden' }}>
                    <div className="flex-between">
                        <div>
                            <p className="visual-quiet" style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.65rem' }}>TOTAL NET POSITION</p>
                            <h3 className="display-lg" style={{ fontSize: '3rem', marginTop: '12px', color: 'white' }}>
                                ₹{data.balance.toLocaleString('en-IN')}
                            </h3>
                        </div>
                        <TrendingUp size={56} style={{ opacity: 0.2, color: 'var(--primary-container)', position: 'absolute', right: '20px', top: '20px' }} />
                    </div>
                    <div className="ghost-border" style={{ marginTop: '24px', paddingTop: '16px', display: 'flex', gap: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <div>
                            <p className="visual-quiet" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.6rem' }}>DEBIT SHARE</p>
                            <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>₹{data.totalUserOwes.toLocaleString('en-IN')}</p>
                        </div>
                        <div>
                            <p className="visual-quiet" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.6rem' }}>CREDIT SHARE</p>
                            <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>₹{data.totalOwedToUser.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="categorical-insights">
                <div className="section-header" style={{ marginBottom: 'var(--space-lg)' }}>
                    <h3 style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '1.1rem' }}>Spending by Category</h3>
                </div>
                <div className="card bg-subtle" style={{ padding: '32px' }}>
                    {data.categoryData.length === 0 ? (
                      <p className="visual-quiet" style={{ textAlign: 'center' }}>Analyze transactions to reveal structural distributions.</p>
                    ) : (
                      data.categoryData.map(cat => (
                        <div key={cat.name} className="chart-row" style={{ marginBottom: '24px' }}>
                            <div className="flex-between" style={{ marginBottom: '10px' }}>
                                <span className="cat-name" style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--on-surface)' }}>{cat.name}</span>
                                <span className="cat-value" style={{ fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>₹{cat.value.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="progress-bg" style={{ height: '10px', background: 'var(--surface-high)', borderRadius: '20px', overflow: 'hidden' }}>
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${(cat.value / maxVal) * 100}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.2, ease: 'circOut' }}
                                    style={{ 
                                        height: '100%', 
                                        background: cat.name === 'Food' ? 'var(--primary)' : cat.name === 'Utilities' ? 'var(--tertiary)' : 'var(--secondary)', 
                                        borderRadius: '20px' 
                                    }}
                                />
                            </div>
                        </div>
                      ))
                    )}
                </div>
            </section>

            <section className="efficiency-stats" style={{ marginTop: 'var(--space-xl)' }}>
                <div className="card ghost-border" style={{ background: 'var(--surface-low)', display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ background: 'var(--primary)', padding: '12px', borderRadius: '12px', color: 'white' }}>
                        <BarChart3 size={24} />
                    </div>
                    <div>
                        <h4 style={{ fontWeight: 800, fontSize: '1.1rem' }}>Flat Efficiency: Optimized</h4>
                        <p className="visual-quiet" style={{ fontSize: '0.8rem' }}>Spending is within the predicted architectural envelope for 2026.</p>
                    </div>
                </div>
            </section>
        </motion.div>
    )
}

export default Analytics
