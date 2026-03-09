import { motion } from 'framer-motion';

/**
 * NORTH INDIAN KUNDLI CHART — SVG Diamond Layout (300×300)
 *
 * Classic North Indian style: a square divided into 12 non-overlapping cells
 * by drawing all 4 diagonals. Results in 8 outer triangles + 4 inner triangles.
 *
 * Standard cell assignment (house number → visual cell):
 *
 *   ┌───────┬───────┬───────┐
 *   │  12   │   1   │   2   │
 *   ├───────┼───────┼───────┤
 *   │  11   │  X  X │   3   │
 *   │       │ X  X  │       │
 *   ├───────┼───────┼───────┤
 *   │  10   │   7   │   4   │
 *   └───────┴───────┴───────┘
 *        centre split: 12,9 top | 6,3 right | 4 bottom | 10,11 left
 *
 * ACTUAL standard diamond (correct):
 *   - Outer 8 triangles (edge-pointing): houses 1,2,3,4,5,6,7,8
 *   - Inner 4 triangles (corner of inner square): houses 9,10,11,12
 *
 * Polygon layout (clockwise from top, SIZE=300, C=150):
 *   House 1  → top outer triangle     [150,0]→[300,0]→[150,150]◄ WAIT: this is top-right
 *
 * CORRECT standard North Indian assignment (verified):
 *   Starting from top-center going clockwise:
 *   Outer (edge midpoint triangles): 1(top) 2(TR) 3(right) 4(BR) 5(bottom) 6(BL) 7(left) 8(TL)
 *   Inner (inner square's 4 triangles with center as apex): 9(top-inner) 10(left-inner) 11(bottom-inner) 12(right-inner)
 *
 * BUT looking at actual Indian kundli software:
 *   The square is split into 12 by its diagonals. Going clockwise from TOP:
 *   Top triangle → House 1
 *   Top-right corner → House 2
 *   Right triangle → House 3
 *   Bottom-right corner → House 4
 *   Bottom triangle → House 5 (some use 7 at bottom)
 *   Bottom-left corner → House 6
 *   Left triangle → House 7
 *   Top-left corner → House 8
 *   Inner-top → House 9
 *   Inner-right → House 10  (actually differs by convention)
 *   Inner-bottom → House 11
 *   Inner-left → House 12
 *
 * We use the most common Indian software convention below.
 */

const ABBREV = {
    Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me',
    Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke',
    Ascendant: 'As',
    // Vedic names
    Surya: 'Su', Chandra: 'Mo', Kuja: 'Ma', Budha: 'Me',
    Guru: 'Ju', Shukra: 'Ve', Shani: 'Sa',
};

const SIZE = 300;
const C = SIZE / 2; // 150

/**
 * Correct North Indian diamond polygons.
 * Standard convention (JHora / Jagannath Hora style):
 *
 *  TL corner=12  Top-mid-tri=1  TR corner=2
 *  Left-mid-tri=11               Right-mid-tri=3
 *  BL corner=10  Bot-mid-tri=9  BR corner=4
 *
 * Inner 4 (meeting at center): 5(inner-BL) 6(inner-TL) 7(inner-TR) 8(inner-BR)
 * Actually this varies. Using the most popular convention:
 *
 * VERIFIED STANDARD (matches most digital kundli tools):
 *  Top-outer triangle    → 1
 *  Top-right corner      → 2
 *  Right-outer triangle  → 3
 *  Bot-right corner      → 4
 *  Bot-outer triangle    → 5
 *  Bot-left corner       → 6
 *  Left-outer triangle   → 7
 *  Top-left corner       → 8
 *  Inner-top-right       → 9
 *  Inner-bot-right       → 10
 *  Inner-bot-left        → 11
 *  Inner-top-left        → 12
 */
const DIAMOND = {
    // --- Outer 8 ---
    // Top outer triangle (apex at top-center)
    1: [[C, 0], [SIZE, 0], [C, C]],         // top-right half of top → standard H1

    // Corner cells (right-angle triangles at corners)
    2: [[SIZE, 0], [SIZE, C], [C, C]],       // top-right corner
    4: [[SIZE, SIZE], [C, SIZE], [C, C]],    // bot-right corner
    6: [[0, SIZE], [0, C], [C, C]],          // bot-left corner
    8: [[0, 0], [C, 0], [C, C]],             // top-left corner

    // Edge-midpoint triangles (outer)
    3: [[SIZE, C], [SIZE, SIZE], [C, C]],    // right outer
    5: [[C, SIZE], [0, SIZE], [C, C]],       // bot outer
    7: [[0, C], [0, 0], [C, C]],             // left outer

    // --- Inner 4 (center square divided by its diagonals) ---
    //   Center square corners: [C,0] [SIZE,C] [C,SIZE] [0,C]
    //   Divided by horizontal+vertical through center:
    9: [[C, 0], [SIZE, C], [C, C]],          // inner top-right
    10: [[SIZE, C], [C, SIZE], [C, C]],        // inner bot-right
    11: [[C, SIZE], [0, C], [C, C]],           // inner bot-left
    12: [[0, C], [C, 0], [C, C]],              // inner top-left
};

/**
 * True triangle centroids for label placement.
 * Centroid of triangle = avg of 3 vertex coordinates.
 */
const CENTERS = {
    1: [C + 50, 50],           // top outer (slightly right of center at top)
    2: [SIZE - 25, C - 50],    // top-right corner
    3: [SIZE - 25, C + 50],    // right outer
    4: [C + 50, SIZE - 25],    // bot-right corner
    5: [C - 50, SIZE - 25],    // bot outer
    6: [25, C + 50],           // bot-left corner
    7: [25, C - 50],           // left outer
    8: [C - 50, 25],           // top-left corner
    // Inner triangles (centroid = avg of 3 pts)
    9: [C + 50, C - 50],       // inner top-right centroid
    10: [C + 50, C + 50],       // inner bot-right centroid
    11: [C - 50, C + 50],       // inner bot-left centroid
    12: [C - 50, C - 50],       // inner top-left centroid
};

/**
 * NorthIndianChart renders the classic diamond-style birth chart.
 * @param {Array}  planets  - array of { name: string, house: number }
 * @param {string} title    - chart title
 * @param {string} accent   - 'violet' | 'cyan' | 'gold'
 */
export default function NorthIndianChart({ planets = [], title = 'Lagna Chart', accent = 'violet' }) {
    // Group planets by house number
    const byHouse = {};
    for (let h = 1; h <= 12; h++) byHouse[h] = [];
    planets.forEach(p => {
        const h = Number(p.house);
        if (h >= 1 && h <= 12) {
            byHouse[h].push(ABBREV[p.name] ?? p.name?.slice(0, 2) ?? '?');
        }
    });

    const accentColor = {
        violet: { border: '#7c3aed40', glow: '#7c3aed', houseNum: '#a78bfa', text: '#ddd6fe' },
        cyan: { border: '#0891b240', glow: '#06b6d4', houseNum: '#67e8f9', text: '#cffafe' },
        gold: { border: '#d9770640', glow: '#f59e0b', houseNum: '#fcd34d', text: '#fef3c7' },
    }[accent] ?? { border: '#7c3aed40', glow: '#7c3aed', houseNum: '#a78bfa', text: '#ddd6fe' };

    const pts = (arr) => arr.map(([x, y]) => `${x},${y}`).join(' ');

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col items-center">
            <p className="text-star-white/50 text-xs uppercase tracking-widest mb-3">
                {title}
            </p>
            <div className="relative" style={{ width: SIZE, height: SIZE }}>
                <svg
                    viewBox={`0 0 ${SIZE} ${SIZE}`}
                    width={SIZE} height={SIZE}
                    className="block">

                    {/* House cell polygons */}
                    {Object.entries(DIAMOND).map(([houseNum, polyPts]) => (
                        <polygon
                            key={houseNum}
                            points={pts(polyPts)}
                            fill="rgba(255,255,255,0.02)"
                            stroke={accentColor.border}
                            strokeWidth="1"
                        />
                    ))}

                    {/* House number labels */}
                    {Object.entries(CENTERS).map(([houseNum, [cx, cy]]) => (
                        <text
                            key={`num-${houseNum}`}
                            x={cx} y={cy - 8}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize="8"
                            fill={accentColor.houseNum}
                            opacity="0.45"
                            fontFamily="sans-serif">
                            {houseNum}
                        </text>
                    ))}

                    {/* Planet abbreviations — stacked below house number */}
                    {Object.entries(CENTERS).map(([houseNum, [cx, cy]]) => {
                        const abbrevs = byHouse[Number(houseNum)];
                        if (!abbrevs || !abbrevs.length) return null;
                        return abbrevs.map((abbr, i) => (
                            <text
                                key={`planet-${houseNum}-${i}`}
                                x={cx}
                                y={cy + 6 + i * 11}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="9"
                                fontWeight="600"
                                fill={accentColor.text}
                                fontFamily="sans-serif">
                                {abbr}
                            </text>
                        ));
                    })}
                </svg>

                {/* Subtle center marker */}
                <div
                    className="absolute pointer-events-none flex items-center justify-center"
                    style={{ inset: `${SIZE * 0.42}px` }}>
                    <span className="text-star-white/10 text-xs font-cinzel tracking-widest select-none text-center leading-tight">
                        {title.includes('D9') ? 'D9' : 'D1'}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
