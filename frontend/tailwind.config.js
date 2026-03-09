/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'midnight': '#0a0118',
        'cosmic-purple': '#1a0533',
        'deep-space': '#0d0626',
        'neon-violet': '#7c3aed',
        'neon-cyan': '#06b6d4',
        'neon-pink': '#ec4899',
        'star-gold': '#f59e0b',
        'star-white': '#e2e8f0',
        'glass-white': 'rgba(255,255,255,0.05)',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        cinzel: ['Cinzel', 'serif'],
      },
      boxShadow: {
        'glow-violet': '0 0 20px #7c3aed, 0 0 60px rgba(124,58,237,0.3)',
        'glow-cyan': '0 0 20px #06b6d4, 0 0 60px rgba(6,182,212,0.3)',
        'glow-gold': '0 0 20px #f59e0b, 0 0 60px rgba(245,158,11,0.3)',
        'glass': '0 8px 32px rgba(0,0,0,0.4)',
      },
      backgroundImage: {
        'cosmic-gradient': 'radial-gradient(ellipse at top, #1a0533 0%, #0a0118 60%, #000 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(6,182,212,0.05) 100%)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px #7c3aed' },
          '50%': { boxShadow: '0 0 40px #7c3aed, 0 0 80px rgba(124,58,237,0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
};
