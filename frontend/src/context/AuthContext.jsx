import { createContext, useContext, useState, useCallback } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('astro_user');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    const [token, setToken] = useState(() => localStorage.getItem('astro_token') || null);

    const login = useCallback(async ({ email, password }) => {
        const res = await api.post('/auth/login', { email, password });
        const { token: newToken, data } = res.data;
        const userData = data?.user || data;
        localStorage.setItem('astro_token', newToken);
        localStorage.setItem('astro_user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        return userData;
    }, []);

    const register = useCallback(async ({ name, email, password }) => {
        const res = await api.post('/auth/register', { name, email, password });
        const { token: newToken, data } = res.data;
        const userData = data?.user || data;
        localStorage.setItem('astro_token', newToken);
        localStorage.setItem('astro_user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        return userData;
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('astro_token');
        localStorage.removeItem('astro_user');
        setToken(null);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
