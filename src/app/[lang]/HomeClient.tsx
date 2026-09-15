"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";

import Navigation from "@/components/ui/Navigation";
import Footer from "@/components/ui/Footer";

import Identity from "@/components/sections/Identity";
import Story from "@/components/sections/Story";
import Work from "@/components/sections/Work";
import Path from "@/components/sections/Path";
import Craft from "@/components/sections/Craft";
import Contact from "@/components/sections/Contact";

import type { Dictionary } from "../../dictionaries/types";
import { sceneState } from "@/lib/sceneState";

const SceneCanvas = dynamic(() => import("@/components/canvas/Scene"), { ssr: false });

export default function HomeClient({ dict, lang }: { dict: Dictionary; lang: string }) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lenis: import("lenis").default | null = null;
    let tickerFn: ((time: number) => void) | null = null;
    let progressTrigger: import("gsap/ScrollTrigger").ScrollTrigger | null = null;
    let cancelled = false;

    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      progressTrigger = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          sceneState.progress = self.progress;
        },
      });

      if (prefersReducedMotion) return;

      const { default: Lenis } = await import("lenis");
      if (cancelled) return;

      lenis = new Lenis({
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenis.on("scroll", ScrollTrigger.update);

      tickerFn = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);
    };

    init();

    return () => {
      cancelled = true;
      progressTrigger?.kill();
      if (tickerFn) {
        import("gsap").then(({ gsap }) => gsap.ticker.remove(tickerFn!));
      }
      lenis?.destroy();
    };
  }, []);

  return (
    <>
      <SceneCanvas />
      <div className="canvas-veil" aria-hidden />
      <div className="top-scrim" aria-hidden />
      <Navigation dict={dict} currentLang={lang} />

      <main className="relative z-10">
        <Identity dict={dict} />
        <Story dict={dict} />
        <Work dict={dict} />
        <Path dict={dict} />
        <Craft dict={dict} />
        <Contact dict={dict} />
      </main>

      <div className="relative z-10">
        <Footer dict={dict} />
      </div>
    </>
  );
}
