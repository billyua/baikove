import { sql } from "../../lib/db";
import MapLoader from "../../components/MapLoader";
import Link from "next/link";

export const dynamic = "force-dynamic";

// Fallback center (used only if there are no graves yet, or none have coordinates).
const DEFAULT_CENTER = [50.4501, 30.5234]; // placeholder
const DEFAULT_ZOOM = 17;

export default async function MapPage({ searchParams }) {
  const highlightId = searchParams?.highlight ?? null;

  let graves = [];
  let error = null;

  try {
    graves = await sql`
      select id, last_name, first_name, birth_year, death_year, occupation,
             latitude, longitude
      from graves
      where latitude is not null and longitude is not null
    `;
  } catch (err) {
    error = err.message;
  }

  let center = DEFAULT_CENTER;
  let zoom = DEFAULT_ZOOM;

  const highlightedGrave = graves.find((g) => g.id === highlightId);

  if (highlightedGrave) {
    center = [Number(highlightedGrave.latitude), Number(highlightedGrave.longitude)];
    zoom = 20;
  } else if (graves.length > 0) {
    const avgLat =
      graves.reduce((sum, g) => sum + Number(g.latitude), 0) / graves.length;
    const avgLng =
      graves.reduce((sum, g) => sum + Number(g.longitude), 0) / graves.length;
    center = [avgLat, avgLng];
  }

  return (
    <main style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
      <p>
        <Link href="/">← На головну</Link>
      </p>
      <h1>Карта цвинтаря</h1>

      {error && (
        <p style={{ color: "red" }}>Помилка завантаження даних: {error}</p>
      )}

      {!error && graves.length === 0 && (
        <p>Поки немає жодного поховання з координатами.</p>
      )}

      {!error && graves.length > 0 && (
        <MapLoader
          graves={graves}
          center={center}
          zoom={zoom}
          highlightId={highlightId}
        />
      )}
    </main>
  );
}
