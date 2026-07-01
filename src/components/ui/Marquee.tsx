"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Marquee({ dict }: { dict: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const text = textRef.current;
    if (!text) return;

    // We clone the inner span to ensure seamless loop
    // But since CSS animation is already looping, we just add scroll velocity modifier

    const ctx = gsap.context(() => {
      // Scroll velocity affects marquee position
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          // Modulate the timeline or simply shift the transform based on scroll speed
          gsap.to(text, {
            x: `+=${velocity * 0.05}`,
            ease: "power3.out",
            duration: 0.5,
            overwrite: "auto",
          });
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const content = dict?.marquee?.text || "CREATIVE DEVELOPER • WEBGL EXPERT • UI ENGINEER • ANIMATION SPECIALIST • ";
  
  return (
    <div ref={containerRef} className="marquee-container my-16">
      <div className="marquee-content" ref={textRef}>
        <div className="marquee-item">{content}</div>
        <div className="marquee-item">{content}</div>
        <div className="marquee-item">{content}</div>
      </div>
    </div>
  );
}
