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
        <div key={item.name} className="py-4" style={{ borderBottom: "1px solid var(--line)" }}>
          <div className="flex items-baseline justify-between gap-4 mb-2">
            <span className="text-lg md:text-xl" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
              {item.icon} {item.name}
            </span>
            <span className="kicker">{item.level}%</span>
          </div>
          <div className="h-[2px] w-full" style={{ background: "var(--line)" }}>
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

      const pills = gsap.utils.toArray<HTMLElement>("[data-tech-pill]", rootRef.current);
      gsap.fromTo(
        pills,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.03,
          ease: "power2.out",
          scrollTrigger: { trigger: pills[0]?.parentElement, start: "top 90%" },
        }
      );
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
        <div className="flex flex-wrap gap-3">
          {techStack.map((t) => (
            <span
              key={t.name}
              data-tech-pill
              className="px-4 py-2 rounded-full text-sm"
              style={{ border: `1px solid ${t.color}55`, color: t.color }}
            >
              {t.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
