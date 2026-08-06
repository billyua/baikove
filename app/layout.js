import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "Байкове кладовище. Імена",
  description: "Реєстр і мапа поховань на Байковому кладовищі",
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
