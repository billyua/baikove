import { sql } from "../../../lib/db";
import GravesTable from "../../../components/GravesTable";
import Pagination from "../../../components/Pagination";
import DirectorySearch from "../../../components/DirectorySearch";
import Link from "next/link";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

// Whitelist of columns that may be used for sorting — never build the
// ORDER BY clause from unvalidated input.
const ALLOWED_SORT_COLUMNS = {
  last_name: "last_name",
  first_name: "first_name",
  middle_name: "middle_name",
  birth_year: "birth_year",
  death_year: "death_year",
  occupation: "occupation",
  grave_section: "grave_section",
};

export default async function DirectoryPage({ searchParams }) {
  const q = (searchParams?.q || "").trim();
  const sortColumn = ALLOWED_SORT_COLUMNS[searchParams?.sort] || "last_name";
  const sortDir = searchParams?.dir === "desc" ? "desc" : "asc";
  const requestedPage = Math.max(1, parseInt(searchParams?.page, 10) || 1);

  let graves = [];
  let totalCount = 0;
  let error = null;
  let currentPage = requestedPage;
  let totalPages = 1;

  try {
    const pattern = `%${q}%`;

    const countRows = await sql`
      select count(*) as count from graves
      where last_name ilike ${pattern}
         or first_name ilike ${pattern}
         or middle_name ilike ${pattern}
         or occupation ilike ${pattern}
         or grave_section ilike ${pattern}
         or cast(birth_year as text) ilike ${pattern}
         or cast(death_year as text) ilike ${pattern}
    `;
    totalCount = Number(countRows[0].count);
    totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    // Clamp in case a filter shrank the result set below the requested page.
    currentPage = Math.min(requestedPage, totalPages);
    const offset = (currentPage - 1) * PAGE_SIZE;

    // sortColumn/sortDir come from a fixed whitelist above, so it's safe to
    // splice them in as raw SQL via sql.unsafe() — search/pagination values
    // stay fully parameterized.
    graves = await sql`
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
      order by ${sql.unsafe(sortColumn)} ${sql.unsafe(sortDir)}, id asc
      limit ${PAGE_SIZE} offset ${offset}
    `;
  } catch (err) {
    error = err.message;
  }

  const currentParams = {
    q,
    sort: sortColumn,
    dir: sortDir,
    page: String(currentPage),
  };

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
          <p style={{ color: "#666", fontSize: "14px" }}>
            Знайдено записів: {totalCount}
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
