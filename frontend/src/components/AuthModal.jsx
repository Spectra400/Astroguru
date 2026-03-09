import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlowButton from './GlowButton';
import LoadingSpinner from './LoadingSpinner';

export default function AuthModal({ isOpen, onClose }) {
    const [tab, setTab] = useState('login');
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (tab === 'login') {
                await login({ email: form.email, password: form.password });
            } else {
                await register({ name: form.name, email: form.email, password: form.password });
            }
            onClose();
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="w-full max-w-md glass rounded-3xl p-8 shadow-2xl neon-border pointer-events-auto">

                            {/* Header */}
                            <div className="text-center mb-8">
                                <span className="text-4xl mb-3 block">✦</span>
                                <h2 className="font-cinzel text-2xl font-bold text-gradient mb-1">
                                    {tab === 'login' ? 'Welcome Back' : 'Begin Your Journey'}
                                </h2>
                                <p className="text-star-white/50 text-sm">
                                    {tab === 'login' ? 'Sign in to access your cosmic insights' : 'Create your account to unlock the cosmos'}
                                </p>
                            </div>

                            {/* Tabs */}
                            <div className="flex rounded-full glass p-1 mb-6">
                                {['login', 'register'].map((t) => (
                                    <button key={t} onClick={() => { setTab(t); setError(''); }}
                                        className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${tab === t
                                                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                                                : 'text-star-white/60 hover:text-white'
                                            }`}>
                                        {t === 'login' ? 'Sign In' : 'Register'}
                                    </button>
                                ))}
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <AnimatePresence mode="wait">
                                    {tab === 'register' && (
                                        <motion.div key="name-field"
                                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                                            <InputField name="name" placeholder="Full Name" value={form.name}
                                                onChange={handleChange} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <InputField name="email" type="email" placeholder="Email Address"
                                    value={form.email} onChange={handleChange} />
                                <InputField name="password" type="password" placeholder="Password"
                                    value={form.password} onChange={handleChange} />

                                {/* Error */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            className="text-red-400 text-sm bg-red-500/10 border border-red-500/20
                                 rounded-xl px-4 py-2 text-center">
                                            {error}
                                        </motion.p>
                                    )}
                                </AnimatePresence>

                                <GlowButton type="submit" disabled={loading} className="w-full justify-center">
                                    {loading
                                        ? <LoadingSpinner size="sm" />
                                        : tab === 'login' ? 'Sign In →' : 'Create Account →'
                                    }
                                </GlowButton>
                            </form>

                            {/* Close */}
                            <button onClick={onClose}
                                className="absolute top-4 right-5 text-star-white/40 hover:text-white text-xl transition-colors">
                                ✕
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function InputField({ name, type = 'text', placeholder, value, onChange }) {
    return (
        <input
            name={name} type={type} placeholder={placeholder} value={value}
            onChange={onChange} required autoComplete="off"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white
                 placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/60
                 focus:bg-white/8 transition-all duration-200"
        />
    );
}
