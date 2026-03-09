import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import { useAuth } from '../context/AuthContext';
import { useBirthProfile } from '../context/BirthProfileContext';
import { useEffect } from 'react';

export default function Dashboard() {
    const { user } = useAuth();
    const { birthProfile, fetchBirthProfile, profileLoading } = useBirthProfile();

    // Fetch birth profile from DB on mount if not yet in context
    useEffect(() => {
        if (!birthProfile) fetchBirthProfile();
    }, []); // eslint-disable-line

    const hasBirthProfile = !!birthProfile?.date;

    return (
        <div className="min-h-screen bg-cosmic-gradient">
            <Navbar />
            <div className="content-layer max-w-6xl mx-auto px-6 pt-32 pb-16">

                {/* Welcome header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-10">
                    <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-2">
                        Your Cosmic Dashboard
                    </p>
                    <h1 className="font-cinzel text-4xl sm:text-5xl font-bold text-white">
                        Welcome, <span className="text-gradient">{user?.name || 'Stargazer'}</span>
                    </h1>
                    <p className="text-star-white/50 mt-3 text-lg">What would you like to explore today?</p>
                </motion.div>

                {/* Birth Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    className="mb-10">
                    <GlassCard className="neon-border" hover={false}>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex items-center gap-4 flex-1">
                                <span className="text-4xl">🌌</span>
                                <div>
                                    <p className="text-star-white/50 text-xs uppercase tracking-widest mb-1">
                                        Birth Profile
                                    </p>
                                    {profileLoading ? (
                                        <p className="text-white/40 text-sm animate-pulse">Loading profile…</p>
                                    ) : hasBirthProfile ? (
                                        <div className="flex flex-wrap gap-x-5 gap-y-1">
                                            <span className="text-white font-semibold">{birthProfile.place}</span>
                                            <span className="text-star-white/60 text-sm">{birthProfile.date}</span>
                                            <span className="text-star-white/60 text-sm">{birthProfile.time}</span>
                                            <span className="text-star-white/40 text-xs mt-0.5">{birthProfile.timezone}</span>
                                        </div>
                                    ) : (
                                        <p className="text-star-white/40 text-sm italic">
                                            No birth profile yet — generate your Kundli to save it.
                                        </p>
                                    )}
                                </div>
                            </div>
                            {hasBirthProfile && (
                                <Link to="/kundli">
                                    <GlowButton variant="violet" className="text-xs px-4 py-2">
                                        Edit / Regenerate ✦
                                    </GlowButton>
                                </Link>
                            )}
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Action cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {/* Kundli Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25, duration: 0.5 }}>
                        <Link to="/kundli">
                            <GlassCard className="bg-gradient-to-br from-violet-500/10 to-violet-900/5 h-full cursor-pointer hover:neon-border transition-all duration-300">
                                <span className="text-5xl mb-5 block">🪐</span>
                                <h2 className="font-cinzel font-bold text-xl text-white mb-3">Generate Kundli</h2>
                                <p className="text-star-white/60 text-sm leading-relaxed mb-6">
                                    Your complete Vedic birth chart with planetary positions and house details.
                                </p>
                                <GlowButton variant="violet" className="text-sm px-6 py-2.5">
                                    Open →
                                </GlowButton>
                            </GlassCard>
                        </Link>
                    </motion.div>

                    {/* Mahadasha Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.5 }}>
                        {hasBirthProfile ? (
                            <Link to="/mahadasha">
                                <GlassCard className="bg-gradient-to-br from-cyan-500/10 to-cyan-900/5 h-full cursor-pointer hover:neon-border-cyan transition-all duration-300">
                                    <span className="text-5xl mb-5 block">⏳</span>
                                    <h2 className="font-cinzel font-bold text-xl text-white mb-3">Mahadasha Report</h2>
                                    <p className="text-star-white/60 text-sm leading-relaxed mb-6">
                                        Explore your Vimshottari Dasha periods — the cosmic timeline of your life.
                                    </p>
                                    <GlowButton variant="cyan" className="text-sm px-6 py-2.5">Open →</GlowButton>
                                </GlassCard>
                            </Link>
                        ) : (
                            <GlassCard className="bg-gradient-to-br from-cyan-500/5 to-cyan-900/3 h-full opacity-50 cursor-not-allowed">
                                <span className="text-5xl mb-5 block grayscale">⏳</span>
                                <h2 className="font-cinzel font-bold text-xl text-white/50 mb-3">Mahadasha Report</h2>
                                <p className="text-star-white/40 text-sm leading-relaxed mb-6">
                                    Explore your Vimshottari Dasha periods — the cosmic timeline of your life.
                                </p>
                                <div className="text-xs text-cyan-400/60 bg-cyan-500/10 border border-cyan-500/20 rounded-xl px-3 py-2">
                                    ✦ Generate your Kundli first to unlock this
                                </div>
                            </GlassCard>
                        )}
                    </motion.div>
                </div>


                {/* Divider */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex-1 h-px bg-white/5" />
                    <span className="text-violet-500 text-lg">✦</span>
                    <div className="flex-1 h-px bg-white/5" />
                </div>

                {/* Quick tip */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                    className="glass rounded-2xl p-6 neon-border-cyan text-center">
                    <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-2">✦ Cosmic Tip</p>
                    <p className="text-star-white/70 text-sm leading-relaxed max-w-3xl mx-auto">
                        For the most accurate readings, ensure your birth date, time, and place are precise.
                        Even a few minutes difference in birth time can shift your Ascendant sign.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
