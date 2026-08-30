"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experience } from "@/lib/data";
import type { Dictionary } from "@/dictionaries/types";

gsap.registerPlugin(ScrollTrigger);

type Tab = "work" | "education";

export default function Experience({ dict }: { dict?: Dictionary }) {
  const [activeTab, setActiveTab] = useState<Tab>("work");
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  const filtered = experience.filter((e) => e.type === activeTab);

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;

    gsap.fromTo(
      heading.children,
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: heading, start: "top 85%" },
      }
    );
  }, []);

  useEffect(() => {
    const timeline = timelineRef.current;
    const line = lineRef.current;
    if (!timeline || !line) return;

    const ctx = gsap.context(() => {
      // Draw the timeline line
      gsap.fromTo(
        line,
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: timeline,
            start: "top 80%",
          },
        }
      );

      // Animate cards
      const cards = timeline.querySelectorAll<HTMLElement>(".timeline-card");
      cards.forEach((card, i) => {
        const isLeft = i % 2 === 0;
        gsap.fromTo(
          card,
          { opacity: 0, x: isLeft ? -40 : 40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            },
          }
        );
      });
    }, timeline);

    return () => ctx.revert();
  }, [activeTab]);

  return (
    <section ref={sectionRef} id="experience" className="section-padding">
      <div className="container-custom">
        {/* Header */}
        <div ref={headingRef} className="text-center mb-16">
          <div className="section-label justify-center">{dict?.experience?.label || "Journey"}</div>
          <h2 className="text-heading mb-4" style={{ color: "var(--color-text-primary)" }}>
            {dict?.experience?.title1 || "My professional"}{" "}
            <span className="gradient-text">{dict?.experience?.title2 || "timeline"}</span>
          </h2>
          <p
            className="text-subheading max-w-xl mx-auto"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {dict?.experience?.desc || "A story of continuous growth, problem-solving, and impact."}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-16">
          <div
            className="flex gap-1 p-1 rounded-full"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            {(["work", "education"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 capitalize"
                style={{
                  fontFamily: "var(--font-heading)",
                  background:
                    activeTab === tab ? "var(--gradient-primary)" : "transparent",
                  color: activeTab === tab ? "#000" : "var(--color-text-secondary)",
                }}
              >
                {tab === "work"
                  ? dict?.experience?.tabWork || "💼 Experience"
                  : dict?.experience?.tabEducation || "🎓 Education"}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative max-w-4xl mx-auto">
          {/* Center line */}
          <div
            ref={lineRef}
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px hidden md:block"
            style={{ background: "var(--color-border-strong)" }}
          />

          <div className="space-y-8">
            {filtered.map((item, i) => {
              const isLeft = i % 2 === 0;

              return (
                <div
                  key={item.id}
                  className={`timeline-card flex flex-col md:flex-row items-start gap-0 md:gap-8 opacity-0 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Card */}
                  <div className="flex-1">
                    <div
                      className="glass-card p-6 rounded-2xl transition-all duration-300 hover:border-[var(--color-border-strong)]"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                        <div>
                          <h3
                            className="text-lg font-bold mb-0.5"
                            style={{
                              fontFamily: "var(--font-heading)",
                              color: "var(--color-text-primary)",
                            }}
                          >
                            {item.title}
                          </h3>
                          <p
                            className="text-sm font-medium"
                            style={{ color: item.color }}
                          >
                            {item.company}
                          </p>
                        </div>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: `${item.color}15`,
                            border: `1px solid ${item.color}40`,
                            color: item.color,
                            fontFamily: "var(--font-heading)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.period}
                        </span>
                      </div>

                      {/* Description */}
                      <p
                        className="text-sm leading-relaxed mb-4"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {item.description}
                      </p>

                      {/* Tech */}
                      <div className="flex flex-wrap gap-1.5">
                        {item.tech.map((t) => (
                          <span
                            key={t}
                            className="px-2.5 py-0.5 rounded-full text-xs"
                            style={{
                              background: "rgba(255,255,255,0.05)",
                              border: "1px solid var(--color-border)",
                              color: "var(--color-text-secondary)",
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden md:flex items-center justify-center w-5 mt-7 flex-shrink-0">
                    <div
                      className="w-4 h-4 rounded-full border-2 relative z-10"
                      style={{
                        background: item.color,
                        borderColor: "var(--color-bg)",
                        boxShadow: `0 0 12px ${item.color}60`,
                      }}
                    />
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block flex-1" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
