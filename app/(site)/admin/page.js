import { redirect } from "next/navigation";
import { getSession } from "../../../lib/session";
import { sql } from "../../../lib/db";
import GraveForm from "../../../components/GraveForm";
import LogoutButton from "../../../components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getSession();

  if (!session.isLoggedIn) {
    redirect("/admin/login");
  }

  // Existing graves, shown as small dots on the coordinate-picker map so the
  // admin can see what's already nearby when placing a new one.
  let otherGraves = [];
  try {
    otherGraves = await sql`
      select id, slug, last_name, first_name, birth_year, death_year,
             latitude, longitude
      from graves
      where latitude is not null and longitude is not null
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
        <h1>Додати поховання</h1>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
            Увійшли як: {session.username}
          </p>
          <LogoutButton />
        </div>
      </div>
      <GraveForm mode="create" otherGraves={otherGraves} />
    </main>
  );
}
