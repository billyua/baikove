import { supabase } from "../../lib/supabaseClient";
import MapLoader from "../../components/MapLoader";
import Link from "next/link";

export const dynamic = "force-dynamic";

// Fallback center (used only if there are no graves yet, or none have coordinates).
// Once you have real graves with coordinates, the map centers on them automatically.
const DEFAULT_CENTER = [50.4501, 30.5234]; // Kyiv, as a placeholder
const DEFAULT_ZOOM = 17;

export default async function MapPage({ searchParams }) {
  const highlightId = searchParams?.highlight ?? null;

  const { data: graves, error } = await supabase
    .from("graves")
    .select(
      "id, last_name, first_name, birth_year, death_year, occupation, latitude, longitude"
    )
    .not("latitude", "is", null)
    .not("longitude", "is", null);

  let center = DEFAULT_CENTER;
  let zoom = DEFAULT_ZOOM;

  const highlightedGrave = graves?.find((g) => g.id === highlightId);

  if (highlightedGrave) {
    center = [highlightedGrave.latitude, highlightedGrave.longitude];
    zoom = 20;
  } else if (graves && graves.length > 0) {
    const avgLat =
      graves.reduce((sum, g) => sum + g.latitude, 0) / graves.length;
    const avgLng =
      graves.reduce((sum, g) => sum + g.longitude, 0) / graves.length;
    center = [avgLat, avgLng];
  }

  return (
    <main style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
      <p>
        <Link href="/">← На головну</Link>
      </p>
      <h1>Карта цвинтаря</h1>

      {error && (
        <p style={{ color: "red" }}>
          Помилка завантаження даних: {error.message}
        </p>
      )}

      {!error && graves && graves.length === 0 && (
        <p>Поки немає жодного поховання з координатами.</p>
      )}

      {!error && graves && graves.length > 0 && (
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
