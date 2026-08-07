import type { MetadataRoute } from "next";
import { isMicroCmsConfigured } from "@/lib/microcms/env";
import { getWorks } from "@/lib/microcms/works";
import { siteUrl } from "@/lib/site";

export const revalidate = 3600;

const STATIC_ROUTES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/works", changeFrequency: "weekly", priority: 0.9 },
  { path: "/business", changeFrequency: "yearly", priority: 0.7 },
  { path: "/company", changeFrequency: "yearly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: siteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  if (!isMicroCmsConfigured()) return staticEntries;

  // CMS が落ちていてもサイトマップ自体は返せるようにする。
  // 作品URLが一時的に欠けるのは、sitemap がまるごと500になるより軽い。
  try {
    const works = await getWorks();
    return [
      ...staticEntries,
      ...works.map((work) => ({
        url: siteUrl(`/works/${work.id}`),
        lastModified: work.updatedAt ? new Date(work.updatedAt) : now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
    ];
  } catch (error) {
    console.warn(
      "[sitemap] failed to load works; returning static routes only.",
      error instanceof Error ? error.message : error,
    );
    return staticEntries;
  }
}
