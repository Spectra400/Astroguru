import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BirthProfileProvider, useBirthProfile } from './context/BirthProfileContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import KundliPage from './pages/KundliPage';
import MahadashaPage from './pages/MahadashaPage';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

/**
 * LogoutBridge: clears birth profile when user logs out.
 * Must live INSIDE both AuthProvider and BirthProfileProvider.
 */
function LogoutBridge() {
  const { isAuthenticated } = useAuth();
  const { clearBirthProfile } = useBirthProfile();

  useEffect(() => {
    if (!isAuthenticated) {
      clearBirthProfile();
    }
  }, [isAuthenticated, clearBirthProfile]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname}
        variants={pageVariants}
        initial="initial" animate="animate" exit="exit"
        transition={{ duration: 0.35, ease: 'easeInOut' }}>
        <Routes location={location}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/kundli" element={
            <ProtectedRoute><KundliPage /></ProtectedRoute>
          } />
          <Route path="/mahadasha" element={
            <ProtectedRoute><MahadashaPage /></ProtectedRoute>
          } />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* BirthProfileProvider wraps AuthProvider so AuthContext children can use the hook */}
      <BirthProfileProvider>
        <AuthProvider>
          {/* Bridge: watches auth state and clears profile on logout */}
          <LogoutBridge />
          <AnimatedRoutes />
        </AuthProvider>
      </BirthProfileProvider>
    </BrowserRouter>
  );
}
