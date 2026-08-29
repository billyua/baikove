import { sql } from "../../../../lib/db";
import { getSession } from "../../../../lib/session";
import MapLoader from "../../../../components/MapLoader";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function GravePage({ params }) {
  const session = await getSession();
  let grave = null;
  let error = null;

  try {
    const rows = await sql`select * from graves where slug = ${params.slug} limit 1`;
    grave = rows[0] || null;
  } catch (err) {
    error = err.message;
  }

  if (error || !grave) {
    return (
      <main style={{ padding: "40px", maxWidth: "700px", margin: "0 auto" }}>
        <p>
          <Link href="/directory">← До реєстру</Link>
        </p>
        <h1>Поховання не знайдено</h1>
        <p>Можливо, посилання застаріле, або запис було видалено.</p>
      </main>
    );
  }

  const fullName = [grave.last_name, grave.first_name, grave.middle_name]
    .filter(Boolean)
    .join(" ");

  const years = [grave.birth_year, grave.death_year].filter(
    (y) => y !== null && y !== undefined
  );
  const yearsText = years.length === 2
    ? `${grave.birth_year}–${grave.death_year}`
    : years.join("");

  // Map graves for the embedded map — same data shape as the homepage map.
  let mapGraves = [];
  let mapError = null;
  try {
    mapGraves = await sql`
      select id, slug, last_name, first_name, middle_name, birth_year, death_year, occupation,
             grave_section, latitude, longitude
      from graves
      where latitude is not null and longitude is not null
    `;
  } catch (err) {
    mapError = err.message;
  }

  return (
    <main style={{ padding: "40px", maxWidth: "700px", margin: "0 auto" }}>
      <p>
        <Link href="/directory">← До реєстру</Link>
        {session.isLoggedIn && (
          <>
            {" · "}
            <Link href={`/grave/${grave.slug}/edit`}>Редагувати →</Link>
          </>
        )}
      </p>

      <h1>{fullName}</h1>

      {yearsText && (
        <p style={{ fontSize: "18px", color: "#444", margin: "4px 0" }}>
          ({yearsText})
        </p>
      )}

      {grave.description && (
        <div
          style={{ lineHeight: "1.6", margin: "20px 0" }}
          dangerouslySetInnerHTML={{ __html: grave.description }}
        />
      )}

      {(grave.grave_section || grave.direction_text || grave.direction_scheme_url) && (
        <section style={{ margin: "24px 0" }}>
          <h2>Як знайти могилу</h2>

          {grave.grave_section && <p>Ділянка: {grave.grave_section}</p>}

          {grave.direction_text && (
            <div
              style={{ lineHeight: "1.6" }}
              dangerouslySetInnerHTML={{ __html: grave.direction_text }}
            />
          )}

          {grave.direction_scheme_url && (
            <img
              src={grave.direction_scheme_url}
              alt="Схема проходу до могили"
              style={{
                width: "100%",
                maxWidth: "500px",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
          )}
        </section>
      )}

      <section style={{ margin: "24px 0" }}>
        {mapError && (
          <p style={{ color: "red" }}>Помилка завантаження карти: {mapError}</p>
        )}
        {!mapError && (
          <MapLoader
            graves={mapGraves}
            center={[Number(grave.latitude), Number(grave.longitude)]}
            zoom={20}
            highlightSlug={grave.slug}
          />
        )}

        {grave.photo_url && (
        <h2>Фото могили</h2>
        <img
          src={grave.photo_url}
          alt={`Фото могили ${fullName}`}
          style={{
            width: "100%",
            maxWidth: "500px",
            borderRadius: "8px",
            margin: "20px 0",
          }}
        />
      )}
      </section>
    </main>
  );
}
