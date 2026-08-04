import { sql } from "../../../../lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function GravePage({ params }) {
  let grave = null;
  let error = null;

  try {
    const rows = await sql`select * from graves where id = ${params.id} limit 1`;
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

  return (
    <main style={{ padding: "40px", maxWidth: "700px", margin: "0 auto" }}>
      <p>
        <Link href="/directory">← До реєстру</Link>
        {" · "}
        <Link href={`/?highlight=${grave.id}`}>Показати на карті →</Link>
      </p>

      <h1>{fullName}</h1>

      <p style={{ fontSize: "18px", color: "#444" }}>
        {grave.occupation}
        <br />
        {grave.birth_year} – {grave.death_year}
        {grave.grave_section && (
          <>
            <br />
            Сектор: {grave.grave_section}
          </>
        )}
      </p>

      {grave.photo_url && (
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

      {grave.description && (
        <section style={{ margin: "24px 0" }}>
          <h2>Біографія</h2>
          <div
            style={{ lineHeight: "1.6" }}
            dangerouslySetInnerHTML={{ __html: grave.description }}
          />
        </section>
      )}

      {(grave.direction_text || grave.direction_scheme_url) && (
        <section style={{ margin: "24px 0" }}>
          <h2>Як знайти могилу від головного входу</h2>
          {grave.direction_text && <p>{grave.direction_text}</p>}
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

      <p>
        <Link href={`/?highlight=${grave.id}`}>
          Показати цю могилу на інтерактивній карті →
        </Link>
      </p>
    </main>
  );
}
