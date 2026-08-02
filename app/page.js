import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { data: graves, error } = await supabase
    .from("graves")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main style={{ padding: "40px", maxWidth: "700px", margin: "0 auto" }}>
      <h1>Меморіальний цвинтар</h1>
      <p>Це тестова сторінка, яка перевіряє з&apos;єднання з базою даних.</p>
      <p>
        <Link href="/directory">Перейти до каталогу поховань →</Link>
      </p>
      <p>
        <Link href="/map">Перейти до карти цвинтаря →</Link>
      </p>

      {error && (
        <p style={{ color: "red" }}>
          Помилка з&apos;єднання з базою даних: {error.message}
        </p>
      )}

      {!error && graves && graves.length === 0 && (
        <p>З&apos;єднання працює, але в базі даних поки немає жодного запису.</p>
      )}

      {!error && graves && graves.length > 0 && (
        <>
          <p style={{ color: "green" }}>
            З&apos;єднання працює! Знайдено записів: {graves.length}
          </p>
          <ul>
            {graves.map((grave) => (
              <li key={grave.id}>
                {grave.last_name} {grave.first_name} {grave.middle_name} (
                {grave.birth_year}–{grave.death_year}) — {grave.occupation}
              </li>
            ))}
          </ul>
        </>
      )}

      <p style={{ marginTop: "60px", fontSize: "13px" }}>
        <Link href="/admin/login" style={{ color: "#999" }}>
          Вхід для адміністратора
        </Link>
      </p>
    </main>
  );
}
