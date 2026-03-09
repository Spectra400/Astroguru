import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import api from '../lib/api';

const BirthProfileContext = createContext(null);

/**
 * BirthProfileProvider
 * Holds the user's stored birth profile in global state.
 * - setBirthProfile: set optimistically from Kundli response
 * - fetchBirthProfile: load from backend (DB source of truth)
 * - clearBirthProfile: called on logout
 */
export function BirthProfileProvider({ children }) {
    const [birthProfile, setBirthProfileState] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);

    const setBirthProfile = useCallback((profile) => {
        setBirthProfileState(profile ?? null);
    }, []);

    const fetchBirthProfile = useCallback(async () => {
        setProfileLoading(true);
        try {
            const res = await api.get('/profile/birth-details');
            const profile = res.data?.data?.birthProfile ?? null;
            setBirthProfileState(profile);
            return profile;
        } catch {
            // Non-fatal: context stays null, CTA will show
            setBirthProfileState(null);
            return null;
        } finally {
            setProfileLoading(false);
        }
    }, []);

    const clearBirthProfile = useCallback(() => {
        setBirthProfileState(null);
    }, []);

    // Memoized value — prevents full tree re-render on unrelated state changes
    const value = useMemo(() => ({
        birthProfile,
        profileLoading,
        setBirthProfile,
        fetchBirthProfile,
        clearBirthProfile,
    }), [birthProfile, profileLoading, setBirthProfile, fetchBirthProfile, clearBirthProfile]);

    return (
        <BirthProfileContext.Provider value={value}>
            {children}
        </BirthProfileContext.Provider>
    );
}

export function useBirthProfile() {
    const ctx = useContext(BirthProfileContext);
    if (!ctx) throw new Error('useBirthProfile must be used within BirthProfileProvider');
    return ctx;
}
