import { useState } from 'react';
import { motion } from 'framer-motion';
import CosmicCanvas from '../3d/CosmicCanvas';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';
import GlowButton from '../components/GlowButton';

const FEATURES = [
    { icon: '🪐', title: 'Vedic Kundli', desc: 'Precise birth chart with planetary positions, houses, and aspects calculated from authentic Vedic algorithms.' },
    { icon: '⏳', title: 'Mahadasha', desc: 'Unlock your life timeline with Vimshottari Dasha periods — know which planetary era is shaping your destiny.' },
    { icon: '✨', title: 'Cosmic History', desc: 'All your generated charts saved and accessible anytime. Your cosmic journey, documented.' },
];

export default function LandingPage() {
    const [authOpen, setAuthOpen] = useState(false);

    return (
        <div className="relative min-h-screen bg-cosmic-gradient overflow-hidden">
            {/* 3D Background */}
            <CosmicCanvas />

            {/* Navbar */}
            <Navbar onAuthClick={() => setAuthOpen(true)} />

            {/* Auth Modal */}
            <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

            {/* Hero Section */}
            <div className="content-layer min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16">
                {/* Main heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="font-cinzel text-5xl sm:text-7xl font-bold text-center leading-tight mb-6">
                    <span className="text-gradient">Decode Your</span>
                    <br />
                    <span className="text-white">Cosmic Blueprint</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="text-star-white/60 text-lg sm:text-xl text-center max-w-2xl mb-12 leading-relaxed">
                    Generate your Vedic Kundli and Mahadasha reports instantly.
                    Precision astrology backed by authentic calculations.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 items-center mb-24">
                    <GlowButton onClick={() => setAuthOpen(true)}>
                        Begin Your Reading ✦
                    </GlowButton>
                    <GlowButton variant="ghost" onClick={() => setAuthOpen(true)}>
                        Learn More →
                    </GlowButton>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="flex gap-12 mb-24">
                    {[['99.9%', 'Uptime'], ['10M+', 'Charts Generated'], ['150+', 'Countries']].map(([num, label]) => (
                        <div key={label} className="text-center">
                            <p className="text-gradient-gold font-cinzel text-2xl font-bold">{num}</p>
                            <p className="text-star-white/50 text-xs uppercase tracking-widest mt-1">{label}</p>
                        </div>
                    ))}
                </motion.div>

                {/* Feature cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
                    {FEATURES.map((f, i) => (
                        <motion.div key={f.title}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.0 + i * 0.15, duration: 0.6 }}
                            className="glass rounded-2xl p-6 neon-border hover:border-violet-500/40 transition-colors group">
                            <span className="text-4xl mb-4 block">{f.icon}</span>
                            <h3 className="font-cinzel font-semibold text-white text-lg mb-2">{f.title}</h3>
                            <p className="text-star-white/60 text-sm leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Bottom gradient fade */}
            <div className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none z-10
                      bg-gradient-to-t from-midnight to-transparent" />
        </div>
    );
}
