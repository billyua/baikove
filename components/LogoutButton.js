"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button onClick={handleLogout} style={buttonStyle}>
      Вийти
    </button>
  );
}

const buttonStyle = {
  padding: "8px 14px",
  fontSize: "14px",
  backgroundColor: "#eee",
  border: "1px solid #ccc",
  borderRadius: "6px",
  cursor: "pointer",
};
