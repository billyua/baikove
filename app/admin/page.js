"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import AdminForm from "../../components/AdminForm";

export default function AdminPage() {
  const [session, setSession] = useState(undefined); // undefined = checking, null = logged out
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) {
        router.push("/admin/login");
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        if (!newSession) {
          router.push("/admin/login");
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  if (session === undefined) {
    return (
      <main style={{ padding: "40px" }}>
        <p>Завантаження...</p>
      </main>
    );
  }

  if (!session) {
    return null; // redirect in progress
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
        <button onClick={handleLogout} style={logoutButtonStyle}>
          Вийти
        </button>
      </div>
      <AdminForm />
    </main>
  );
}

const logoutButtonStyle = {
  padding: "8px 14px",
  fontSize: "14px",
  backgroundColor: "#eee",
  border: "1px solid #ccc",
  borderRadius: "6px",
  cursor: "pointer",
};
