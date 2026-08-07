import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Webhook の受け口をクロールさせる意味はない
      disallow: ["/api/"],
    },
    sitemap: siteUrl("/sitemap.xml"),
  };
}
