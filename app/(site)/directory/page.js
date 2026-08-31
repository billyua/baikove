import { sql } from "../../../lib/db";
import { sortGraves } from "../../../lib/sortGraves";
import GravesTable from "../../../components/GravesTable";
import Pagination from "../../../components/Pagination";
import DirectorySearch from "../../../components/DirectorySearch";
import Link from "next/link";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

// Whitelist of columns that may be used for sorting.
const ALLOWED_SORT_COLUMNS = new Set([
  "last_name",
  "first_name",
  "middle_name",
  "birth_year",
  "death_year",
  "occupation",
  "grave_section",
]);

export default async function DirectoryPage({ searchParams }) {
  const q = (searchParams?.q || "").trim();
  const sortColumn = ALLOWED_SORT_COLUMNS.has(searchParams?.sort)
    ? searchParams.sort
    : "last_name";
  const sortDir = searchParams?.dir === "desc" ? "desc" : "asc";
  const requestedPage = Math.max(1, parseInt(searchParams?.page, 10) || 1);

  let graves = [];
  let totalCount = 0;
  let error = null;
  let currentPage = requestedPage;
  let totalPages = 1;

  try {
    const pattern = `%${q}%`;

    // Filtering stays in SQL (that part of Postgres's default collation is
    // fine for substring matching). Sorting does NOT stay in SQL — its
    // default collation doesn't follow correct Ukrainian alphabetical order,
    // and has no concept of treating embedded numbers (like in "52a")
    // numerically. So: fetch every matching row, unsorted, then sort in
    // JavaScript using the Ukrainian locale, then paginate afterward.
    const allMatching = await sql`
      select id, slug, last_name, first_name, middle_name, birth_year, death_year,
             occupation, grave_section
      from graves
      where last_name ilike ${pattern}
         or first_name ilike ${pattern}
         or middle_name ilike ${pattern}
         or occupation ilike ${pattern}
         or grave_section ilike ${pattern}
         or cast(birth_year as text) ilike ${pattern}
         or cast(death_year as text) ilike ${pattern}
    `;

    const sorted = sortGraves(allMatching, sortColumn, sortDir);

    totalCount = sorted.length;
    totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    // Clamp in case a filter shrank the result set below the requested page.
    currentPage = Math.min(requestedPage, totalPages);
    const offset = (currentPage - 1) * PAGE_SIZE;

    graves = sorted.slice(offset, offset + PAGE_SIZE);
  } catch (err) {
    error = err.message;
  }

  const currentParams = {
    q,
    sort: sortColumn,
    dir: sortDir,
    page: String(currentPage),
  };

  const isFiltered =
    currentParams.q !== "" ||
    currentParams.sort !== "last_name" ||
    currentParams.dir !== "asc" ||
    currentParams.page !== "1";

  return (
    <main style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
      <p>
        <Link href="/">← До мапи</Link>
      </p>
      <h1>Реєстр поховань</h1>

      {error && (
        <p style={{ color: "red" }}>Помилка завантаження даних: {error}</p>
      )}

      {!error && (
        <>
          <DirectorySearch currentParams={currentParams} />
          <p
            style={{
              color: "#666",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span>Знайдено записів: {totalCount}</span>
            {isFiltered && (
              <Link href="/directory" style={{ color: "#933E2A" }}>
                Очистити ⨯
              </Link>
            )}
          </p>
          <GravesTable graves={graves} currentParams={currentParams} />
          <Pagination
            currentParams={currentParams}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </>
      )}
    </main>
  );
}
