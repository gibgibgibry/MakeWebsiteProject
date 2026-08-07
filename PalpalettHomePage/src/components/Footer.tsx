import Link from "next/link";
import { NAV_ITEMS } from "@/lib/navigation";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-paper-soft">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <p className="font-display text-2xl text-ink">
            Pal<span className="text-brand-ink">pallette</span>
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-soft">
            雑誌・コミックス・書籍からロゴまで。
            <br />
            かわいいデザイン、柔らかいデザインをお任せください。
          </p>
        </div>

        <nav
          aria-label="フッターメニュー"
          className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-brand-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-line px-6 py-4 text-xs text-ink-soft md:px-10">
        &copy; {new Date().getFullYear()} Palpallette
      </div>
    </footer>
  );
}
