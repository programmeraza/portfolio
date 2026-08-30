"use client";

import { useEffect } from "react";
import { siteConfig } from "@/lib/data";
import type { Dictionary } from "@/dictionaries/types";

export default function Footer({ dict: _dict }: { dict?: Dictionary }) {
  useEffect(() => {
    // Scroll progress update
    const updateProgress = () => {
      const bar = document.getElementById("scroll-progress");
      if (!bar) return;
      const scrolled = window.scrollY;
      const total = document.body.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (scrolled / total) * 100 : 0;
      bar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  const year = new Date().getFullYear();

  return (
    <>
      {/* Полоса прогресса скролла — раньше JS искал этот элемент,
          но он нигде не рендерился, поэтому эффект не работал */}
      <div
        className="fixed top-0 left-0 w-full h-[3px] z-[90] pointer-events-none"
        style={{ background: "var(--color-border)" }}
      >
        <div
          id="scroll-progress"
          className="h-full"
          style={{ width: "0%", background: "var(--gradient-primary)", transition: "width 0.1s linear" }}
        />
      </div>

      <footer
        className="py-12"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-black font-bold text-xs"
                style={{ background: "var(--gradient-primary)" }}
              >
                {"</>"}
              </div>
              <span
                className="text-sm font-semibold"
                style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}
              >
                {siteConfig.name}
              </span>
            </div>

            {/* Copyright */}
            <p
              className="text-xs text-center"
              style={{ color: "var(--color-text-muted)" }}
            >
              © {year} {siteConfig.name}. Crafted with ❤️ using Next.js, GSAP & Three.js
            </p>

            {/* Social */}
            <div className="flex items-center gap-3">
              {[
                { href: siteConfig.github, label: "GitHub" },
                { href: siteConfig.linkedin, label: "LinkedIn" },
                { href: siteConfig.telegram, label: "Telegram" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs transition-colors duration-300 hover:text-[var(--color-accent-cyan)]"
                  style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-heading)" }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
