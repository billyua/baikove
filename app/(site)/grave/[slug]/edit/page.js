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
      <GraveForm mode="edit" initialGrave={grave} currentSlug={grave.slug} />
    </main>
  );
}
