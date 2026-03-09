import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onAuthClick }) {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="fixed top-0 left-0 right-0 z-50 glass-dark"
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <span className="text-2xl">✦</span>
                    <span className="font-cinzel font-bold text-xl text-gradient">AstroGuru</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {isAuthenticated && (
                        <>
                            <NavLink to="/dashboard">Dashboard</NavLink>
                            <NavLink to="/kundli">Kundli</NavLink>
                            <NavLink to="/mahadasha">Mahadasha</NavLink>
                        </>
                    )}
                </div>

                {/* Auth Controls */}
                <div className="hidden md:flex items-center gap-4">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <span className="text-star-white/60 text-sm">
                                {user?.name || user?.email}
                            </span>
                            <button onClick={handleLogout}
                                className="px-5 py-2 rounded-full text-sm font-semibold text-violet-300
                           border border-violet-500/30 hover:bg-violet-500/10 transition-colors">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button onClick={onAuthClick}
                            className="px-6 py-2.5 rounded-full text-sm font-semibold bg-violet-600
                         hover:bg-violet-500 text-white border border-violet-400/30 transition-colors
                         shadow-lg shadow-violet-500/20">
                            Get Started
                        </button>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden text-star-white text-2xl">
                    {menuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="md:hidden glass-dark border-t border-white/5 px-6 py-4 flex flex-col gap-4">
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-star-white/80 hover:text-white">Dashboard</Link>
                            <Link to="/kundli" onClick={() => setMenuOpen(false)} className="text-star-white/80 hover:text-white">Kundli</Link>
                            <Link to="/mahadasha" onClick={() => setMenuOpen(false)} className="text-star-white/80 hover:text-white">Mahadasha</Link>
                            <button onClick={handleLogout} className="text-left text-violet-400 hover:text-violet-300">Logout</button>
                        </>
                    ) : (
                        <button onClick={() => { setMenuOpen(false); onAuthClick(); }}
                            className="text-left text-violet-400 hover:text-violet-300 font-semibold">
                            Get Started →
                        </button>
                    )}
                </motion.div>
            )}
        </motion.nav>
    );
}

function NavLink({ to, children }) {
    return (
        <Link to={to}
            className="text-star-white/70 hover:text-star-white text-sm font-medium
                 transition-colors hover:text-gradient relative group">
            {children}
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-violet-500 to-cyan-400
                       group-hover:w-full transition-all duration-300" />
        </Link>
    );
}
