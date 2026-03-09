import NorthIndianChart from './NorthIndianChart';

/**
 * NavamshaChart — D9 (Navamsha) divisional chart.
 *
 * CONFIRMED data shape from Prokerala /divisional-chart?chart_type=D9:
 *   Same structure as /planet-position:
 *   data.planet_position = [
 *     { id, name, longitude, is_retrograde, rasi: { id, name, lord } },
 *     ...
 *     { id: 100, name: "Ascendant", rasi: { id, ... } }
 *   ]
 *
 * This data is stored as reportData.navamsha by kundliService.
 * House computation: identical to LagnaChart — use rasi.id relative to Ascendant.
 */
export default function NavamshaChart({ reportData }) {
    const planets = extractNavamshaPlanets(reportData);
    const hasData = planets.length > 0;

    return (
        <div className="flex flex-col items-center">
            <NorthIndianChart
                planets={planets}
                title="Navamsha Chart (D9)"
                accent="cyan"
            />
            {!hasData && (
                <p className="text-star-white/30 text-xs mt-2 text-center max-w-[200px]">
                    Generate a new Kundli to load D9 data
                </p>
            )}
        </div>
    );
}

function extractNavamshaPlanets(reportData) {
    // reportData.navamsha is the raw Prokerala /divisional-chart response
    const positions = reportData?.navamsha?.data?.planet_position
        ?? reportData?.navamsha?.planet_position
        ?? [];

    if (!Array.isArray(positions) || positions.length === 0) return [];

    // Find Ascendant (id=100) — sets house 1 in D9
    const ascEntry = positions.find(p => p.id === 100 || p.name === 'Ascendant');
    const ascRasiId = ascEntry?.rasi?.id ?? 1;

    return positions
        .map(p => {
            const planetRasiId = p.rasi?.id ?? 1;
            const house = p.id === 100
                ? 1
                : ((planetRasiId - ascRasiId + 12) % 12) + 1;
            return {
                name: p.name ?? `P${p.id}`,
                house,
                longitude: Number(p.longitude ?? 0),
                isRetrograde: p.is_retrograde ?? false,
            };
        });
}
