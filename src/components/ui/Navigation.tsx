"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { locales } from "../../dictionaries";
import { useRouter, usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

export default function Navigation({ dict, currentLang }: { dict?: any, currentLang?: string }) {
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("hero");

  const overlayRef = useRef<HTMLDivElement>(null);
  const menuLinksRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const navItems = [
    { label: dict?.nav?.about || "About", href: "#about" },
    { label: dict?.nav?.projects || "Projects", href: "#projects" },
    { label: dict?.nav?.experience || "Experience", href: "#experience" },
    { label: dict?.nav?.contact || "Contact", href: "#contact" },
  ];

  // Scroll logic for the pill
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update active section
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) setActiveSection(section.id);
        },
      });
    });
    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  // Magnetic hover effect for desktop links
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      linksRef.current.forEach((link) => {
        if (!link) return;
        const hoverAnim = gsap.to(link, {
          scale: 1.1,
          color: "var(--color-accent-cyan)",
          duration: 0.3,
          ease: "power2.out",
          paused: true,
        });

        const handleMouseEnter = () => hoverAnim.play();
        const handleMouseLeave = () => {
          hoverAnim.reverse();
          gsap.to(link, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
        };
        const handleMouseMove = (e: MouseEvent) => {
          const rect = link.getBoundingClientRect();
          const x = (e.clientX - (rect.left + rect.width / 2)) * 0.3;
          const y = (e.clientY - (rect.top + rect.height / 2)) * 0.3;
          gsap.to(link, { x, y, duration: 0.2, ease: "power2.out" });
        };

        link.addEventListener("mouseenter", handleMouseEnter);
        link.addEventListener("mouseleave", handleMouseLeave);
        link.addEventListener("mousemove", handleMouseMove);

        return () => {
          link.removeEventListener("mouseenter", handleMouseEnter);
          link.removeEventListener("mouseleave", handleMouseLeave);
          link.removeEventListener("mousemove", handleMouseMove);
        };
      });
    });
    return () => mm.revert();
  }, [navItems.length]);

  // Mobile menu animation
  useEffect(() => {
    const overlay = overlayRef.current;
    const links = menuLinksRef.current;
    if (!overlay || !links) return;

    if (menuOpen) {
      document.body.style.overflow = "hidden";
      gsap.fromTo(
        overlay,
        { clipPath: "circle(0% at 50% 0)" },
        { clipPath: "circle(150% at 50% 0)", duration: 0.8, ease: "power4.inOut" }
      );
      gsap.fromTo(
        Array.from(links.children),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.3, ease: "power3.out" }
      );
    } else {
      document.body.style.overflow = "";
      gsap.to(overlay, {
        clipPath: "circle(0% at 50% 0)",
        duration: 0.8,
        ease: "power4.inOut",
      });
    }
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth" });
      }, menuOpen ? 700 : 0);
    }
  };

  const handleLanguageChange = (newLocale: string) => {
    setLangDropdownOpen(false);
    const newPath = pathname.replace(`/${currentLang}`, `/${newLocale}`);
    router.push(newPath || `/${newLocale}`);
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50 flex items-center justify-between"
      >
        <div
          className={`w-full flex items-center justify-between transition-all duration-500 rounded-full px-6 md:px-8 py-3 ${
            isScrolled
              ? "bg-[rgba(11,12,22,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              : "bg-[rgba(255,255,255,0.02)] backdrop-blur-md border border-[rgba(255,255,255,0.04)]"
          }`}
        >
          {/* Logo */}
          <a
            href="#hero"
            className="flex items-center gap-2 group cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#hero");
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs transition-transform duration-500 group-hover:rotate-180"
              style={{ background: "var(--gradient-primary)" }}
            >
              {"</>"}
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item, i) => (
              <a
                key={item.label}
                ref={(el) => { linksRef.current[i] = el; }}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className="text-sm font-medium transition-colors duration-300"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: activeSection === item.href.substring(1) ? "var(--color-accent-cyan)" : "var(--color-text-secondary)",
                }}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Language Switcher & Burger */}
          <div className="flex items-center gap-3">
            
            {/* Custom Fancy Dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-2 text-sm font-[var(--font-heading)] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              >
                {currentLang || "ru"}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`transition-transform duration-300 ${langDropdownOpen ? "rotate-180" : ""}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute top-full right-0 mt-2 w-32 rounded-xl bg-[rgba(11,12,22,0.95)] backdrop-blur-3xl border border-[rgba(255,255,255,0.1)] shadow-2xl overflow-hidden transition-all duration-300 origin-top-right ${
                  langDropdownOpen
                    ? "opacity-100 scale-100 translate-y-0 visible"
                    : "opacity-0 scale-95 -translate-y-2 invisible"
                }`}
                onMouseLeave={() => setLangDropdownOpen(false)}
              >
                <div className="flex flex-col py-2">
                    {locales.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => handleLanguageChange(loc)}
                        className={`text-left px-4 py-2 text-xs font-semibold tracking-widest uppercase transition-colors ${
                          loc === currentLang
                            ? "bg-[var(--color-surface-hover)] text-[var(--color-accent-cyan)]"
                            : "text-[var(--color-text-secondary)] hover:bg-[rgba(255,255,255,0.05)] hover:text-white"
                        }`}
                      >
                        {loc === "ru" ? "🇷🇺 " : loc === "en" ? "🇺🇸 " : loc === "ja" ? "🇯🇵 " : loc === "zh" ? "🇨🇳 " : loc === "es" ? "🇪🇸 " : "🇺🇿 "}
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
            </div>

            {/* Mobile Burger */}
            <button
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1 relative z-[60] rounded-full bg-[rgba(255,255,255,0.05)]"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span
                className={`block w-4 h-[2px] bg-[var(--color-text-primary)] transition-transform duration-300 ${
                  menuOpen ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              <span
                className={`block w-4 h-[2px] bg-[var(--color-text-primary)] transition-opacity duration-300 ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block w-4 h-[2px] bg-[var(--color-text-primary)] transition-transform duration-300 ${
                  menuOpen ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Fullscreen Mobile Menu */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[55] flex items-center justify-center pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(11,12,22,0.95), rgba(123,44,191,0.2))",
          backdropFilter: "blur(20px)",
          clipPath: "circle(0% at 50% 0)",
        }}
      >
        <div
          ref={menuLinksRef}
          className={`flex flex-col items-center gap-8 ${
            menuOpen ? "pointer-events-auto" : ""
          } relative z-10`}
        >
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.href);
              }}
              className="text-4xl sm:text-6xl font-bold tracking-tighter hover:text-[var(--color-accent-cyan)] transition-colors"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-text-primary)",
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
