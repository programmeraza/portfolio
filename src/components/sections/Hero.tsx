"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { siteConfig } from "@/lib/data";

const HeroScene = dynamic(() => import("@/components/canvas/HeroScene"), {
  ssr: false,
});

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ dict }: { dict?: any }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        headingRef.current,
        { y: 100, opacity: 0, rotateX: 20 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1.5, delay: 0.2 }
      )
        .fromTo(
          subtitleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          "-=1"
        )
        .fromTo(
          ctaRef.current?.children ?? [],
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
          "-=0.8"
        )
        .fromTo(
          scrollIndicatorRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1 },
          "-=0.5"
        );

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        animation: gsap.to(contentRef.current, {
          y: 150, // Parallax the whole container down
          opacity: 0, // fade out the whole block slightly or fully
        }),
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-80">
        <HeroScene />
      </div>

      <div
        className="absolute inset-0 z-[1] pointer-events-none mix-blend-screen"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,126,179,0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-48 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, var(--color-bg) 0%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div className="container-custom relative z-10 pt-20" ref={contentRef}>
        <div className="max-w-5xl">
          {/* Label */}
          <div className="section-label mb-8">
            <span>{dict?.hero?.role || "Frontend Developer"}</span>
          </div>

          {/* Main heading */}
          <div className="overflow-hidden mb-6" style={{ perspective: "1000px" }}>
            <h1
              ref={headingRef}
              className="text-display"
              style={{ color: "var(--color-text-primary)" }}
            >
              <span className="gradient-text">{dict?.hero?.creative || "Creative"}</span>
              <br />
              {dict?.hero?.developer || "Developer"}
            </h1>
          </div>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-subheading max-w-xl mb-10 opacity-0"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {siteConfig.name} — crafting immersive web experiences inspired by anime & magic.
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-wrap gap-4 items-center mb-16">
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn-primary"
            >
              {dict?.hero?.cta || "Get in touch"}
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl">
            {[
              { value: "4+", label: dict?.about?.stats?.exp || "Years Exp" },
              { value: "30+", label: dict?.about?.stats?.projects || "Projects" },
              { value: "20+", label: "Technologies" },
              { value: "100%", label: "Passion" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="text-2xl font-bold mb-1 gradient-text"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-xs tracking-widest uppercase"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-0"
      >
        <span
          className="text-xs tracking-[0.2em] uppercase"
          style={{ color: "var(--color-text-muted)" }}
        >
          {dict?.hero?.scroll || "Scroll Down"}
        </span>
        <div
          className="w-px h-10 bounce-arrow"
          style={{
            background:
              "linear-gradient(to bottom, var(--color-accent-cyan), transparent)",
          }}
        />
      </div>
    </section>
  );
}
