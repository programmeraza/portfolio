"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { projects, siteConfig } from "@/lib/data";
import type { Dictionary } from "@/dictionaries/types";
import { setSceneTint, resetSceneTint } from "@/lib/sceneState";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Work({ dict }: { dict: Dictionary }) {
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [railVisible, setRailVisible] = useState(false);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top 60%",
        end: "bottom 40%",
        onToggle: (self) => setRailVisible(self.isActive),
      });

      const slides = gsap.utils.toArray<HTMLElement>("[data-project-slide]", rootRef.current);

      slides.forEach((slide, i) => {
        gsap.fromTo(
          slide.querySelectorAll("[data-reveal]"),
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: slide, start: "top 70%" },
          }
        );

        ScrollTrigger.create({
          trigger: slide,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) {
              setActive(i);
              setSceneTint(projects[i].color);
            }
          },
        });
      });

      return () => resetSceneTint();
    },
    { scope: rootRef }
  );

  return (
    <section id="work" ref={rootRef} className="chapter" style={{ paddingBlock: 0 }}>
      <div className="frame pt-[var(--section-pad)] pb-16 flex items-end justify-between flex-wrap gap-4">
        <p className="kicker">{dict.projects.label}</p>
        <h2
          className="leading-none tracking-tight"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700 }}
        >
          {dict.projects.title1} {dict.projects.title2}
        </h2>
      </div>

      {/* Index rail */}
      <div
        className="hidden md:flex fixed top-1/2 -translate-y-1/2 left-0 z-20 flex-col gap-3"
        style={{
          width: "var(--rail-w)",
          paddingLeft: "1rem",
          opacity: railVisible ? 1 : 0,
          transition: "opacity 0.4s var(--ease-out)",
          pointerEvents: "none",
        }}
        aria-hidden
      >
        {projects.map((p, i) => (
          <span
            key={p.id}
            className="font-mono text-xs transition-colors"
            style={{
              fontFamily: "var(--font-mono)",
              color: active === i ? "var(--accent)" : "var(--ink-faint)",
            }}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
        ))}
      </div>

      {projects.map((project, i) => (
        <div
          key={project.id}
          data-project-slide
          className="frame min-h-[100svh] flex flex-col justify-center"
          style={{ borderTop: i === 0 ? "none" : "1px solid var(--line)" }}
        >
          <p data-reveal className="kicker mb-4" style={{ color: project.color }}>
            {String(i + 1).padStart(2, "0")} — {project.category}
          </p>
          <h3
            data-reveal
            className="mb-6 leading-[0.95] tracking-tight"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 8vw, 6rem)", fontWeight: 700 }}
          >
            {project.title}
          </h3>
          <p data-reveal className="max-w-xl mb-8" style={{ color: "var(--ink-dim)", fontSize: "1.1rem" }}>
            {project.description}
          </p>
          <div data-reveal className="flex flex-wrap gap-2 mb-8">
            {project.tech.map((t) => (
              <span
                key={t}
                className="kicker px-3 py-1 rounded-full"
                style={{ border: "1px solid var(--line)" }}
              >
                {t}
              </span>
            ))}
          </div>
          {project.liveUrl && (
            <a data-reveal href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-outline w-fit">
              →
            </a>
          )}
        </div>
      ))}

      <div className="frame py-16">
        <a
          href={siteConfig.github}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline w-fit"
        >
          {dict.projects.viewAll} →
        </a>
      </div>
    </section>
  );
}
