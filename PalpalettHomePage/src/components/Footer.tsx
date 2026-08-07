import Link from "next/link";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/company", label: "会社情報" },
  { href: "/business", label: "事業内容" },
  { href: "/contact", label: "お問い合わせ" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <p className="font-serif text-2xl text-ink">
            Pal<span className="text-accent">Pallet</span>
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
            雑誌・書籍のデザインを手がける編集デザインスタジオ。
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-accent">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-line px-6 py-4 text-xs text-ink-soft md:px-10">
        &copy; {new Date().getFullYear()} PalPallet
      </div>
    </footer>
  );
}
