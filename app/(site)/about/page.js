import Link from "next/link";
import TwoImagesWithCaptions from "../../../components/TwoImagesWithCaptions";

export default function AboutPage() {
  return (
    <main style={{ padding: "40px", maxWidth: "700px", margin: "0 auto" }}>
      <h1>Про сайт</h1>
      <p>Мета сайту — допомогти відвідувачам Байкового кладовища знайти поховання видатних людей.</p>
      <p>Як це працює:</p>
      <p><Link href="/">Мапа цвинтаря</Link> містить позначки могил.</p>
        <TwoImagesWithCaptions
        leftSrc="/about/grave-pin.png"
        leftAlt="Позначка могили"
        leftCaption="Натисніть на позначку, щоб побачити, чия це могила."
        rightSrc="/about/section-widget.png"
        rightAlt="Перелік до ділянки"
        rightCaption="Натисніть на ділянку, щоб побачити перелік людей, які там поховані."
      />
      <p><Link href="/directory">Реєстр</Link> містить перелік поховань у вигляді таблиці.</p>
        <TwoImagesWithCaptions
        leftSrc="/about/table-search.png"
        leftAlt="Пошук поховань"
        leftCaption="Шукайте поховання за іменем, родом занять, роками життя або номером ділянки."
        rightSrc="/about/table-sort.png"
        rightAlt="Сортування поховань"
        rightCaption="Натисніть на заголовок стовпчика, щоб відсортувати дані за ним."
      />
      <p>Індивідуальні сторінки поховань містять довідкову інформацію про людину та підсвічують її могилу на мапі.</p>
    </main>
  );
}
