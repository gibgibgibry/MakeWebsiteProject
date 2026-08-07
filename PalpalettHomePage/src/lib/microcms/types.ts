/** microCMS が全コンテンツに付与するメタフィールド。 */
export type MicroCmsContentMeta = {
  id: string;
  createdAt: string;
  updatedAt: string;
  /** 下書きを draftKey 付きで取得した場合は付かない */
  publishedAt?: string;
  revisedAt?: string;
};

export type MicroCmsListResponse<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};

export type MicroCmsImage = {
  url: string;
  width: number;
  height: number;
};

export type Category = MicroCmsContentMeta & {
  name: string;
  order?: number;
};

export type WorkImage = {
  fieldId: "workImage";
  image: MicroCmsImage;
  caption?: string;
};

export type Work = MicroCmsContentMeta & {
  title: string;
  client?: string;
  /**
   * microCMS のスキーマ上は必須にしていても、参照先カテゴリーが「下書き」のままだと
   * 公開APIからは null で返ってくる。nullable にしておかないと本番で 500 になる。
   * （depth=0 で取得すると参照がただの ID 文字列に潰れるので depth は既定の 1 のまま使う）
   */
  category: Category | null;
  coverImage: MicroCmsImage;
  gallery?: WorkImage[];
  year?: number;
  publishedOn?: string;
  role?: string[];
  description?: string;
  order?: number;
  featured?: boolean;
};

/** 一覧カードの描画と sitemap に必要な最小限のフィールド。 */
export type WorkSummary = Pick<
  Work,
  | "id"
  | "title"
  | "client"
  | "category"
  | "coverImage"
  | "year"
  | "featured"
  | "order"
  // sitemap の lastModified に使う
  | "updatedAt"
>;
