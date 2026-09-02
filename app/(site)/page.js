import { sql } from "../../lib/db";
import MapLoader from "../../components/MapLoader";
import Link from "next/link";

export const dynamic = "force-dynamic";

// The map's default view when no specific grave is highlighted.
const DEFAULT_CENTER = [50.418671547541706, 30.51021526307843];
const DEFAULT_ZOOM = 16;

export default async function HomePage({ searchParams }) {
  const highlightSlug = searchParams?.highlight ?? null;

  let graves = [];
  let totalCount = 0;
  let randomGrave = null;
  let error = null;

  try {
    graves = await sql`
      select id, slug, last_name, first_name, middle_name, birth_year, death_year, occupation,
             grave_section, latitude, longitude
      from graves
      where latitude is not null and longitude is not null
    `;

    const countRows = await sql`select count(*) as count from graves`;
    totalCount = Number(countRows[0].count);

    const randomRows = await sql`
      select slug, last_name, first_name, middle_name
      from graves
      order by random()
      limit 1
    `;
    randomGrave = randomRows[0] || null;
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

  const randomFullName = randomGrave
    ? [randomGrave.last_name, randomGrave.first_name, randomGrave.middle_name]
        .filter(Boolean)
        .join(" ")
    : null;

  return (
    <main style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <p>
        <Link href="/directory">До реєстру →</Link>
      </p>
      <h1>Мапа поховань</h1>

      <p style={{ color: "#666", fontSize: "14px" }}>
        Усього записів: {totalCount}
      </p>

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
	  <p style={{ fontSize: "13px" }}>Кордони ділянок і розташування поховань на мапі можуть дещо відрізнятися від реальних координат.</p>

      {!error && randomGrave && (
        <p style={{ marginTop: "16px" }}>
          Випадкове ім&apos;я:{" "}
          <Link href={`/grave/${randomGrave.slug}`}>{randomFullName}</Link>
        </p>
      )}
    </main>
  );
}
