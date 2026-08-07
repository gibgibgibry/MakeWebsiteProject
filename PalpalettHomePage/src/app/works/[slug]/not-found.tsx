import Link from "next/link";

export default function WorkNotFound() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
      <p className="text-sm tracking-[0.3em] text-brand-ink">NOT FOUND</p>
      <h1 className="mt-4 font-display text-2xl text-ink md:text-4xl">
        お探しの実績が見つかりませんでした
      </h1>
      <p className="mt-6 max-w-xl text-sm leading-loose text-ink-soft">
        URLが変更されたか、公開が終了した可能性があります。
        一覧から改めてお探しください。
      </p>
      <Link
        href="/works"
        className="mt-10 inline-block rounded-full bg-brand-ink px-7 py-3 text-sm tracking-wide text-paper transition-opacity hover:opacity-90"
      >
        実績一覧へ
      </Link>
    </div>
  );
}
