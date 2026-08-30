import type { MetadataRoute } from "next";

// ⚠️ Замените на реальный домен после деплоя (или на текущий Vercel-адрес)
const BASE_URL = "https://my-portfolio-kappa-orcin-91.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
