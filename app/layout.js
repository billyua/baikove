import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "Меморіальний цвинтар",
  description: "Знайдіть могили відомих людей на цвинтарі",
};

export default function RootLayout({ children }) {
  return (
    <html lang="uk" className={roboto.className}>
      <body
        style={{
          margin: 0,
          backgroundColor: "#F8F8F0",
        }}
      >
        {children}
      </body>
    </html>
  );
}
