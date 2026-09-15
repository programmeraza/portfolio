"use client";

import { useEffect } from "react";
import { siteConfig } from "@/lib/data";
import type { Dictionary } from "@/dictionaries/types";

export default function Footer(_props: { dict?: Dictionary }) {
  useEffect(() => {
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
      <div className="fixed top-0 left-0 w-full h-[2px] z-[70] pointer-events-none" style={{ background: "var(--line)" }}>
        <div id="scroll-progress" className="h-full" style={{ width: "0%", background: "var(--accent)" }} />
      </div>

      <footer className="chapter" style={{ borderTop: "1px solid var(--line)", paddingBottom: "var(--edge)" }}>
        <div className="frame flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700 }}>
            {siteConfig.name}
          </p>
          <div className="flex flex-col gap-2 items-start md:items-end">
            <div className="flex gap-4">
              {[
                { href: siteConfig.github, label: "GitHub" },
                { href: siteConfig.telegram, label: "Telegram" },
              ]
                .filter((s) => Boolean(s.href))
                .map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="kicker transition-colors"
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "")}
                  >
                    {s.label}
                  </a>
                ))}
            </div>
            <p className="kicker" style={{ textTransform: "none", letterSpacing: "normal" }}>
              © {year} {siteConfig.name}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
