"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { experience } from "@/lib/data";
import type { Dictionary } from "@/dictionaries/types";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Path({ dict }: { dict: Dictionary }) {
  const rootRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<"work" | "education">("work");

  const entries = experience.filter((e) => e.type === tab);

  useGSAP(
    () => {
      if (!listRef.current) return;
      gsap.fromTo(
        listRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: listRef.current, start: "top 85%" },
        }
      );

      // Spine fills as the column scrolls past — the one scroll-linked
      // element in this deliberately quiet chapter.
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: listRef.current,
              start: "top 75%",
              end: "bottom 60%",
              scrub: 0.5,
            },
          }
        );
      }
    },
    { scope: rootRef, dependencies: [tab] }
  );

  return (
    <section id="path" ref={rootRef} className="chapter">
      <div className="frame">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
          <div>
            <p className="kicker mb-4">{dict.experience.label}</p>
            <h2
              className="leading-none tracking-tight"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700 }}
            >
              {dict.experience.title1} {dict.experience.title2}
            </h2>
          </div>

          <div className="flex gap-2">
            {(["work", "education"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="kicker px-4 py-2 rounded-full transition-colors"
                style={{
                  border: `1px solid ${tab === t ? "var(--accent)" : "var(--line)"}`,
                  color: tab === t ? "var(--accent)" : "var(--ink-faint)",
                }}
              >
                {t === "work" ? dict.experience.tabWork : dict.experience.tabEducation}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <div
            className="absolute left-0 top-0 bottom-0 w-px hidden md:block"
            style={{ background: "var(--line)" }}
            aria-hidden
          >
            <div
              ref={lineRef}
              className="w-full h-full origin-top"
              style={{ background: "var(--accent)", transform: "scaleY(0)" }}
            />
          </div>

          <div ref={listRef} className="flex flex-col md:pl-8">
            {entries.map((entry) => (
            <div
              key={entry.id}
              className="grid grid-cols-1 md:grid-cols-[8rem_1fr] gap-3 md:gap-8 py-8"
              style={{ borderBottom: "1px solid var(--line)" }}
            >
              <span className="kicker" style={{ color: entry.color }}>
                {entry.period}
              </span>
              <div className="min-w-0">
                <h3 className="text-xl md:text-2xl font-semibold mb-1" style={{ fontFamily: "var(--font-display)" }}>
                  {entry.title}
                </h3>
                <p className="text-sm mb-3" style={{ color: "var(--ink-faint)" }}>
                  {entry.company}
                </p>
                <p className="mb-4 max-w-2xl" style={{ color: "var(--ink-dim)" }}>
                  {entry.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {entry.tech.map((t) => (
                    <span key={t} className="kicker px-2.5 py-1 rounded-full" style={{ border: "1px solid var(--line)" }}>
                      {t}
                    </span>
                  ))}
                </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
