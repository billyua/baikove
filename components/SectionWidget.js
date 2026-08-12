"use client";

import Link from "next/link";

export default function SectionWidget({ sectionNumber, graves, onClose }) {
  return (
    <div
      style={{
        width: "35ch",
        maxHeight: "460px",
        background: "#fff",
        borderRadius: "6px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 10px",
          borderBottom: "1px solid #eee",
          flexShrink: 0,
        }}
      >
        <strong style={{ fontSize: "14px" }}>Ділянка {sectionNumber}</strong>
        <button
          onClick={onClose}
          aria-label="Закрити"
          style={{
            background: "none",
            border: "none",
            fontSize: "16px",
            lineHeight: 1,
            cursor: "pointer",
            color: "#666",
            padding: "2px 4px",
          }}
        >
          ✕
        </button>
      </div>

      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: "8px 10px",
          overflowY: "auto",
        }}
      >
        {graves.map((grave) => {
          const fullName = [grave.last_name, grave.first_name, grave.middle_name]
            .filter(Boolean)
            .join(" ");
          return (
            <li key={grave.slug} style={{ margin: "6px 0" }}>
              <Link
                href={`/grave/${grave.slug}`}
                style={{ color: "#933E2A", fontSize: "14px" }}
              >
                {fullName}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
