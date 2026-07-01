"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loader = loaderRef.current;
    const counter = counterRef.current;
    const bar = barRef.current;
    const logo = logoRef.current;
    const line = lineRef.current;
    if (!loader || !counter || !bar || !logo || !line) return;

    // Prevent scroll during loading
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        onComplete();
      },
    });

    // Count up 0 → 100
    const countObj = { value: 0 };
    tl.to(countObj, {
      value: 100,
      duration: 1.8,
      ease: "power2.inOut",
      onUpdate: () => {
        if (counter) {
          counter.textContent = Math.round(countObj.value).toString();
        }
      },
    });

    // Animate progress bar
    tl.to(
      bar,
      {
        scaleX: 1,
        duration: 1.8,
        ease: "power2.inOut",
      },
      "<"
    );

    // Logo reveal
    tl.fromTo(
      logo,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      "-=1.2"
    );

    // Slide out
    tl.to(
      line,
      {
        scaleX: 0,
        transformOrigin: "right center",
        duration: 0.4,
        ease: "power2.in",
      },
      "+=0.3"
    );

    tl.to(loader, {
      yPercent: -100,
      duration: 0.9,
      ease: "power4.inOut",
    });

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  return (
    <div
      id="loader"
      ref={loaderRef}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center"
      style={{ background: "var(--color-bg)" }}
    >
      {/* Logo */}
      <div ref={logoRef} className="mb-12 opacity-0">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-black text-lg"
            style={{ background: "var(--gradient-primary)" }}
          >
            {"</>"}
          </div>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Portfolio
          </span>
        </div>
      </div>

      {/* Counter */}
      <div className="mb-8 flex items-end gap-1">
        <span
          ref={counterRef}
          className="text-[8rem] font-bold leading-none tabular-nums"
          style={{
            fontFamily: "var(--font-heading)",
            background: "var(--gradient-primary)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          0
        </span>
        <span
          className="text-4xl mb-4"
          style={{ color: "var(--color-text-secondary)" }}
        >
          %
        </span>
      </div>

      {/* Progress bar */}
      <div
        ref={lineRef}
        className="w-64 h-px relative overflow-hidden"
        style={{ background: "var(--color-border)" }}
      >
        <div
          ref={barRef}
          className="absolute inset-0 origin-left"
          style={{
            background: "var(--gradient-primary)",
            transform: "scaleX(0)",
          }}
        />
      </div>

      {/* Label */}
      <p
        className="mt-6 text-xs tracking-[0.3em] uppercase"
        style={{ color: "var(--color-text-muted)" }}
      >
        Loading Experience
      </p>
    </div>
  );
}
