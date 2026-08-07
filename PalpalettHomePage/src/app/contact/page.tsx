import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "PalPalletへのお問い合わせはこちらのフォームから承ります。",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
      <p className="text-sm tracking-[0.3em] text-accent">CONTACT</p>
      <h1 className="mt-4 font-serif text-3xl text-ink md:text-5xl">
        お問い合わせ
      </h1>
      <p className="mt-6 max-w-xl text-sm leading-loose text-ink-soft">
        誌面デザインのご相談やお見積もりのご依頼など、お気軽にお問い合わせください。
        担当者より折り返しご連絡いたします。
      </p>

      <div className="mt-14 grid gap-16 md:grid-cols-[1fr_20rem]">
        <ContactForm />

        <div className="text-sm leading-loose text-ink-soft">
          <p className="text-ink">メールでのお問い合わせ</p>
          <p className="mt-2">info@example.com</p>
          <p className="mt-8 text-ink">お電話でのお問い合わせ</p>
          <p className="mt-2">◯◯-◯◯◯◯-◯◯◯◯</p>
        </div>
      </div>
    </div>
  );
}
