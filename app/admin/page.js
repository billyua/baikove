import { redirect } from "next/navigation";
import { getSession } from "../../lib/session";
import AdminForm from "../../components/AdminForm";
import LogoutButton from "../../components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getSession();

  if (!session.isLoggedIn) {
    redirect("/admin/login");
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
      <AdminForm />
    </main>
  );
}
