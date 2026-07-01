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

// Cursor — no SSR
const CustomCursor = dynamic(
  () => import("@/components/ui/CustomCursor"),
  { ssr: false }
);

export default function Home(props: { params: Promise<{ lang: string }> }) {
  const { lang } = use(props.params);
  
  const [loaded, setLoaded] = useState(false);
  const [dict, setDict] = useState<any>(null);

  useEffect(() => {
    getDictionary(lang as Locale).then(setDict);
  }, [lang]);

  // Init Lenis smooth scroll after load
  useEffect(() => {
    if (!loaded) return;

    let lenis: import("lenis").default | null = null;

    const initLenis = async () => {
      const { default: Lenis } = await import("lenis");

      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      lenis.on("scroll", ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis?.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    };

    initLenis();

    return () => {
      lenis?.destroy();
    };
  }, [loaded]);

  if (!dict) return <div className="h-screen w-screen bg-[var(--color-bg)]" />;

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
