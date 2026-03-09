import NorthIndianChart from './NorthIndianChart';

/**
 * LagnaChart — Extracts planet-house positions from Prokerala /planet-position response
 * and renders the D1 (Lagna) chart using the NorthIndianChart component.
 *
 * CONFIRMED Prokerala /planet-position response shape:
 *   data.planet_position = [
 *     { id, name, longitude, is_retrograde, position, degree, rasi: { id, name, lord } },
 *     ...
 *     { id: 100, name: "Ascendant", longitude, rasi: { id, name, lord } }
 *   ]
 *
 * - rasi.id is the 1-based sign index (1=Aries, 2=Taurus, ... 12=Pisces)
 * - Ascendant entry (id=100) sets the lagna sign → house 1
 * - House formula: house = ((planet.rasi.id - asc.rasi.id + 12) % 12) + 1
 * - No direct 'house' property exists — must compute from rasi.id
 */
export default function LagnaChart({ reportData }) {
    const planets = extractPlanets(reportData);
    return (
        <NorthIndianChart
            planets={planets}
            title="Lagna Chart (D1)"
            accent="violet"
        />
    );
}

function extractPlanets(reportData) {
    // reportData: { kundli: {...}, planets: { data: { planet_position: [...] } } }
    const planetPositions = reportData?.planets?.data?.planet_position
        ?? reportData?.planets?.planet_position
        ?? [];

    if (!Array.isArray(planetPositions) || planetPositions.length === 0) {
        return [];
    }

    // Find the Ascendant entry (id=100) to determine lagna sign
    const ascEntry = planetPositions.find(p => p.id === 100 || p.name === 'Ascendant');
    const ascRasiId = ascEntry?.rasi?.id ?? 1; // default to Aries if missing

    // Include all planets including Ascendant (id=100)
    // Bug was: `.filter(p => p.name && p.name !== 'Ascendant' || p.id === 100)`
    // That had wrong precedence — && binds tighter than ||, so only Ascendant passed.
    return planetPositions
        .filter(p => p.name != null)
        .map(p => {
            const planetRasiId = p.rasi?.id ?? 1;
            // For Ascendant itself, always house 1
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
