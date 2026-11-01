import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import PageBand from "@/components/PageBand";
import SidebarLayout from "@/components/SidebarLayout";
import { SERVICES } from "@/lib/services";

export const metadata: Metadata = {
  title: "事業内容",
  description:
    "Palpalletteは雑誌の表紙・誌面デザイン、コミックス・書籍の装丁、ポスター・パンフレット・チラシ、ロゴデザインを手がけています。",
};

export default function BusinessPage() {
  return (
    <>
      <PageBand eyebrow="BUSINESS" title="事業内容" />
      <SidebarLayout>
        <p className="text-sm leading-loose text-ink-soft">
          出版社の雑誌・コミックスを中心に、紙面まわりのデザインを幅広く手がけています。かわいいデザイン、柔らかいデザイン全般、お任せください。
        </p>

        <div className="mt-10 space-y-6">
          {SERVICES.map((service) => (
            <article
              key={service.index}
              className="grid grid-cols-1 gap-4 rounded-card border border-line bg-paper p-6 md:grid-cols-[6rem_1fr] md:gap-8"
            >
              <p className="font-display text-4xl text-brand-ui">{service.index}</p>
              <div>
                <h2 className="font-display text-xl text-ink">{service.title}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-loose text-ink-soft">
                  {service.body}
                </p>
                <p className="mt-4 inline-block rounded-full bg-brand-wash px-4 py-1.5 text-xs text-brand-ink">
                  {service.examples}
                </p>
              </div>
            </article>
          ))}
        </div>

        <CtaBand
          as="p"
          message="手がけた仕事は、実績ページでご覧いただけます。"
          href="/works"
          label="実績を見る"
          className="mt-14"
        />
      </SidebarLayout>
    </>
  );
}
