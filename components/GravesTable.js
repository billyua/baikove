"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { buildDirectoryHref } from "../lib/directoryUrl";

const columns = [
  { key: "last_name", label: "Прізвище" },
  { key: "first_name", label: "Ім'я" },
  { key: "middle_name", label: "По батькові" },
  { key: "birth_year", label: "Рік народження" },
  { key: "death_year", label: "Рік смерті" },
  { key: "occupation", label: "Рід занять" },
  { key: "grave_section", label: "Ділянка" },
];

export default function GravesTable({ graves, currentParams }) {
  const router = useRouter();
  const activeSort = currentParams.sort || "last_name";
  const activeDir = currentParams.dir === "desc" ? "desc" : "asc";

  function headerHref(columnKey) {
    const isActive = activeSort === columnKey;
    const nextDir = isActive && activeDir === "asc" ? "desc" : "asc";
    return buildDirectoryHref(currentParams, {
      sort: columnKey,
      dir: nextDir,
      page: "1",
    });
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            {columns.map((col) => {
              const isActive = activeSort === col.key;
              return (
                <th key={col.key} style={thStyle}>
                  <Link
                    href={headerHref(col.key)}
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    {col.label}
                    {isActive ? (activeDir === "asc" ? " ▲" : " ▼") : ""}
                  </Link>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {graves.map((grave) => (
            <tr
              key={grave.id}
              className="grave-row"
              onClick={() => router.push(`/grave/${grave.slug}`)}
              style={{ cursor: "pointer" }}
            >
              <td style={tdStyle}>{grave.last_name}</td>
              <td style={tdStyle}>{grave.first_name}</td>
              <td style={tdStyle}>{grave.middle_name}</td>
              <td style={tdStyle}>{grave.birth_year}</td>
              <td style={tdStyle}>{grave.death_year}</td>
              <td style={tdStyle}>{grave.occupation}</td>
              <td style={tdStyle}>{grave.grave_section}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {graves.length === 0 && (
        <p style={{ padding: "16px", color: "#666" }}>Нічого не знайдено.</p>
      )}
    </div>
  );
}

const thStyle = {
  cursor: "pointer",
  textAlign: "left",
  padding: "10px",
  borderBottom: "2px solid #333",
  whiteSpace: "nowrap",
};

const tdStyle = { padding: "10px", borderBottom: "1px solid #ddd" };
