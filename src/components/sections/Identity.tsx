"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { Dictionary } from "../../dictionaries/types";

gsap.registerPlugin(useGSAP);

export default function Identity({ dict }: { dict: Dictionary }) {
  const rootRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      gsap.set([line1Ref.current, line2Ref.current], { yPercent: 120 });
      gsap.set([kickerRef.current, ctaRef.current], { opacity: 0, y: 16 });

      const tl = gsap.timeline({ delay: 0.15 });
      tl.to(kickerRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
        .to(
          [line1Ref.current, line2Ref.current],
          { yPercent: 0, duration: 0.9, stagger: 0.1, ease: "power4.out" },
          "-=0.3"
        )
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4");
    },
    { scope: rootRef }
  );

  const scrollTo = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="top"
      ref={rootRef}
      className="chapter relative min-h-[100svh] flex flex-col justify-end"
      style={{ paddingBottom: "clamp(3rem, 8vw, 6rem)" }}
    >
      <div className="frame">
        <p ref={kickerRef} className="kicker mb-6">
          {dict.hero.role}
        </p>
        <h1
          className="leading-[0.88] tracking-tight"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3.2rem, 12vw, 9rem)", fontWeight: 700 }}
        >
          <span className="split-line">
            <span ref={line1Ref} className="split-word">
              {dict.hero.creative}
            </span>
          </span>
          <span className="split-line">
            <span ref={line2Ref} className="split-word" style={{ color: "var(--accent)" }}>
              {dict.hero.developer}
            </span>
          </span>
        </h1>

        <div ref={ctaRef} className="flex gap-4 mt-10 flex-wrap">
          <a href="#work" onClick={scrollTo("#work")} className="btn">
            {dict.hero.ctaProjects}
          </a>
          <a href="#contact" onClick={scrollTo("#contact")} className="btn-outline">
            {dict.hero.cta}
          </a>
        </div>
      </div>

      <div className="frame mt-16">
        <span className="kicker">{dict.hero.scroll} ↓</span>
      </div>
    </section>
  );
}
