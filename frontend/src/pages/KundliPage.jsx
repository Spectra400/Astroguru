import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import LoadingSpinner from '../components/LoadingSpinner';
import LagnaChart from '../components/charts/LagnaChart';
import NavamshaChart from '../components/charts/NavamshaChart';
import api from '../lib/api';
import { useBirthProfile } from '../context/BirthProfileContext';

/* ─── Interpretation Maps ─────────────────────────────────────────────── */

const moonSignDescriptions = {
    Mesha: 'Aries Moon natives are bold, impulsive, and deeply driven by their instincts. Emotional reactions are quick and intense, fueled by a natural warrior spirit.',
    Vrishabha: 'Taurus Moon brings a deep need for security, comfort, and sensory pleasure. These natives are emotionally steady, loyal, and highly patient.',
    Mithuna: 'Gemini Moon natives process emotions intellectually. They are curious, adaptable, and crave mental stimulation and variety in their emotional world.',
    Kataka: "Cancer Moon is the Moon's own sign — deeply empathetic, nurturing, and emotionally intuitive. Home and family form the core of their emotional identity.",
    Simha: 'Leo Moon natives carry a regal emotional warmth. They are generous, dramatic, and thrive when their emotional expression is appreciated and admired.',
    Kanya: 'Virgo Moon natives are analytical and detail-oriented in their emotional approach. They find comfort in routines, service, and practical care for others.',
    Tula: 'Libra Moon brings a deep need for harmony and partnership. These natives are emotionally balanced, fair-minded, and deeply affected by relational imbalances.',
    Vrishchika: 'Scorpio Moon natives experience emotions with extraordinary depth and intensity. Fiercely perceptive and transformative, they navigate hidden truths with natural ease. Loyalty is their greatest strength — and betrayal their deepest wound.',
    Scorpio: 'Scorpio Moon natives experience emotions with extraordinary depth and intensity. Fiercely perceptive and transformative, they navigate hidden truths with natural ease. Loyalty is their greatest strength — and betrayal their deepest wound.',
    Dhanu: 'Sagittarius Moon natives find emotional fulfillment through exploration, philosophy, and freedom. Optimistic and truth-seeking, they resist emotional confinement.',
    Makara: 'Capricorn Moon natives are emotionally disciplined and self-reliant. They channel feelings into ambition and take pride in emotional resilience.',
    Kumbha: 'Aquarius Moon natives are emotionally detached yet humanitarian. They thrive in community and feel most at home when working toward a higher cause.',
    Meena: 'Pisces Moon natives are deeply intuitive and empathetic. Highly spiritual and imaginative, they absorb the emotions of those around them effortlessly.',
};

const nakshatraDescriptions = {
    Ashwini: 'Ashwini natives are swift, pioneering, and possess a natural healing energy. Ruled by the Ashwini Kumaras, they are initiatorsof new beginnings.',
    Bharani: 'Bharani carries the energy of transformation and endurance. Ruled by Yama, these natives navigate extremes — creation and destruction — with intensity.',
    Krittika: 'Krittika natives are sharp, disciplined, and fiercely ambitious. Ruled by Agni, they burn through obstacles with precision and determination.',
    Rohini: "Rohini is the Moon's favorite Nakshatra — abundant, creative, and deeply sensual. These natives have a magnetic charm and a love for beauty.",
    Mrigashira: 'Mrigashira natives are curious seekers, always searching for truth and perfection. Gentle yet restless, governed by the eternal quest for meaning.',
    Ardra: 'Ardra natives carry the storm energy of Rudra — intense, transformative, and deeply compassionate beneath a turbulent exterior.',
    Punarvasu: 'Punarvasu natives embody renewal and return. Jupiter-ruled, they are optimistic, wise, and possess a remarkable ability to rebuild after setbacks.',
    Pushya: 'Pushya, the most auspicious Nakshatra, bestows nurturing wisdom and deep spiritual care. These natives are protectors and providers.',
    Ashlesha: 'Ashlesha natives are perceptive, strategic, and deeply intuitive. Ruled by the Nagas, they have an innate ability to see beneath the surface.',
    Magha: 'Magha natives are regal, proud, and deeply connected to ancestral wisdom. Ruled by the Pitrus, they carry a natural authority.',
    'Purva Phalguni': 'Purva Phalguni natives radiate joy, creativity, and sensual pleasure. Venus-ruled, they are lovers of art, luxury, and celebration.',
    'Uttara Phalguni': 'Uttara Phalguni natives are dependable, socially graceful, and motivated by service. They excel when helping others flourish.',
    Hasta: 'Hasta natives are skilled, precise, and deeply resourceful. Moon-ruled, they have exceptional healing hands and a sharp wit.',
    Chitra: 'Chitra natives are visionary architects of beauty and form. Mars-ruled, they are creative, dynamic, and drawn to aesthetic perfection.',
    Swati: 'Swati natives are independent, adaptable, and guided by the wind — scattered yet flexible. Rahu-governed, they seek freedom above all.',
    Vishakha: 'Vishakha natives are intensely goal-oriented and passionate. Jupiter-ruled, they do not rest until their ambitions are fully realized.',
    Anuradha: 'Anuradha natives cultivate deep friendships and spiritual devotion. Saturn-ruled, they are steadfast companions in all of life\'s journeys.',
    Jyeshta: 'Jyeshta natives are fiercely protective, wise, and carry a commanding presence. Governed by Indra and Mercury, they are natural strategists and leaders who carry the weight of responsibility with quiet strength. Their sharp intellect and resilience allow them to rise under pressure.',
    Jyeshtha: 'Jyeshta natives are fiercely protective, wise, and carry a commanding presence. Governed by Indra and Mercury, they are natural strategists and leaders who carry the weight of responsibility with quiet strength. Their sharp intellect and resilience allow them to rise under pressure.',
    Moola: 'Moola natives are driven to seek root truths. Ketu-governed, they undergo profound transformations — destruction of the old to build something eternal.',
    'Purva Ashadha': 'Purva Ashadha natives are undefeated — resilient and never truly conquered. Venus-ruled, they persist with grace and invincibility.',
    'Uttara Ashadha': 'Uttara Ashadha natives achieve lasting victory through righteousness and discipline. Sun-ruled, they are pillars of ethical strength.',
    Shravana: 'Shravana natives are deep listeners and devoted learners. Moon-ruled, they accumulate wisdom through careful attention to the world around them.',
    Dhanishtha: 'Dhanishtha natives are prosperous, rhythmic, and attuned to cosmic music. Mars-ruled, they are bold achievers with a love for communal joy.',
    Dhanishta: 'Dhanishtha natives are prosperous, rhythmic, and attuned to cosmic music. Mars-ruled, they are bold achievers with a love for communal joy.',
    Shatabhisha: 'Shatabhisha natives are mysterious healers and seekers. Rahu-governed, they carry a private world of deep insight and unconventional wisdom.',
    'Purva Bhadrapada': 'Purva Bhadrapada natives are intensely passionate and transformative. Jupiter-ruled, they walk the edge between the material and transcendent.',
    'Uttara Bhadrapada': 'Uttara Bhadrapada natives embody depth, compassion, and cosmic wisdom. Saturn-ruled, they are the quiet guardians of universal truths.',
    Revati: 'Revati natives walk in eternal grace and spiritual abundance. Mercury-ruled, they guide others home — gentle beacons at the end of the zodiac.',
};

/* ─── Helpers ─────────────────────────────────────────────────────────── */

function extract(obj, ...keys) {
    for (const key of keys) {
        if (obj == null) return null;
        obj = obj[key];
    }
    return obj ?? null;
}

function firstOf(...values) {
    return values.find(v => v != null && v !== '') ?? '—';
}

/* ─── Main Page ───────────────────────────────────────────────────────── */

export default function KundliPage() {
    const [form, setForm] = useState({ date: '', time: '', place: '' });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { birthProfile, setBirthProfile } = useBirthProfile();
    const [hasAutoFetched, setHasAutoFetched] = useState(false);

    const fetchKundli = async (formData) => {
        setError(''); setResult(null); setLoading(true);
        try {
            const res = await api.post('/kundli', formData);
            const kundli = res.data.data.kundli;
            setResult(kundli);
            // Update birth profile context with resolved data
            if (kundli) {
                setBirthProfile({
                    date: kundli.date,
                    time: kundli.time,
                    place: kundli.place,
                    latitude: kundli.latitude,
                    longitude: kundli.longitude,
                    timezone: kundli.timezone,
                    ayanamsa: kundli.ayanamsa,
                });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 1. Auto Prefill Form
    useEffect(() => {
        if (birthProfile?.date && !form.date && !form.time && !form.place) {
            setForm({
                date: birthProfile.date,
                time: birthProfile.time,
                place: birthProfile.place
            });
        }
    }, [birthProfile]);

    // 2. Auto Fetch Chart if profile exists
    useEffect(() => {
        if (birthProfile?.date && !result && !loading && !hasAutoFetched) {
            setHasAutoFetched(true);
            fetchKundli({
                date: birthProfile.date,
                time: birthProfile.time,
                place: birthProfile.place
            });
        }
    }, [birthProfile, result, loading, hasAutoFetched]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetchKundli(form);
    };

    return (
        <div className="min-h-screen bg-cosmic-gradient">
            <Navbar />
            <div className="content-layer max-w-4xl mx-auto px-6 pt-32 pb-16">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10">
                    <span className="text-5xl block mb-4">🪐</span>
                    <h1 className="font-cinzel text-4xl font-bold text-gradient mb-3">Vedic Kundli</h1>
                    <p className="text-star-white/60">
                        Enter your birth details to generate your cosmic birth chart.
                    </p>
                </motion.div>

                {/* Form */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}>
                    <GlassCard className="neon-border mb-10" hover={false}>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <FormField label="Birth Date" name="date" type="date"
                                    value={form.date} onChange={handleChange} />
                                <FormField label="Birth Time" name="time" type="time"
                                    value={form.time} onChange={handleChange} />
                            </div>
                            <FormField label="Birth Place" name="place" type="text"
                                placeholder="e.g. Mumbai, India" value={form.place} onChange={handleChange} />

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
                                    ? <LoadingSpinner size="sm" text="Calculating chart..." />
                                    : 'Generate Kundli ✦'}
                            </GlowButton>
                        </form>
                    </GlassCard>
                </motion.div>

                {/* Result + Charts */}
                <AnimatePresence>
                    {result && (
                        <>
                            <KundliResult result={result} />

                            {/* ── Birth Charts ─────────────────────────────────────── */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="mt-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex-1 h-px bg-white/5" />
                                    <h2 className="font-cinzel text-lg font-bold text-gradient">✦ Birth Charts</h2>
                                    <div className="flex-1 h-px bg-white/5" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div className="glass rounded-2xl border border-violet-500/15 p-6 flex justify-center">
                                        <LagnaChart reportData={result?.reportData} />
                                    </div>
                                    <div className="glass rounded-2xl border border-cyan-500/15 p-6 flex justify-center">
                                        <NavamshaChart reportData={result?.reportData} />
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}

/* ─── Form Field ──────────────────────────────────────────────────────── */

function FormField({ label, name, type, placeholder, value, onChange }) {
    return (
        <div>
            <label className="block text-star-white/60 text-xs uppercase tracking-widest mb-2">
                {label}
            </label>
            <input name={name} type={type} placeholder={placeholder} value={value}
                onChange={onChange} required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white
           placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/60
           transition-all duration-200" />
        </div>
    );
}

/* ─── Kundli Result ───────────────────────────────────────────────────── */

function KundliResult({ result }) {
    // CONFIRMED Prokerala path from debug_kundli_response.json:
    // reportData.data.nakshatra_details => { nakshatra, chandra_rasi, soorya_rasi, additional_info }
    // reportData.data.mangal_dosha      => { has_dosha, description }
    // reportData.data.yoga_details      => [ { name, description }, ... ]
    // reportData = { kundli: <Prokerala /kundli response>, planets: <Prokerala /planet-position response> }
    // Must go through .kundli.data.* — NOT .data.* directly
    const nkDetails = result?.reportData?.kundli?.data?.nakshatra_details ?? {};

    // ── Moon Sign
    const moonObj = nkDetails?.chandra_rasi ?? {};
    const moonSign = moonObj?.name ?? '—';
    const moonLord = moonObj?.lord?.name ?? moonObj?.lord ?? '—';

    // ── Sun Sign
    const sunObj = nkDetails?.soorya_rasi ?? {};
    const sunSign = sunObj?.name ?? '—';
    const sunLord = sunObj?.lord?.name ?? sunObj?.lord ?? '—';

    // ── Nakshatra
    const nkObj = nkDetails?.nakshatra ?? {};
    const nakshatraName = nkObj?.name ?? '—';
    const nakshatraLord = nkObj?.lord?.name ?? nkObj?.lord ?? '—';
    const nakshatraPada = nkObj?.pada ?? nkObj?.padam ?? '—';

    // ── Nakshatra attributes (deity, symbol, color, etc.)
    const info = nkDetails?.additional_info ?? {};

    // ── Mangal Dosha
    const mangal = result?.reportData?.kundli?.data?.mangal_dosha ?? {};

    // ── Yoga Summary
    const yogas = result?.reportData?.kundli?.data?.yoga_details ?? [];

    // ── Coordinates
    const coords = [
        { label: 'Place', value: result?.place },
        { label: 'Latitude', value: result?.latitude != null ? `${result.latitude}°` : '—' },
        { label: 'Longitude', value: result?.longitude != null ? `${result.longitude}°` : '—' },
        { label: 'Timezone', value: result?.timezone },
        { label: 'Ayanamsa', value: result?.ayanamsa === 1 ? 'Lahiri' : result?.ayanamsa },
    ];

    // ── Interpretations
    const fallback = 'Detailed interpretation coming soon.';
    const moonDesc = moonSignDescriptions[moonSign] ?? fallback;
    const nkDesc = nakshatraDescriptions[nakshatraName] ?? fallback;

    return (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="space-y-8">

            {/* Section header */}
            <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/5" />
                <h2 className="font-cinzel text-lg font-bold text-gradient">✦ Your Cosmic Profile</h2>
                <div className="flex-1 h-px bg-white/5" />
            </div>

            {/* Primary cards: Nakshatra · Moon Sign · Sun Sign */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <PrimaryCard delay={0.05} icon="🌠" title="Nakshatra" subtitle="Birth Star" accent="violet"
                    main={nakshatraName}
                    meta={[{ label: 'Lord', value: nakshatraLord }, { label: 'Pada', value: String(nakshatraPada) }]} />

                <PrimaryCard delay={0.15} icon="☽" title="Moon Sign" subtitle="Chandra Rasi" accent="cyan"
                    main={moonSign} meta={[{ label: 'Lord', value: moonLord }]} />

                <PrimaryCard delay={0.25} icon="☀️" title="Sun Sign" subtitle="Soorya Rasi" accent="gold"
                    main={sunSign} meta={[{ label: 'Lord', value: sunLord }]} />
            </div>

            {/* ── Moon Sign Interpretation */}
            <InterpretationBlock
                delay={0.35}
                icon="🌙"
                accent="cyan"
                title={`Moon Sign Interpretation — ${moonSign}`}
                badge="Chandra Rasi"
                description={moonDesc}
            />

            {/* ── Nakshatra Interpretation */}
            <InterpretationBlock
                delay={0.45}
                icon="⭐"
                accent="violet"
                title={`Nakshatra Interpretation — ${nakshatraName}`}
                badge={nakshatraPada !== '—' ? `Pada ${nakshatraPada}` : ''}
                description={nkDesc}
            />

            {/* Nakshatra Attributes */}
            {Object.keys(info).length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}>
                    <GlassCard className="border-white/10" hover={false}>
                        <p className="text-star-white/50 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span>🔮</span> Nakshatra Attributes
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {Object.entries(info)
                                .filter(([, v]) => v != null && v !== '')
                                .map(([key, val]) => (
                                    <div key={key} className="glass rounded-xl p-3">
                                        <p className="text-star-white/40 text-xs uppercase tracking-widest mb-1">
                                            {key.replace(/_/g, ' ')}
                                        </p>
                                        <p className="text-white text-xs font-medium">{String(val)}</p>
                                    </div>
                                ))}
                        </div>
                    </GlassCard>
                </motion.div>
            )}

            {/* Mangal Dosha */}
            {mangal?.description && (
                <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.60 }}
                    className={`glass rounded-2xl px-6 py-4 flex items-center gap-4 border ${mangal.has_dosha ? 'border-red-500/30' : 'border-emerald-500/30'
                        }`}>
                    <span className="text-3xl">{mangal.has_dosha ? '🔴' : '🟢'}</span>
                    <div>
                        <p className="text-star-white/50 text-xs uppercase tracking-widest">Mangal Dosha</p>
                        <p className={`font-semibold text-sm mt-0.5 ${mangal.has_dosha ? 'text-red-300' : 'text-emerald-300'
                            }`}>
                            {mangal.description}
                        </p>
                    </div>
                </motion.div>
            )}

            {/* Yoga Summary */}
            {yogas.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65 }}>
                    <GlassCard className="border-violet-500/10" hover={false}>
                        <p className="text-star-white/50 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span>✨</span> Yoga Summary
                        </p>
                        <div className="space-y-2">
                            {yogas.map((yoga, i) => (
                                <div key={i} className="flex items-start gap-3 glass rounded-xl px-4 py-3">
                                    <span className="text-violet-400 text-xs mt-0.5">✦</span>
                                    <div>
                                        <p className="text-violet-200 text-xs font-semibold uppercase tracking-wider">
                                            {yoga.name}
                                        </p>
                                        <p className="text-star-white/55 text-xs mt-0.5">{yoga.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </motion.div>
            )}

            {/* Birth Coordinates */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.70 }}>
                <GlassCard className="neon-border" hover={false}>
                    <p className="text-star-white/50 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span>📍</span> Birth Coordinates &amp; Settings
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {coords.map(({ label, value }) => (
                            <div key={label} className="glass rounded-xl p-3">
                                <p className="text-star-white/50 text-xs uppercase tracking-widest mb-1">{label}</p>
                                <p className="text-white text-sm font-medium truncate">{String(value ?? '—')}</p>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </motion.div>

        </motion.div>
    );
}


/* ─── Interpretation Block ────────────────────────────────────────────── */

const INTERP_ACCENT = {
    violet: {
        border: 'border-violet-500/25',
        bg: 'bg-violet-500/8',
        badge: 'bg-violet-500/15 text-violet-300 border border-violet-500/30',
        icon: 'bg-violet-500/15',
        title: 'text-violet-200',
        bar: 'bg-gradient-to-r from-violet-500 to-purple-500',
    },
    cyan: {
        border: 'border-cyan-500/25',
        bg: 'bg-cyan-500/8',
        badge: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30',
        icon: 'bg-cyan-500/15',
        title: 'text-cyan-200',
        bar: 'bg-gradient-to-r from-cyan-500 to-blue-500',
    },
};

function InterpretationBlock({ icon, title, badge, description, accent = 'violet', delay = 0 }) {
    const a = INTERP_ACCENT[accent];
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className={`relative glass rounded-2xl border ${a.border} overflow-hidden`}>
            {/* Top gradient bar */}
            <div className={`h-0.5 w-full ${a.bar}`} />
            <div className="px-6 py-5">
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`shrink-0 w-10 h-10 rounded-xl ${a.icon} flex items-center justify-center text-xl`}>
                        {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        {/* Title row */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <h3 className={`font-cinzel font-semibold text-sm ${a.title} leading-snug`}>{title}</h3>
                            {badge && (
                                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${a.badge}`}>
                                    {badge}
                                </span>
                            )}
                        </div>
                        {/* Description */}
                        <p className="text-star-white/65 text-sm leading-relaxed">{description}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

/* ─── Primary Info Card ───────────────────────────────────────────────── */

const ACCENT = {
    violet: { border: 'border-violet-500/30', bg: 'bg-violet-500/10', text: 'text-violet-300', shadow: 'shadow-violet-500/10' },
    cyan: { border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', text: 'text-cyan-300', shadow: 'shadow-cyan-500/10' },
    gold: { border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-300', shadow: 'shadow-amber-500/10' },
};

function PrimaryCard({ icon, title, subtitle, main, meta = [], accent = 'violet', delay = 0 }) {
    const a = ACCENT[accent];
    return (
        <motion.div
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.45 }}
            className={`glass rounded-2xl p-5 border ${a.border} shadow-xl ${a.shadow} flex flex-col gap-3`}>
            <div className="flex items-center gap-2">
                <span className="text-2xl">{icon}</span>
                <div>
                    <p className={`text-xs font-semibold uppercase tracking-widest ${a.text}`}>{title}</p>
                    <p className="text-star-white/40 text-xs">{subtitle}</p>
                </div>
            </div>
            <p className="font-cinzel text-2xl font-bold text-white leading-tight">{main}</p>
            {meta.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {meta.filter(m => m.value !== '—').map(({ label, value }) => (
                        <span key={label}
                            className={`text-xs px-3 py-1 rounded-full ${a.bg} ${a.text} border ${a.border}`}>
                            {label}: {value}
                        </span>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
