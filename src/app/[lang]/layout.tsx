import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Onest, IBM_Plex_Mono, Zen_Kaku_Gothic_New, Noto_Sans_SC } from "next/font/google";
import "../globals.css";
import { locales, defaultLocale } from "../../dictionaries";
import { siteConfig } from "@/lib/data";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const onest = Onest({
  subsets: ["latin", "cyrillic"],
  variable: "--font-onest",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  display: "swap",
});

const zenKaku = Zen_Kaku_Gothic_New({
  subsets: ["latin"],
  variable: "--font-zen-kaku",
  weight: ["400", "700"],
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-noto-sc",
  weight: ["400", "700"],
  display: "swap",
});

const SITE_URL = "https://my-portfolio-kappa-orcin-91.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  return {
    title: `${siteConfig.name} — ${siteConfig.title}`,
    description: siteConfig.description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: `${SITE_URL}/${lang}`,
      // Each locale has its own URL (/ru, /en, ...) — tell search engines
      // they're translations of the same page, not separate/duplicate ones.
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}`])),
        "x-default": `${SITE_URL}/${defaultLocale}`,
      },
    },
    openGraph: {
      title: `${siteConfig.name} — ${siteConfig.title}`,
      description: siteConfig.description,
      type: "website",
      locale: lang,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0a0908",
};

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;

  return (
    // The font variables have to live on <html>, not <body>: globals.css
    // builds --font-display/--font-body/--font-mono on :root out of them, and
    // a var() is resolved in the scope of the element the custom property is
    // declared on. With the classes on <body> those tokens computed to the
    // guaranteed-invalid value on :root and inherited down empty, so every
    // font silently fell back to the default sans stack.
    <html
      lang={lang}
      className={`${bricolage.variable} ${onest.variable} ${plexMono.variable} ${zenKaku.variable} ${notoSansSC.variable}`}
    >
      <body className="antialiased">{props.children}</body>
    </html>
  );
}
