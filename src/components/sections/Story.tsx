"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { siteConfig, stats } from "@/lib/data";
import type { Dictionary } from "@/dictionaries/types";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Story({ dict }: { dict: Dictionary }) {
  const rootRef = useRef<HTMLElement>(null);
  const statsRowRef = useRef<HTMLDivElement>(null);
  const proseRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!proseRef.current) return;

      gsap.fromTo(
        proseRef.current.children,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: proseRef.current, start: "top 80%" },
        }
      );

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const numerals = gsap.utils.toArray<HTMLElement>("[data-stat-value]", statsRowRef.current);
      numerals.forEach((el) => {
        const target = Number(el.dataset.statValue || 0);
        // Without motion the count-up never runs, and these are real figures —
        // showing "0 years of experience" would be worse than showing no
        // animation at all.
        if (reduced) {
          el.textContent = target.toString();
          return;
        }
        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          end: "top 55%",
          scrub: 0.4,
          onUpdate: (self) => {
            el.textContent = Math.round(target * self.progress).toString();
          },
        });
      });
    },
    { scope: rootRef }
  );

  return (
    <section id="story" ref={rootRef} className="chapter">
      <div className="frame">
        <div className="flex items-start justify-between gap-8 mb-10 flex-wrap">
          <p className="kicker">{dict.about.label}</p>
          <div
            className="relative w-16 h-16 rounded-full overflow-hidden shrink-0"
            style={{ border: "1px solid var(--line-strong)" }}
          >
            <Image src="/avatar.jpg" alt={siteConfig.name} fill sizes="64px" className="object-cover" />
          </div>
        </div>

        <h2
          className="mb-10 leading-[0.95] tracking-tight"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 6vw, 4.5rem)", fontWeight: 700 }}
        >
          {dict.about.title}
        </h2>

        <div ref={proseRef} className="max-w-2xl space-y-6 mb-16" style={{ color: "var(--ink-dim)", fontSize: "1.15rem" }}>
          <p>{dict.about.desc1}</p>
          <p>{dict.about.desc2}</p>
          <a href="/cv.pdf" target="_blank" rel="noopener noreferrer" className="btn-outline inline-flex mt-4">
            CV
          </a>
        </div>

        <div
          ref={statsRowRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10"
          style={{ borderTop: "1px solid var(--line)" }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="min-w-0">
              <div
                className="leading-none mb-2"
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700 }}
              >
                <span data-stat-value={stat.value}>0</span>
                <span style={{ color: "var(--accent)" }}>{stat.suffix}</span>
              </div>
              <div className="kicker" style={{ textTransform: "none", letterSpacing: "normal" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
