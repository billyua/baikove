import { supabase } from "../../lib/supabaseClient";
import GravesTable from "../../components/GravesTable";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DirectoryPage() {
  const { data: graves, error } = await supabase
    .from("graves")
    .select(
      "id, last_name, first_name, middle_name, birth_year, death_year, occupation, grave_section"
    )
    .order("last_name", { ascending: true });

  return (
    <main style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
      <p>
        <Link href="/">← На головну</Link>
      </p>
      <h1>Каталог поховань</h1>

      {error && (
        <p style={{ color: "red" }}>
          Помилка завантаження даних: {error.message}
        </p>
      )}

      {!error && <GravesTable graves={graves ?? []} />}
    </main>
  );
}
