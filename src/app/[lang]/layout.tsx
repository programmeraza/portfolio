import type { Metadata } from "next";
import { Space_Grotesk, Inter, Noto_Sans_JP } from "next/font/google";
import "../globals.css";
import { locales } from "../../dictionaries";

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

export const metadata: Metadata = {
  title: "YOUR NAME — Frontend Developer",
  description:
    "Frontend Developer specializing in React, Next.js, and immersive web animations. Building exceptional digital experiences.",
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
