"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Невірні дані для входу.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main style={{ padding: "40px", maxWidth: "400px", margin: "0 auto" }}>
      <h1>Вхід для адміністратора</h1>
      <form
        onSubmit={handleLogin}
        style={{ display: "flex", flexDirection: "column", gap: "14px" }}
      >
        {error && <p style={{ color: "red" }}>{error}</p>}

        <label>
          Ім&apos;я користувача
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
          />
        </label>

        <label>
          Пароль
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
        </label>

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? "Вхід..." : "Увійти"}
        </button>
      </form>
    </main>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "8px",
  marginTop: "4px",
  boxSizing: "border-box",
  fontSize: "16px",
};

const buttonStyle = {
  padding: "10px",
  fontSize: "16px",
  backgroundColor: "#333",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};
