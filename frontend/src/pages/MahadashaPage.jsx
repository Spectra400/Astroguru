import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../lib/api';
import { useBirthProfile } from '../context/BirthProfileContext';

/* ─── Planet color map ─────────────────────────────────────────────────── */

const PLANET_META = {
    Sun: { abbr: 'Su', color: 'text-amber-300', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    Moon: { abbr: 'Mo', color: 'text-cyan-300', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
    Mars: { abbr: 'Ma', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    Mercury: { abbr: 'Me', color: 'text-emerald-300', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    Jupiter: { abbr: 'Ju', color: 'text-yellow-300', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    Venus: { abbr: 'Ve', color: 'text-pink-300', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
    Saturn: { abbr: 'Sa', color: 'text-indigo-300', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    Rahu: { abbr: 'Ra', color: 'text-violet-300', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
    Ketu: { abbr: 'Ke', color: 'text-purple-300', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
};

const DEFAULT_PLANET = { abbr: '?', color: 'text-white/60', bg: 'bg-white/5', border: 'border-white/10' };

/* ─── Helpers ──────────────────────────────────────────────────────────── */

function formatDate(str) {
    if (!str) return '—';
    try { return new Date(str).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
    catch { return str; }
}

function parseDashas(reportData) {
    // CONFIRMED from live API: Prokerala /dasha-periods returns a FLAT array:
    //   reportData.data.dasha_periods = [
    //     { id, name, start, end, antardasha: [ { id, name, start, end, pratyantardasha: [...] } ] }
    //   ]
    // Note: 'name' is a direct string (e.g. "Mars"), NOT an object {id, name}
    //       dates are 'start' and 'end', NOT 'start_date' / 'end_date'
    const raw = reportData?.data?.dasha_periods ?? [];
    return Array.isArray(raw) ? raw : [];
}

/* ─── Main Page ───────────────────────────────────────────────────────── */

export default function MahadashaPage() {
    const { birthProfile, fetchBirthProfile, profileLoading } = useBirthProfile();
    const [dashas, setDashas] = useState([]);
    const [reportMeta, setReportMeta] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [expanded, setExpanded] = useState(null);

    const generateMahadasha = useCallback(async () => {
        setError(''); setLoading(true);
        try {
            const res = await api.post('/mahadasha');
            const report = res.data?.data?.mahadasha;
            if (!report) throw new Error('Invalid response from server');
            const dashaList = parseDashas(report.reportData);
            setDashas(dashaList);
            setReportMeta(report);
        } catch (err) {
            setError(err?.message ?? 'Failed to load Mahadasha report');
        } finally {
            setLoading(false);
        }
    }, []);

    // On mount: ensure birth profile is loaded, then auto-generate
    useEffect(() => {
        const init = async () => {
            let profile = birthProfile;
            if (!profile) {
                profile = await fetchBirthProfile();
            }
            if (profile?.date) {
                generateMahadasha();
            }
        };
        init();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const hasProfile = !!birthProfile?.date;

    return (
        <div className="min-h-screen bg-cosmic-gradient">
            <Navbar />
            <div className="content-layer max-w-4xl mx-auto px-6 pt-32 pb-16">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10">
                    <span className="text-5xl block mb-4">⏳</span>
                    <h1 className="font-cinzel text-4xl font-bold text-gradient mb-3">Mahadasha Report</h1>
                    <p className="text-star-white/60">
                        Your Vimshottari Dasha timeline — planetary periods governing your life's chapters.
                    </p>
                </motion.div>

                {/* Birth profile summary chip */}
                <AnimatePresence>
                    {hasProfile && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }} className="mb-8">
                            <div className="glass rounded-2xl border border-cyan-500/20 px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                                <span className="text-2xl">🌌</span>
                                <div className="flex-1">
                                    <p className="text-star-white/50 text-xs uppercase tracking-widest">Reading for</p>
                                    <p className="text-white font-semibold">{birthProfile.place}</p>
                                    <p className="text-star-white/50 text-xs">{birthProfile.date} · {birthProfile.time} · {birthProfile.timezone}</p>
                                </div>
                                <GlowButton variant="cyan" className="text-xs px-4 py-2"
                                    onClick={generateMahadasha} disabled={loading}>
                                    {loading ? <LoadingSpinner size="sm" text="" /> : 'Regenerate ↺'}
                                </GlowButton>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* No birth profile CTA */}
                <AnimatePresence>
                    {!profileLoading && !hasProfile && (
                        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }} className="mb-8">
                            <GlassCard className="border-cyan-500/20 text-center" hover={false}>
                                <span className="text-5xl block mb-4">🪐</span>
                                <h2 className="font-cinzel text-xl font-bold text-white mb-3">
                                    No Birth Profile Found
                                </h2>
                                <p className="text-star-white/60 text-sm mb-6 max-w-md mx-auto">
                                    Generate your Kundli first. Your birth details will be saved automatically,
                                    and Mahadasha will load without asking for them again.
                                </p>
                                <Link to="/kundli">
                                    <GlowButton variant="violet">Generate Kundli ✦</GlowButton>
                                </Link>
                            </GlassCard>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Loading state */}
                {(loading || profileLoading) && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="flex justify-center py-16">
                        <LoadingSpinner size="lg" text="Reading the timeline…" />
                    </motion.div>
                )}

                {/* Error */}
                <AnimatePresence>
                    {error && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="text-red-400 text-sm bg-red-500/10 border border-red-500/20
                               rounded-xl px-4 py-3 mb-6 text-center">
                            {error}
                        </motion.p>
                    )}
                </AnimatePresence>

                {/* Dasha periods */}
                <AnimatePresence>
                    {dashas.length > 0 && !loading && (
                        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex-1 h-px bg-white/5" />
                                <h2 className="font-cinzel text-lg font-bold text-gradient">✦ Dasha Timeline</h2>
                                <div className="flex-1 h-px bg-white/5" />
                            </div>

                            <div className="space-y-3">
                                {dashas.map((dasha, i) => {
                                    // CONFIRMED: Prokerala dasha object has direct 'name' string, not planet.name
                                    const planet = dasha.name ?? `Period ${i + 1}`;
                                    const meta = PLANET_META[planet] ?? DEFAULT_PLANET;
                                    const isOpen = expanded === i;
                                    // CONFIRMED: sub-period key is 'antardasha'
                                    const antardashas = Array.isArray(dasha.antardasha) ? dasha.antardasha : [];

                                    return (
                                        <motion.div key={i}
                                            initial={{ opacity: 0, x: -16 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.06 }}>

                                            {/* Mahadasha row */}
                                            <button
                                                onClick={() => setExpanded(isOpen ? null : i)}
                                                className={`w-full glass rounded-2xl border ${meta.border}
                                                    px-5 py-4 flex items-center gap-4 text-left
                                                    hover:bg-white/5 transition-all duration-200`}>
                                                {/* Planet badge */}
                                                <div className={`shrink-0 w-10 h-10 rounded-xl ${meta.bg} border ${meta.border}
                                                    flex items-center justify-center`}>
                                                    <span className={`${meta.color} font-bold text-sm`}>{meta.abbr}</span>
                                                </div>

                                                {/* Planet name + dates */}
                                                <div className="flex-1 min-w-0">
                                                    <p className={`font-cinzel font-semibold ${meta.color}`}>{planet}</p>
                                                    <p className="text-star-white/40 text-xs mt-0.5">
                                                        {/* CONFIRMED: Prokerala date fields are 'start' and 'end' */}
                                                        {formatDate(dasha.start)} → {formatDate(dasha.end)}
                                                    </p>
                                                </div>

                                                {/* Duration */}
                                                {dasha.duration && (
                                                    <span className={`text-xs ${meta.bg} ${meta.border} border
                                                        ${meta.color} rounded-full px-3 py-1 shrink-0`}>
                                                        {dasha.duration}
                                                    </span>
                                                )}

                                                {/* Expand toggle */}
                                                {antardashas.length > 0 && (
                                                    <span className={`text-xs ${meta.color} transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>
                                                        ›{antardashas.length} sub
                                                    </span>
                                                )}
                                            </button>

                                            {/* Antardasha rows */}
                                            <AnimatePresence>
                                                {isOpen && antardashas.length > 0 && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="overflow-hidden">
                                                        <div className="ml-6 mt-1 space-y-1 pb-1">
                                                            {antardashas.map((ad, j) => {
                                                                // CONFIRMED: antardasha has direct 'name' string
                                                                const adPlanet = ad.name ?? `Sub ${j + 1}`;
                                                                const adMeta = PLANET_META[adPlanet] ?? DEFAULT_PLANET;
                                                                return (
                                                                    <div key={j}
                                                                        className={`glass rounded-xl border ${adMeta.border}
                                                                            px-4 py-2.5 flex items-center gap-3`}>
                                                                        <span className={`text-xs font-bold ${adMeta.color} w-5`}>
                                                                            {adMeta.abbr}
                                                                        </span>
                                                                        <span className={`text-xs font-medium ${adMeta.color}`}>
                                                                            {adPlanet}
                                                                        </span>
                                                                        <span className="text-star-white/30 text-xs ml-auto">
                                                                            {/* CONFIRMED: dates are start/end */}
                                                                            {formatDate(ad.start)} → {formatDate(ad.end)}
                                                                        </span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
