import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', hover = true }) {
    return (
        <motion.div
            whileHover={hover ? { y: -4, boxShadow: '0 20px 60px rgba(124,58,237,0.2)' } : {}}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`glass rounded-2xl p-6 ${className}`}
        >
            {children}
        </motion.div>
    );
}
