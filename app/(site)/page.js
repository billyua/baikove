import { sql } from "../../lib/db";
import MapLoader from "../../components/MapLoader";

export const dynamic = "force-dynamic";

// The map's default view when no specific grave is highlighted.
const DEFAULT_CENTER = [50.418671547541706, 30.51021526307843];
const DEFAULT_ZOOM = 16;

export default async function HomePage({ searchParams }) {
  const highlightSlug = searchParams?.highlight ?? null;

  let graves = [];
  let error = null;

  try {
    graves = await sql`
      select id, slug, last_name, first_name, birth_year, death_year, occupation,
             latitude, longitude
      from graves
      where latitude is not null and longitude is not null
    `;
  } catch (err) {
    error = err.message;
  }

  let center = DEFAULT_CENTER;
  let zoom = DEFAULT_ZOOM;

  const highlightedGrave = graves.find((g) => g.slug === highlightSlug);
  if (highlightedGrave) {
    center = [Number(highlightedGrave.latitude), Number(highlightedGrave.longitude)];
    zoom = 20;
  }

  return (
    <main style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Карта цвинтаря</h1>

      {error && (
        <p style={{ color: "red" }}>Помилка завантаження даних: {error}</p>
      )}

      {!error && (
        <MapLoader
          graves={graves}
          center={center}
          zoom={zoom}
          highlightSlug={highlightSlug}
        />
      )}
    </main>
  );
}
