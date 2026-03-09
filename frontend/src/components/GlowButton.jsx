import { motion } from 'framer-motion';

export default function GlowButton({ children, onClick, variant = 'violet', type = 'button', disabled = false, className = '' }) {
    const variants = {
        violet: {
            base: 'bg-violet-600 border-violet-400/30 shadow-violet-500/30 hover:bg-violet-500',
            glow: '0 0 30px #7c3aed, 0 0 60px rgba(124,58,237,0.4)',
        },
        cyan: {
            base: 'bg-cyan-600 border-cyan-400/30 shadow-cyan-500/30 hover:bg-cyan-500',
            glow: '0 0 30px #06b6d4, 0 0 60px rgba(6,182,212,0.4)',
        },
        gold: {
            base: 'bg-amber-500 border-amber-400/30 shadow-amber-500/30 hover:bg-amber-400',
            glow: '0 0 30px #f59e0b, 0 0 60px rgba(245,158,11,0.4)',
        },
        ghost: {
            base: 'bg-white/5 border-white/10 hover:bg-white/10',
            glow: '0 0 20px rgba(124,58,237,0.2)',
        },
    };

    const v = variants[variant] || variants.violet;

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            whileHover={{ scale: disabled ? 1 : 1.04, boxShadow: disabled ? 'none' : v.glow }}
            whileTap={{ scale: disabled ? 1 : 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className={`px-8 py-3.5 rounded-full font-semibold text-white border
                  shadow-lg transition-colors duration-200 disabled:opacity-50
                  disabled:cursor-not-allowed ${v.base} ${className}`}
        >
            {children}
        </motion.button>
    );
}
