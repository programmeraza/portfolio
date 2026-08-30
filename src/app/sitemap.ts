import type { MetadataRoute } from "next";
import { locales, defaultLocale } from "../dictionaries";

// ⚠️ Замените на реальный домен после деплоя (или на текущий Vercel-адрес)
const BASE_URL = "https://my-portfolio-kappa-orcin-91.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${BASE_URL}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === defaultLocale ? 1 : 0.8,
  }));
}
