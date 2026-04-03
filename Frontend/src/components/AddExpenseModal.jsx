import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Info, CreditCard } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import '../styles/Modal.css'

const AddExpenseModal = ({ isOpen, onClose, onRefresh }) => {
    const { token } = useAuth()
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: 'Food',
        notes: ''
    })
    const [loading, setLoading] = useState(false)
    const [members, setMembers] = useState([])

    useEffect(() => {
        const fetchFlatDetails = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/flats/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setMembers(res.data.data.members)
            } catch (err) {
                console.error('Error fetching flat members:', err)
            }
        }
        if (isOpen) fetchFlatDetails()
    }, [isOpen, token])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const perPersonAmount = parseFloat(formData.amount) / members.length
            const splits = members.map(m => ({
                user: m._id,
                amount: perPersonAmount
            }))

            await axios.post(`${import.meta.env.VITE_API_URL}/expenses`, 
                { ...formData, amount: parseFloat(formData.amount), splits },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            
            onRefresh()
            onClose()
            setFormData({ title: '', amount: '', category: 'Food', notes: '' })
        } catch (err) {
            console.error('Error creating expense:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="modal-overlay glass"
                        style={{ backgroundColor: 'rgba(24, 28, 28, 0.4)' }}
                    />
                    <motion.div 
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="modal-content"
                        style={{ 
                          position: 'fixed', 
                          bottom: 0, 
                          left: 0, 
                          right: 0, 
                          zIndex: 1001, 
                          backgroundColor: 'var(--surface)', 
                          borderTopLeftRadius: '40px', 
                          borderTopRightRadius: '40px', 
                          padding: '32px',
                          boxShadow: '0 -20px 60px rgba(0,0,0,0.1)'
                        }}
                    >
                        <header className="flex-between" style={{ marginBottom: '32px' }}>
                            <div>
                                <h2 className="display-lg" style={{ fontSize: '1.75rem' }}>Add New Bill</h2>
                                <p className="visual-quiet">Injecting structural data into J26.</p>
                            </div>
                            <button onClick={onClose} className="btn-logout" style={{ background: 'var(--surface-high)', borderRadius: '12px', width: '44px', height: '44px' }}>
                                <X size={24} />
                            </button>
                        </header>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div className="form-group">
                                <label>ARCHITECTURAL DESCRIPTION</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    style={{ fontSize: '1.1rem', fontWeight: 700 }}
                                    placeholder="e.g. Jio Mart, BigBasket" 
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>EXACT AMOUNT</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--on-surface-variant)' }}>₹</span>
                                    <input 
                                        type="number" 
                                        className="form-input" 
                                        style={{ paddingLeft: '44px', fontSize: '2.5rem', height: '80px', fontWeight: 800, fontFamily: 'var(--font-display)' }}
                                        placeholder="0.00"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>CATEGORY</label>
                                    <select 
                                        className="form-input"
                                        style={{ height: '56px', fontWeight: 700 }}
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    >
                                        <option value="Food">Food / Dining</option>
                                        <option value="Rent">Rent / Home</option>
                                        <option value="Utilities">Utilities / Bills</option>
                                        <option value="Leisure">Leisure / Fun</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="card bg-subtle" style={{ background: 'var(--surface-high)', padding: '20px', borderRadius: '20px' }}>
                                <div className="flex-between">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <Info size={18} color="var(--primary)" />
                                        <p className="visual-quiet" style={{ fontWeight: 700, fontSize: '0.8rem' }}>Dividing equally across 7 members.</p>
                                    </div>
                                    <p className="amount" style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                                      {formData.amount > 0 ? `₹${(formData.amount / (members.length || 7)).toFixed(2)}/ea` : '₹0.00'}
                                    </p>
                                </div>
                            </div>

                            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', height: '64px', fontSize: '1rem', marginTop: '16px' }}>
                                {loading ? 'CALCULATING SYNC...' : 'INITIALIZE TRANSACTION'}
                            </button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default AddExpenseModal
