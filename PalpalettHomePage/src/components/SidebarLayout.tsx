import Sidebar from "./Sidebar";

type Props = {
  children: React.ReactNode;
  showRecent?: boolean;
  /** 2カラムの下に全幅で置く要素（ホームの CTA 帯など） */
  after?: React.ReactNode;
};

/** 本文 + 右サイドバーの2カラム（モバイルでは本文の下にサイドバー）。 */
export default function SidebarLayout({ children, showRecent, after }: Props) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-16">
      <div className="flex flex-col gap-12 md:flex-row md:items-start">
        <div className="min-w-0 flex-1">{children}</div>
        <Sidebar showRecent={showRecent} />
      </div>
      {after}
    </div>
  );
}
