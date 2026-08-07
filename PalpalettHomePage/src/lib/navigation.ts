/** ヘッダーとフッターで共有するナビゲーション定義。
 *  以前は両者に同じ配列が重複していて、片方だけ更新される事故が起きやすかった。 */
export type NavItem = {
  href: string;
  label: string;
};

export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/", label: "ホーム" },
  { href: "/works", label: "実績" },
  { href: "/business", label: "事業内容" },
  { href: "/company", label: "会社情報" },
  { href: "/contact", label: "お問い合わせ" },
] as const;
