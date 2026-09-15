import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, Noto_Sans_JP } from "next/font/google";
import "../globals.css";
import { locales, defaultLocale } from "../../dictionaries";
import { siteConfig } from "@/lib/data";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-jp",
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
  themeColor: "#0b0c16",
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
    <html lang={lang} className="scroll-smooth">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${notoSansJP.variable} antialiased`}
      >
        {props.children}
      </body>
    </html>
  );
}
