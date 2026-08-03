export const metadata = {
  title: "Меморіальний цвинтар",
  description: "Знайдіть могили відомих людей на цвинтарі",
};

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body
        style={{
          margin: 0,
          fontFamily: "Arial, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
