import React, { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Home, PieChart, Users, Menu, LogOut, ChevronRight } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import '../styles/Layout.css'

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, token, logout } = useAuth()
    const [flatName, setFlatName] = useState('FlatSplit');

    useEffect(() => {
        const fetchFlat = async () => {
            if (user?.flat) {
                try {
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/flats/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setFlatName(res.data.data.name);
                } catch (err) {
                    console.error('Error fetching flat for layout:', err);
                }
            }
        };
        fetchFlat();
    }, [user?.flat, token]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('dashboard')) return 'Overview';
        if (path.includes('expenses')) return 'Bills';
        if (path.includes('analytics')) return 'Analytics';
        if (path.includes('balances')) return 'Settlements';
        return 'Overview';
    }

    return (
        <div className="layout-root">
            {/* Top Bar - Architectural Editorial */}
            <nav className="fixed-top">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h1 className="logo-text">FS</h1>
                    <ChevronRight size={14} className="visual-quiet" />
                    <span style={{ fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{flatName}</span>
                </div>
                <button className="btn-logout" onClick={handleLogout}>
                    <LogOut size={18} />
                </button>
            </nav>

            {/* Main Content Area */}
            <main className="main-content" style={{ paddingTop: '80px', paddingBottom: '160px' }}>
                <div className="container">
                    <header style={{ marginBottom: '24px' }}>
                        <h2 className="visual-quiet" style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{getPageTitle()}</h2>
                    </header>
                    <Outlet />
                </div>
            </main>

            <nav className="fixed-bottom">
                <div className="nav-container">
                    <NavLink to="/dashboard" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
                        <Home size={22} />
                        <span>Home</span>
                    </NavLink>
                    <NavLink to="/expenses" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
                        <Menu size={22} />
                        <span>Bills</span>
                    </NavLink>
                    <NavLink to="/analytics" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
                        <PieChart size={22} />
                        <span>Stats</span>
                    </NavLink>
                    <NavLink to="/balances" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
                        <Users size={22} />
                        <span>Settle</span>
                    </NavLink>
                </div>
            </nav>
        </div>
    )
}

export default Layout
