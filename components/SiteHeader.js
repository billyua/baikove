"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navItems = [
  { href: "/", label: "Мапа" },
  { href: "/directory", label: "Реєстр" },
  { href: "/about", label: "Про сайт" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
        padding: "16px 40px",
        borderBottom: "1px solid #ddd",
      }}
    >
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <Image
          src="/logo.png"
          alt="Байкове кладовище. Імена"
          width={60}
          height={60}
          style={{ flexShrink: 0 }}
        />
        <span style={{ fontSize: "18px", fontWeight: "bold" }}>
          Байкове кладовище. Імена
        </span>
      </Link>

      <nav>
        <ul
          style={{
            display: "flex",
            gap: "24px",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                {isActive ? (
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "#933E2A",
                      cursor: "default",
                    }}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    style={{ color: "#333", textDecoration: "none" }}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
