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
import type { Dictionary } from "../../dictionaries/types";

// Cursor — no SSR
const CustomCursor = dynamic(
  () => import("@/components/ui/CustomCursor"),
  { ssr: false }
);

export default function HomeClient({
  dict,
  lang,
}: {
  dict: Dictionary;
  lang: string;
}) {
  const [loaded, setLoaded] = useState(false);

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

  return (
    <>
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}

      <CustomCursor />

      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
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
      </div>
    </>
  );
}
