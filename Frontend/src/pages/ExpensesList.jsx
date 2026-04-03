import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Plus, Search, Filter } from 'lucide-react'
import AddExpenseModal from '../components/AddExpenseModal'
import Loading, { SkeletonCard } from '../components/Loading'
import { useAuth } from '../context/AuthContext'
import '../styles/Dashboard.css'
import '../styles/Expenses.css'

const ExpensesList = () => {
    const { token } = useAuth()
    const [expenses, setExpenses] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const fetchExpenses = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/expenses`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setExpenses(res.data.data)
        } catch (err) {
            console.error('Error fetching expenses:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchExpenses()
    }, [token])

    if (loading) return (
        <div className="expenses-container">
            <header className="page-header" style={{ marginBottom: 'var(--space-xl)' }}>
                <h2 className="display-lg" style={{ fontSize: '2rem' }}>All Bills</h2>
                <div className="shimmer" style={{ width: '40%', height: '16px', borderRadius: '4px', marginTop: '8px' }}></div>
            </header>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
        </div>
    )

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="expenses-container"
        >
            <header className="page-header flex-between" style={{ marginBottom: 'var(--space-xl)' }}>
                <div>
                    <h2 className="display-lg" style={{ fontSize: '2rem' }}>All Bills</h2>
                    <p className="visual-quiet">Chronological record of flat spends.</p>
                </div>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ width: '48px', height: '48px', borderRadius: '16px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus size={24} />
                </button>
            </header>

            <div className="search-bar card ghost-border" style={{ padding: '0 20px', height: '56px', backgroundColor: 'var(--surface-low)', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-lg)' }}>
                <Search size={18} className="visual-quiet" />
                <input type="text" placeholder="Search architectural record..." className="search-input" style={{ flex: 1, background: 'none', border: 'none', fontStyle: 'italic' }} />
                <Filter size={18} className="visual-quiet" />
            </div>

            <div className="expenses-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {expenses.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
                        <p className="visual-quiet">The ledger is empty. Start your architectural journey.</p>
                    </div>
                ) : (
                    expenses.slice().reverse().map(expense => (
                        <div key={expense._id} className="card activity-item ghost-border" style={{ backgroundColor: 'var(--surface-low)', padding: '16px 20px' }}>
                            <div className="flex-between">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div className="category-chip" style={{ 
                                        backgroundColor: expense.category === 'Food' ? '#d0feda' : expense.category === 'Utilities' ? '#e8deff' : '#d4e5f4',
                                        color: expense.category === 'Food' ? '#006b55' : expense.category === 'Utilities' ? '#6833ea' : '#50606d'
                                    }}>
                                        {expense.category}
                                    </div>
                                    <div>
                                        <h4 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--on-surface)' }}>{expense.title}</h4>
                                        <p className="visual-quiet" style={{ fontSize: '0.7rem' }}>
                                            By {expense.payer?.name} • {new Date(expense.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="amount-text" style={{ fontSize: '1.2rem', fontWeight: 800 }}>₹{expense.amount.toLocaleString('en-IN')}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <AddExpenseModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onRefresh={fetchExpenses}
            />
        </motion.div>
    )
}

export default ExpensesList
