"use client";

import { useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { locales } from "../../dictionaries";
import type { Dictionary } from "../../dictionaries/types";
import { siteConfig } from "@/lib/data";

gsap.registerPlugin(useGSAP);

const LOCALE_LABEL: Record<string, string> = {
  ru: "RU",
  en: "EN",
  uz: "UZ",
  ja: "JA",
  zh: "ZH",
  es: "ES",
};

export default function Navigation({ dict, currentLang }: { dict?: Dictionary; currentLang?: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { label: dict?.nav?.about || "Story", href: "#story" },
    { label: dict?.nav?.projects || "Work", href: "#work" },
    { label: dict?.nav?.experience || "Path", href: "#path" },
    { label: dict?.nav?.skills || "Craft", href: "#craft" },
    { label: dict?.nav?.contact || "Contact", href: "#contact" },
  ];

  const initials = (siteConfig.name || "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  useGSAP(() => {
    const panel = panelRef.current;
    const items = itemsRef.current;
    if (!panel || !items) return;

    if (open) {
      document.body.style.overflow = "hidden";
      gsap.set(panel, { visibility: "visible" });
      gsap.fromTo(
        panel,
        { scaleY: 0 },
        { scaleY: 1, duration: 0.6, ease: "power4.inOut" }
      );
      gsap.fromTo(
        Array.from(items.children),
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, delay: 0.25, ease: "power3.out" }
      );
    } else {
      gsap.to(panel, {
        scaleY: 0,
        duration: 0.45,
        ease: "power3.inOut",
        onComplete: () => {
          gsap.set(panel, { visibility: "hidden" });
          document.body.style.overflow = "";
        },
      });
    }
  }, [open]);

  const handleNavClick = (href: string) => {
    setOpen(false);
    window.setTimeout(
      () => {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      },
      open ? 500 : 0
    );
  };

  const handleLocaleChange = (loc: string) => {
    setOpen(false);
    const nextPath = pathname.replace(`/${currentLang}`, `/${loc}`);
    router.push(nextPath || `/${loc}`);
  };

  return (
    <>
      <div className="fixed top-0 left-0 z-50 p-[var(--edge)]">
        <button
          onClick={() => handleNavClick("#top")}
          className="font-mono text-sm tracking-[0.2em]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--ink)" }}
          aria-label="Scroll to top"
        >
          {initials}
        </button>
      </div>

      <div className="fixed top-0 right-0 z-[60] p-[var(--edge)]">
        <button
          onClick={() => setOpen((v) => !v)}
          className="font-mono text-xs tracking-[0.2em] uppercase flex items-center gap-2"
          style={{ fontFamily: "var(--font-mono)", color: "var(--ink)" }}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? "Close" : "Menu"}
          <span
            className="inline-block w-4 h-[1px]"
            style={{ background: "var(--ink)", transform: open ? "rotate(45deg)" : "none" }}
          />
        </button>
      </div>

      <div
        ref={panelRef}
        className="fixed inset-0 z-[55] flex flex-col items-center justify-center gap-12"
        style={{
          background: "var(--bg)",
          transform: "scaleY(0)",
          transformOrigin: "top",
          visibility: "hidden",
        }}
      >
        <div ref={itemsRef} className="flex flex-col items-center gap-4">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.href);
              }}
              className="text-[13vw] sm:text-6xl md:text-7xl leading-none tracking-tight transition-colors"
              style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink)")}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4 flex-wrap justify-center px-6">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleLocaleChange(loc)}
              className="font-mono text-xs tracking-[0.15em] px-3 py-1.5 rounded-full border transition-colors"
              style={{
                fontFamily: "var(--font-mono)",
                borderColor: loc === currentLang ? "var(--accent)" : "var(--line)",
                color: loc === currentLang ? "var(--accent)" : "var(--ink-dim)",
              }}
            >
              {LOCALE_LABEL[loc] || loc.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
