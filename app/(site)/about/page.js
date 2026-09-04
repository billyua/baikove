import Link from "next/link";
import TwoImagesWithCaptions from "../../../components/TwoImagesWithCaptions";
import { sql } from "../../../lib/db";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  let randomGrave = null;
  try {
    const rows = await sql`
      select slug, last_name, first_name, middle_name
      from graves
      order by random()
      limit 1
    `;
    randomGrave = rows[0] || null;
  } catch (err) {
    // fail quietly — the rest of the About page should still render
  }

  const randomFullName = randomGrave
    ? [randomGrave.last_name, randomGrave.first_name, randomGrave.middle_name]
        .filter(Boolean)
        .join(" ")
    : null;

  return (
    // ...your existing JSX
  );
}

export default function AboutPage() {
  return (
    <main style={{ padding: "40px", maxWidth: "700px", margin: "0 auto" }}>
      <h1>Про сайт</h1>
      <p>Мета сайту — допомогти відвідувачам Байкового кладовища знайти поховання видатних людей.</p>
      <p>Як це працює:</p>
      <p>→ <Link href="/">Мапа цвинтаря</Link> містить позначки могил.</p>
        <TwoImagesWithCaptions
        leftSrc="/about/grave-pin.png" leftBordered
        leftAlt="Позначка могили"
        leftCaption="Натисніть на позначку, щоб побачити, чия це могила."
        rightSrc="/about/section-widget.png" rightBordered
        rightAlt="Перелік до ділянки"
        rightCaption="Натисніть на ділянку, щоб побачити перелік людей, які там поховані."
      />
      <p>→ <Link href="/directory">Реєстр</Link> містить перелік поховань у вигляді таблиці.</p>
        <TwoImagesWithCaptions
        leftSrc="/about/table-search.png" leftBordered
        leftAlt="Пошук поховань"
        leftCaption="Шукайте поховання за іменем, родом занять, роками життя або номером ділянки."
        rightSrc="/about/table-sort.png" rightBordered
        rightAlt="Сортування поховань"
        rightCaption="Натисніть на заголовок стовпчика, щоб відсортувати дані за ним."
      />
      <p>→ Індивідуальні сторінки поховань містять довідкову інформацію про людину та підсвічують її могилу на мапі.</p>
      {randomGrave && (
  <p>
    Наприклад:{" "}
    <Link href={`/grave/${randomGrave.slug}`}>{randomFullName}</Link>
  </p>
)}
    </main>
  );
}
