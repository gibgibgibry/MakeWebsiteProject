import Link from "next/link";

type Props = {
  message: string;
  href: string;
  label: string;
  /** 見出しとして文書構造に載せるか（ホーム）、ただの一文か（事業内容） */
  as?: "h2" | "p";
  className?: string;
};

/** ピンクの角丸帯 + 白いボタン。白地の brand-ink は 5.63:1。 */
export default function CtaBand({
  message,
  href,
  label,
  as: Tag = "h2",
  className = "",
}: Props) {
  return (
    <div
      className={`flex flex-col items-start justify-between gap-6 rounded-card bg-brand-fill px-6 py-10 md:flex-row md:items-center md:px-10 ${className}`}
    >
      {/* auto-phrase: 和文を文節で折り返す（「ご／覧」のような語中の改行を防ぐ）。
          未対応ブラウザでは通常の折り返しになるだけ。
          本文列の中に置く "p"（事業内容）は幅が狭いので大きくしない（POC と同じ） */}
      <Tag
        className={`max-w-md font-display text-xl leading-relaxed text-paper [word-break:auto-phrase] ${
          Tag === "h2" ? "md:text-2xl" : ""
        }`}
      >
        {message}
      </Tag>
      <Link
        href={href}
        className="shrink-0 rounded-full bg-paper px-7 py-3 text-sm tracking-wide text-brand-ink transition-opacity hover:opacity-90"
      >
        {label}
      </Link>
    </div>
  );
}
