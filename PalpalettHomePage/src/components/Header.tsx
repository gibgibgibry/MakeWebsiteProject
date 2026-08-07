"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Home", index: "01" },
  { href: "/company", label: "会社情報", index: "02" },
  { href: "/business", label: "事業内容", index: "03" },
  { href: "/contact", label: "お問い合わせ", index: "04" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <Link
          href="/"
          className="font-serif text-xl tracking-wide text-ink"
          onClick={() => setOpen(false)}
        >
          Pal<span className="text-accent">Pallet</span>
        </Link>

        <nav className="hidden gap-8 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-baseline gap-2 text-sm tracking-wide transition-colors ${
                  active ? "text-accent" : "text-ink-soft hover:text-ink"
                }`}
              >
                <span className="text-[10px] text-line group-hover:text-accent">
                  {item.index}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          aria-label="メニューを開く"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex flex-col gap-1.5 md:hidden"
        >
          <span className="h-px w-6 bg-ink" />
          <span className="h-px w-6 bg-ink" />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col border-t border-line px-6 py-4 md:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-baseline gap-3 py-3 text-sm ${
                pathname === item.href ? "text-accent" : "text-ink-soft"
              }`}
            >
              <span className="text-[10px] text-line">{item.index}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
