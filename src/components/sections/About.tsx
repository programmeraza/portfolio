"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig, stats } from "@/lib/data";
import type { Dictionary } from "@/dictionaries/types";

gsap.registerPlugin(ScrollTrigger);

export default function About({ dict }: { dict?: Dictionary }) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const countersRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const counters = countersRef.current;
    const image = imageRef.current;
    const bio = bioRef.current;
    if (!section || !content || !counters || !image || !bio) return;

    const ctx = gsap.context(() => {
      // Image reveal with clip-path
      gsap.fromTo(
        image,
        { clipPath: "inset(100% 0 0 0)", opacity: 0 },
        {
          clipPath: "inset(0% 0 0 0)",
          opacity: 1,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: image,
            start: "top 80%",
          },
        }
      );

      // Bio text fade
      gsap.fromTo(
        bio.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: bio,
            start: "top 80%",
          },
        }
      );

      // Animated counters
      const counterEls = counters.querySelectorAll<HTMLElement>("[data-count]");
      counterEls.forEach((el) => {
        const target = parseInt(el.dataset.count || "0");
        const obj = { value: 0 };

        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(obj, {
              value: target,
              duration: 1.5,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = Math.round(obj.value) + "+";
              },
            });
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="section-padding">
      <div className="container-custom">
        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Image + decoration */}
          <div className="relative">
            {/* Decorative elements */}
            <div
              className="absolute -top-6 -left-6 w-32 h-32 rounded-2xl border z-0 animate-spin-slow"
              style={{ borderColor: "var(--color-border-strong)" }}
            />
            <div
              className="absolute -bottom-6 -right-6 w-24 h-24 rounded-xl border z-0"
              style={{
                borderColor: "rgba(0, 212, 255, 0.3)",
                background: "rgba(0, 212, 255, 0.03)",
              }}
            />

            {/* Avatar placeholder */}
            <div
              ref={imageRef}
              className="relative z-10 rounded-2xl overflow-hidden aspect-[4/5]"
              style={{ clipPath: "inset(100% 0 0 0)" }}
            >
              {/* Ваше фото — /public/avatar.jpg */}
              <Image
                src="/avatar.jpg"
                alt={`${siteConfig.name} — ${siteConfig.title}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                style={{ borderRadius: "inherit" }}
              />

              {/* Overlay badge */}
              <div
                className="absolute bottom-4 left-4 glass-card px-4 py-2.5 flex items-center gap-2"
              >
                <div
                  className="w-2 h-2 rounded-full animate-pulse-glow"
                  style={{ background: "var(--color-accent-emerald)" }}
                />
                <span className="text-xs font-medium" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
                  {dict?.contact?.available || "Available for work"}
                </span>
              </div>
            </div>
          </div>

          {/* Right — Bio */}
          <div ref={bioRef} className="space-y-8">
            <div>
              <div className="section-label">{dict?.about?.label || "About Me"}</div>
              <h2 className="text-heading text-[var(--color-text-primary)] mb-8">
                {dict?.about?.title || "Crafting digital experiences"} <br />
                <span className="gradient-text">with passion.</span>
              </h2>
              <div className="text-subheading text-[var(--color-text-secondary)] space-y-6 max-w-2xl">
                <p>{dict?.about?.desc1 || "I am a frontend developer..."}</p>
                <p>{dict?.about?.desc2 || "I leverage cutting-edge tech..."}</p>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: dict?.about?.info?.location || "Location", value: siteConfig.location },
                { label: dict?.about?.info?.email || "Email", value: siteConfig.email },
                {
                  label: dict?.about?.info?.specialization || "Specialization",
                  value: dict?.about?.infoValues?.specialization || "Frontend / UI",
                },
                {
                  label: dict?.about?.info?.status || "Status",
                  value: dict?.about?.infoValues?.status || "Open to offers 🟢",
                },
              ].map((item) => (
                <div key={item.label} className="glass-card p-4">
                  <div
                    className="text-xs text-[var(--color-text-muted)] mt-1 font-semibold tracking-widest uppercase font-[var(--font-heading)]"
                  >
                    {item.label}
                  </div>
                  <div
                    className="text-sm font-medium"
                    style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-heading)" }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            {/* ⚠️ Ссылка ведёт на /public/cv.pdf — этого файла сейчас нет в проекте.
                Добавьте свой PDF-файл резюме по этому пути, иначе кнопка будет вести на 404. */}
            <div className="flex gap-4">
              <a
                href="/cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Download CV
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 1a.75.75 0 0 1 .75.75v5.69l1.72-1.72a.75.75 0 1 1 1.06 1.06L8 10.31 4.47 6.78a.75.75 0 0 1 1.06-1.06l1.72 1.72V1.75A.75.75 0 0 1 8 1ZM1.5 12.75a.75.75 0 0 1 1.5 0v.75h10v-.75a.75.75 0 0 1 1.5 0v.75A1.5 1.5 0 0 1 13 15H3a1.5 1.5 0 0 1-1.5-1.5v-.75Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div
          ref={countersRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-24 pt-12"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center group">
              <div
                className="text-5xl font-bold mb-2 gradient-text"
                data-count={stat.value}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                0+
              </div>
              <div
                className="text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
