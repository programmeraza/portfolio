"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skills, techStack } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

function CircularSkill({
  name,
  level,
  icon,
  index,
}: {
  name: string;
  level: number;
  icon: string;
  index: number;
}) {
  const circleRef = useRef<SVGCircleElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (level / 100) * circumference;

  useEffect(() => {
    const circle = circleRef.current;
    const percent = percentRef.current;
    if (!circle || !percent) return;

    // Start hidden
    circle.style.strokeDashoffset = `${circumference}`;

    const countObj = { value: 0 };

    ScrollTrigger.create({
      trigger: circle,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(circle, {
          strokeDashoffset: offset,
          duration: 1.2,
          delay: index * 0.08,
          ease: "power3.out",
        });

        gsap.to(countObj, {
          value: level,
          duration: 1.2,
          delay: index * 0.08,
          ease: "power3.out",
          onUpdate: () => {
            if (percent) {
              percent.textContent = Math.round(countObj.value) + "%";
            }
          },
        });
      },
    });
  }, [circumference, offset, level, index]);

  return (
    <div className="flex flex-col items-center gap-3 group">
      <div className="relative w-24 h-24">
        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 100 100"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="6"
          />
          {/* Progress circle */}
          <circle
            ref={circleRef}
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="url(#skillGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: circumference,
              transition: "stroke-dashoffset 0.1s ease",
            }}
          />
          <defs>
            <linearGradient id="skillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00d4ff" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl">{icon}</span>
        </div>
      </div>

      <div className="text-center">
        <div
          className="text-sm font-semibold mb-0.5"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-text-primary)",
          }}
        >
          {name}
        </div>
        <span
          ref={percentRef}
          className="text-xs gradient-text font-bold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          0%
        </span>
      </div>
    </div>
  );
}

export default function Skills({ dict }: { dict?: any }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const techRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current?.children ?? [],
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: headingRef.current, start: "top 85%" },
        }
      );

      // Tech stack floating pills
      const pills = techRef.current?.querySelectorAll(".tech-pill");
      if (pills) {
        gsap.fromTo(
          pills,
          { opacity: 0, y: 20, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.05,
            duration: 0.5,
            ease: "back.out(1.5)",
            scrollTrigger: { trigger: techRef.current, start: "top 85%" },
          }
        );

        // Continuous subtle float
        Array.from(pills).forEach((pill, i) => {
          gsap.to(pill, {
            y: -6,
            duration: 1.5 + i * 0.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.15,
          });
        });
      }
    }, sectionRef.current ?? undefined);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="section-padding">
      <div className="container-custom">
        {/* Header */}
        <div ref={headingRef} className="text-center mb-16">
          <div className="section-label justify-center">Expertise</div>
          <h2 className="text-heading mb-4" style={{ color: "var(--color-text-primary)" }}>
            Skills &{" "}
            <span className="gradient-text">Technologies</span>
          </h2>
          <p
            className="text-subheading max-w-xl mx-auto"
            style={{ color: "var(--color-text-secondary)" }}
          >
            A toolkit built through years of crafting production-grade applications.
          </p>
        </div>

        {/* Skills grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Frontend */}
          <div>
            <h3
              className="text-lg font-bold mb-8 flex items-center gap-2"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}
            >
              <span className="gradient-text">Frontend</span>
              <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
            </h3>
            <div className="grid grid-cols-3 gap-6">
              {skills.frontend.map((skill, i) => (
                <CircularSkill key={skill.name} {...skill} index={i} />
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3
              className="text-lg font-bold mb-8 flex items-center gap-2"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}
            >
              <span className="gradient-text">Tools</span>
              <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
            </h3>
            <div className="grid grid-cols-3 gap-6">
              {skills.tools.map((skill, i) => (
                <CircularSkill key={skill.name} {...skill} index={i} />
              ))}
            </div>
          </div>
        </div>

        {/* Tech stack floating pills */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <p
            className="text-center text-sm mb-8 tracking-widest uppercase"
            style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-heading)" }}
          >
            Full Tech Stack
          </p>
          <div
            ref={techRef}
            className="flex flex-wrap justify-center gap-3"
          >
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="tech-pill px-4 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 cursor-default select-none transition-all duration-300 hover:scale-110"
                style={{
                  background: `${tech.color}10`,
                  border: `1px solid ${tech.color}30`,
                  color: tech.color,
                  fontFamily: "var(--font-heading)",
                  opacity: 0,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: tech.color }}
                />
                {tech.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
