import { sql } from "../../../lib/db";
import GravesTable from "../../../components/GravesTable";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DirectoryPage() {
  let graves = [];
  let error = null;

  try {
    graves = await sql`
      select id, last_name, first_name, middle_name, birth_year, death_year,
             occupation, grave_section
      from graves
      order by last_name asc
    `;
  } catch (err) {
    error = err.message;
  }

  return (
    <main style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
      <p>
        <Link href="/">← На головну</Link>
      </p>
      <h1>Реєстр поховань</h1>

      {error && (
        <p style={{ color: "red" }}>Помилка завантаження даних: {error}</p>
      )}

      {!error && <GravesTable graves={graves} />}
    </main>
  );
}
