import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Plus, Users, ArrowRight, ShieldCheck } from 'lucide-react'
import Loading from '../components/Loading'
import { useAuth } from '../context/AuthContext'
import '../styles/Auth.css'

const FlatSetup = () => {
    const { user, token, updateUser } = useAuth()
    const navigate = useNavigate()
    const [view, setView] = useState('choice') 
    const [formData, setFormData] = useState({
        name: '',
        inviteCode: '',
        rentAmount: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleAction = async (type) => {
        setLoading(true)
        setError('')

        try {
            let res;
            const apiUrl = import.meta.env.VITE_API_URL
            const headers = { Authorization: `Bearer ${token}` }

            if (type === 'create') {
                res = await axios.post(`${apiUrl}/flats`, {
                    name: formData.name,
                    rentAmount: formData.rentAmount || 0
                }, { headers })
            } else {
                res = await axios.post(`${apiUrl}/flats/join`, {
                    inviteCode: formData.inviteCode
                }, { headers })
            }

            // Update local user data with new flat ID
            const updatedUser = { ...user, flat: res.data.data._id }
            updateUser(updatedUser)

            // Redirect to dashboard
            navigate('/dashboard')
        } catch (err) {
            setError(err.response?.data?.message || 'Action failed. Please check inputs.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card card shadow-lg" style={{ maxWidth: '450px' }}>
                <div className="auth-header">
                    <h1>FlatSplit</h1>
                    <p>Onboarding is the first step of architectural harmony.</p>
                </div>

                {view === 'choice' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="setup-choices">
                        <div className="card choice-card bg-subtle" onClick={() => setView('create')} style={{ cursor: 'pointer', marginBottom: '16px', padding: '24px' }}>
                            <div className="flex-between">
                                <div>
                                    <h3 style={{ marginBottom: '4px' }}>Establish a New Flat</h3>
                                    <p className="visual-quiet">Become the admin of a new ledger.</p>
                                </div>
                                <Plus size={32} color="var(--primary)" />
                            </div>
                        </div>

                        <div className="card choice-card bg-subtle" onClick={() => setView('join')} style={{ cursor: 'pointer', padding: '24px' }}>
                            <div className="flex-between">
                                <div>
                                    <h3 style={{ marginBottom: '4px' }}>Join Existing Flat</h3>
                                    <p className="visual-quiet">Enter an invite code from flatmates.</p>
                                </div>
                                <Users size={32} color="var(--primary)" />
                            </div>
                        </div>
                    </motion.div>
                )}

                {view === 'create' && (
                    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <form onSubmit={(e) => { e.preventDefault(); handleAction('create'); }}>
                            <div className="form-group">
                                <label>FLAT NAME / ORGANIZATION</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    placeholder="e.g. Green Valley A-101" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>MONTHLY RENT (OPTIONAL)</label>
                                <input 
                                    type="number" 
                                    className="form-input" 
                                    placeholder="Total flat rent"
                                    value={formData.rentAmount}
                                    onChange={(e) => setFormData({...formData, rentAmount: e.target.value})}
                                />
                            </div>
                            {error && <p className="error-message">{error}</p>}
                            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={loading}>
                                {loading ? 'INITIALIZING...' : 'CREATE & PROCEED'}
                            </button>
                            <button type="button" className="btn-text" style={{ width: '100%', marginTop: '12px' }} onClick={() => setView('choice')}>Go Back</button>
                        </form>
                    </motion.div>
                )}

                {view === 'join' && (
                    <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <form onSubmit={(e) => { e.preventDefault(); handleAction('join'); }}>
                            <div className="form-group">
                                <label>ENTER INVITE CODE</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    placeholder="e.g. FLAT-X92B" 
                                    value={formData.inviteCode}
                                    onChange={(e) => setFormData({...formData, inviteCode: e.target.value})}
                                    required
                                />
                            </div>
                            {error && <p className="error-message" style={{ color: 'var(--error)', marginBottom: '10px' }}>{error}</p>}
                            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={loading}>
                                {loading ? 'VALIDATING...' : 'JOIN FLAT'}
                            </button>
                            <button type="button" className="btn-text" style={{ width: '100%', marginTop: '12px' }} onClick={() => setView('choice')}>Go Back</button>
                        </form>
                    </motion.div>
                )}

                <div className="auth-footer" style={{ marginTop: '24px', opacity: 0.7 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <ShieldCheck size={16} />
                        <span className="visual-quiet" style={{ fontSize: '0.7rem' }}>Multi-Tenant Data Encryption Active</span>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .choice-card:hover {
                    background-color: var(--surface-high);
                    transform: scale(1.02);
                }
                .error-message {
                    color: var(--error);
                    font-size: 0.8rem;
                    text-align: center;
                }
            `}</style>
        </div>
    )
}

export default FlatSetup
