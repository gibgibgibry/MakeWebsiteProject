"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export type GalleryImage = {
  url: string;
  width: number;
  height: number;
  caption?: string;
};

type Props = {
  images: GalleryImage[];
  /** 代替テキストの土台にする作品名 */
  title: string;
};

/**
 * 作品画像のサムネイル一覧と、クリックで開く拡大表示（ライトボックス）。
 *
 * ネイティブの <dialog> を showModal() で開いている。フォーカストラップ、
 * Escキーで閉じる、背景の不活性化という「ライトボックスで最も間違えやすい部分」を
 * ブラウザ側が保証してくれるため、外部ライブラリより確実で軽い。
 */
export default function WorkGallery({ images, title }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  /**
   * 閉じたときにフォーカスを戻すサムネイルの位置。
   * close イベントの時点では index を消しているため、別に保持している。
   *
   * 戻す先は「開いたときのサムネイル」ではなく「最後に見ていた画像のサムネイル」。
   * ← → で移動したあと閉じたとき、直前に見ていた画像の位置にフォーカスが戻るほうが
   * 文脈を保てるため、意図的にこうしている。
   */
  const focusReturnIndexRef = useRef<number | null>(null);
  const [index, setIndex] = useState<number | null>(null);

  const hasMultiple = images.length > 1;

  const open = useCallback((i: number) => {
    focusReturnIndexRef.current = i;
    setIndex(i);
    dialogRef.current?.showModal();
  }, []);

  const step = useCallback(
    (delta: number) => {
      setIndex((current) => {
        if (current === null) return current;
        const next = (current + delta + images.length) % images.length;
        focusReturnIndexRef.current = next;
        return next;
      });
    },
    [images.length],
  );

  // <dialog> は Esc を自前で処理して close イベントを出す。
  // 閉じ方（Esc / ボタン / 背景クリック）に関わらず、ここで後片付けする。
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      const returnTo = focusReturnIndexRef.current;
      setIndex(null);
      focusReturnIndexRef.current = null;
      if (returnTo !== null) thumbRefs.current[returnTo]?.focus();
    };

    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, []);

  // showModal() は背景の操作は止めるが、ブラウザによっては背景スクロールまでは止めない。
  useEffect(() => {
    if (index === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [index]);

  if (images.length === 0) return null;

  const current = index === null ? null : images[index];

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {images.map((image, i) => (
          <li key={`${image.url}-${i}`}>
            <button
              type="button"
              ref={(el) => {
                thumbRefs.current[i] = el;
              }}
              onClick={() => open(i)}
              aria-label={`${title} の画像 ${i + 1} を拡大表示`}
              className="group block w-full overflow-hidden rounded-card border border-line bg-paper-soft transition-colors hover:border-brand-ui"
            >
              <Image
                src={image.url}
                alt={image.caption ?? `${title}（${i + 1}枚目）`}
                width={image.width}
                height={image.height}
                sizes="(max-width: 640px) 50vw, 30vw"
                className="h-auto w-full transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </button>
            {image.caption && (
              <p className="mt-2 text-xs text-ink-soft">{image.caption}</p>
            )}
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label={`${title} の拡大表示`}
        onClick={(event) => {
          // 背景（::backdrop）のクリックは dialog 自身が受け取る。
          // 中身をクリックしたときに閉じないよう、ターゲットが dialog のときだけ閉じる。
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
        onKeyDown={(event) => {
          if (!hasMultiple) return;
          if (event.key === "ArrowRight") {
            event.preventDefault();
            step(1);
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            step(-1);
          }
        }}
        className="m-auto max-h-[100dvh] max-w-[100vw] bg-transparent p-0 backdrop:bg-ink/80"
      >
        {current && (
          <div className="flex max-h-[100dvh] flex-col items-center gap-3 p-4">
            <div className="flex w-full items-center justify-between gap-4 text-paper">
              <p className="text-xs" aria-live="polite">
                {hasMultiple ? `${index! + 1} / ${images.length}` : ""}
              </p>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                aria-label="拡大表示を閉じる"
                className="rounded-full border border-paper/40 px-4 py-1.5 text-xs text-paper transition-colors hover:bg-paper hover:text-ink"
              >
                閉じる
              </button>
            </div>

            {/* 寸法の確定したコンテナ + fill + object-contain。
                width/height と w-auto の組み合わせだと、Tailwind preflight の
                `img { height: auto }` と相まって「実際に読み込んだ画像の固有サイズ」に
                依存してしまい、配信解像度が宣言値と違うと極端に小さく描画される。
                コンテナ側で寸法を決めればバイト列に依存せず、CLSも起きない。 */}
            <div className="relative h-[78dvh] w-[92vw] max-w-[1400px]">
              <Image
                src={current.url}
                alt={current.caption ?? `${title}（${index! + 1}枚目）`}
                fill
                sizes="92vw"
                className="object-contain"
              />
            </div>

            {current.caption && (
              <p className="text-center text-xs text-paper/80">
                {current.caption}
              </p>
            )}

            {hasMultiple && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="前の画像"
                  className="rounded-full border border-paper/40 px-5 py-2 text-sm text-paper transition-colors hover:bg-paper hover:text-ink"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="次の画像"
                  className="rounded-full border border-paper/40 px-5 py-2 text-sm text-paper transition-colors hover:bg-paper hover:text-ink"
                >
                  →
                </button>
              </div>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
