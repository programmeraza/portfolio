"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { skills, techStack } from "@/lib/data";
import type { Dictionary } from "@/dictionaries/types";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function SkillList({ items }: { items: { name: string; level: number; icon: string }[] }) {
  return (
    <div className="flex flex-col">
      {items.map((item) => (
        <div
          key={item.name}
          data-skill-row
          className="py-4 transition-colors"
          style={{ borderBottom: "1px solid var(--line)" }}
        >
          <div className="flex items-baseline justify-between gap-4 mb-2">
            <span className="text-lg md:text-xl" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
              {item.icon} {item.name}
            </span>
            <span
              className="tabular-nums text-sm"
              style={{ fontFamily: "var(--font-mono)", color: "var(--ink-dim)" }}
            >
              {item.level}%
            </span>
          </div>
          <div className="h-[3px] w-full" style={{ background: "var(--line)" }}>
            <div
              data-skill-bar
              data-level={item.level}
              className="h-full origin-left"
              style={{ background: "var(--accent)", transform: "scaleX(0)", width: "100%" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Craft({ dict }: { dict: Dictionary }) {
  const rootRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const bars = gsap.utils.toArray<HTMLElement>("[data-skill-bar]", rootRef.current);
      bars.forEach((bar) => {
        const level = Number(bar.dataset.level || 0) / 100;
        gsap.to(bar, {
          scaleX: level,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: bar, start: "top 90%" },
        });
      });

      const marquee = marqueeRef.current;
      if (!marquee) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      // The list is duplicated once, so wrapping at -50% is seamless.
      const drift = gsap.to(marquee, {
        xPercent: -50,
        duration: 26,
        ease: "none",
        repeat: -1,
      });

      const boost = ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          drift.timeScale(gsap.utils.clamp(-4, 4, 1 + velocity / 900));
        },
      });

      return () => {
        drift.kill();
        boost.kill();
      };
    },
    { scope: rootRef }
  );

  return (
    <section id="craft" ref={rootRef} className="chapter">
      <div className="frame">
        <p className="kicker mb-4">{dict.skills.label}</p>
        <h2
          className="mb-16 leading-none tracking-tight"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700 }}
        >
          {dict.skills.title1} {dict.skills.title2}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 mb-20">
          <div>
            <p className="kicker mb-4">{dict.skills.frontend}</p>
            <SkillList items={skills.frontend} />
          </div>
          <div>
            <p className="kicker mb-4">{dict.skills.tools}</p>
            <SkillList items={skills.tools} />
          </div>
        </div>

        <p className="kicker mb-6">{dict.skills.stack}</p>
      </div>

      {/* Kinetic stack strip: a constant drift that speeds up and reverses
          with scroll direction. Transform-only, one rAF-free GSAP tween. */}
      <div className="w-full overflow-hidden" style={{ borderBlock: "1px solid var(--line)" }}>
        <div ref={marqueeRef} className="flex gap-8 py-5 w-max will-change-transform">
          {[...techStack, ...techStack].map((t, i) => (
            <span
              key={`${t.name}-${i}`}
              className="text-2xl md:text-4xl whitespace-nowrap"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: t.color }}
            >
              {t.name}
              <span style={{ color: "var(--ink-faint)" }}> ·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
