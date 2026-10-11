import { redirect, notFound } from "next/navigation";
import { getSession } from "../../../../../lib/session";
import { sql } from "../../../../../lib/db";
import GraveForm from "../../../../../components/GraveForm";
import LogoutButton from "../../../../../components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function EditGravePage({ params }) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    redirect(`/admin/login`);
  }

  const rows = await sql`select * from graves where slug = ${params.slug} limit 1`;
  const grave = rows[0];

  if (!grave) {
    notFound();
  }

  // Every *other* grave, shown as small dots on the coordinate-picker map.
  // The grave being edited is excluded: its position is represented by the
  // fixed center pin, so showing its old saved location too would be confusing.
  let otherGraves = [];
  try {
    otherGraves = await sql`
      select id, slug, last_name, first_name, birth_year, death_year,
             latitude, longitude
      from graves
      where latitude is not null and longitude is not null
        and slug != ${params.slug}
    `;
  } catch (err) {
    // The form still works without the extra dots, so fail quietly.
  }

  return (
    <main style={{ padding: "40px", maxWidth: "700px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Редагувати поховання</h1>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
            Увійшли як: {session.username}
          </p>
          <LogoutButton />
        </div>
      </div>
      <GraveForm
        mode="edit"
        initialGrave={grave}
        currentSlug={grave.slug}
        otherGraves={otherGraves}
      />
    </main>
  );
}
