"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export default function Projects({ dict }: { dict?: any }) {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    const container = containerRef.current;

    if (!section || !wrapper || !container) return;

    const ctx = gsap.context(() => {
      const scrollWidth = container.scrollWidth - window.innerWidth + window.innerWidth * 0.1; // padding

      gsap.to(container, {
        x: -scrollWidth,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: `+=${scrollWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Distortion effect on scroll
      const cards = container.querySelectorAll(".project-card");
      ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: `+=${scrollWidth}`,
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          // Skew images based on scroll speed
          gsap.to(cards, {
            skewX: -velocity * 0.005,
            duration: 0.5,
            ease: "power3.out",
            overwrite: "auto",
          });
        },
      });

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="relative z-10 bg-[var(--color-bg)]">
      <div ref={wrapperRef} className="h-screen flex flex-col justify-center overflow-hidden">
        
        {/* Header (stays sticky during horizontal scroll context if placed right, but we pin the wrapper) */}
        <div className="container-custom w-full shrink-0 mb-12">
          <div className="section-label">{dict?.projects?.label || "Selected Work"}</div>
          <h2 className="text-heading text-[var(--color-text-primary)]">
            {dict?.projects?.title1 || "Award-winning"} <span className="gradient-text">{dict?.projects?.title2 || "Experiences"}</span>
          </h2>
        </div>

        {/* Horizontal Container */}
        <div 
          ref={containerRef} 
          className="flex gap-12 px-[10vw] items-center w-max h-[60vh]"
        >
          {projects.map((project, i) => (
            <div 
              key={project.id} 
              className="project-card relative w-[70vw] md:w-[45vw] lg:w-[35vw] h-full shrink-0 group perspective-[1000px]"
            >
              <a 
                href={project.liveUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full h-full glass-card overflow-hidden transition-transform duration-700 hover:scale-[1.02]"
              >
                {/* Image Placeholder */}
                <div 
                  className="absolute inset-0 z-0 opacity-40 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(135deg, ${project.color}30 0%, transparent 100%)`,
                  }}
                />
                
                {/* Content */}
                <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-end">
                  <div className="mb-4">
                    <span 
                      className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
                      style={{ 
                        background: project.color, 
                        color: "#000" 
                      }}
                    >
                      {project.category}
                    </span>
                  </div>
                  <h3 className="text-3xl md:text-5xl font-bold mb-4 font-[var(--font-heading)] leading-none">
                    {project.title}
                  </h3>
                  <p className="text-[var(--color-text-secondary)] mb-8 max-w-sm">
                    {project.description}
                  </p>
                  
                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2">
                    {project.tech.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1.5 rounded-full text-xs border border-[var(--color-border)] bg-[var(--color-surface)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Number Watermark */}
                <div className="absolute top-8 right-8 text-[8rem] font-bold opacity-10 leading-none pointer-events-none">
                  0{i + 1}
                </div>
              </a>
            </div>
          ))}
          
          {/* End cap */}
          <div className="w-[30vw] shrink-0 flex items-center justify-center">
            <a href="https://github.com/yourusername" target="_blank" className="btn-primary">
              View All GitHub Projects
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
