"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// UI
import Loader from "@/components/ui/Loader";
import Navigation from "@/components/ui/Navigation";
import Footer from "@/components/ui/Footer";
import Marquee from "@/components/ui/Marquee";

// Sections
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";
import { use } from "react";
import { getDictionary, Locale } from "../../dictionaries";
import type { Dictionary } from "../../dictionaries/types";

// Cursor — no SSR
const CustomCursor = dynamic(
  () => import("@/components/ui/CustomCursor"),
  { ssr: false }
);

export default function Home(props: { params: Promise<{ lang: string }> }) {
  const { lang } = use(props.params);

  const [loaded, setLoaded] = useState(false);
  const [dict, setDict] = useState<Dictionary | null>(null);
  const [dictError, setDictError] = useState(false);

  // Загружаем словарь, но НЕ блокируем показ Loader'а — первый экран
  // должен появляться мгновенно, а не после ответа сети.
  useEffect(() => {
    let cancelled = false;
    setDict(null);
    setDictError(false);

    getDictionary(lang as Locale)
      .then((d) => {
        if (!cancelled) setDict(d);
      })
      .catch((err) => {
        console.error("Failed to load dictionary:", err);
        if (!cancelled) setDictError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [lang]);

  // Init Lenis smooth scroll after load
  useEffect(() => {
    if (!loaded) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let lenis: import("lenis").default | null = null;
    let tickerFn: ((time: number) => void) | null = null;
    let cancelled = false;

    const initLenis = async () => {
      const { default: Lenis } = await import("lenis");
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      lenis.on("scroll", ScrollTrigger.update);

      tickerFn = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);
    };

    initLenis();

    return () => {
      cancelled = true;
      if (tickerFn) {
        import("gsap").then(({ gsap }) => gsap.ticker.remove(tickerFn!));
      }
      lenis?.destroy();
    };
  }, [loaded]);

  if (dictError) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-text-primary)] text-center px-6">
        <p>
          Не удалось загрузить страницу.{" "}
          <button onClick={() => window.location.reload()} className="underline">
            Обновить
          </button>
        </p>
      </div>
    );
  }

  return (
    <>
      {(!loaded || !dict) && <Loader onComplete={() => setLoaded(true)} />}

      <CustomCursor />

      <div
        style={{
          opacity: loaded && dict ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        {dict && (
          <>
            <Navigation dict={dict} currentLang={lang} />

            <main>
              <Hero dict={dict} />
              <About dict={dict} />
              <Marquee dict={dict} />
              <Projects dict={dict} />
              <Experience dict={dict} />
              <Skills dict={dict} />
              <Contact dict={dict} />
            </main>

            <Footer dict={dict} />
          </>
        )}
      </div>
    </>
  );
}
