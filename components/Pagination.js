import Link from "next/link";
import { buildDirectoryHref, getPageNumbers } from "../lib/directoryUrl";

export default function Pagination({ currentParams, currentPage, totalPages }) {
  const pageNumbers = getPageNumbers(currentPage, totalPages);
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  return (
    <nav
      aria-label="Пагінація"
      style={{
        display: "flex",
        gap: "8px",
        alignItems: "center",
        flexWrap: "wrap",
        margin: "24px 0",
      }}
    >
      {isFirst ? (
        <span style={inactiveStyle}>← Назад</span>
      ) : (
        <Link
          href={buildDirectoryHref(currentParams, { page: currentPage - 1 })}
          style={linkStyle}
        >
          ← Назад
        </Link>
      )}

      {pageNumbers.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} style={inactiveStyle}>
            …
          </span>
        ) : p === currentPage ? (
          <span key={p} style={currentStyle}>
            {p}
          </span>
        ) : (
          <Link key={p} href={buildDirectoryHref(currentParams, { page: p })} style={linkStyle}>
            {p}
          </Link>
        )
      )}

      {isLast ? (
        <span style={inactiveStyle}>Уперед →</span>
      ) : (
        <Link
          href={buildDirectoryHref(currentParams, { page: currentPage + 1 })}
          style={linkStyle}
        >
          Уперед →
        </Link>
      )}
    </nav>
  );
}

const linkStyle = {
  padding: "6px 10px",
  textDecoration: "none",
  color: "#333",
  border: "1px solid #ccc",
  borderRadius: "4px",
};

const currentStyle = {
  padding: "6px 10px",
  fontWeight: "bold",
  color: "#933E2A",
  border: "1px solid #933E2A",
  borderRadius: "4px",
};

const inactiveStyle = {
  padding: "6px 10px",
  color: "#aaa",
  border: "1px solid #eee",
  borderRadius: "4px",
  cursor: "default",
};
