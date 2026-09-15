"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { siteConfig } from "@/lib/data";
import type { Dictionary } from "@/dictionaries/types";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface FormData {
  name: string;
  email: string;
  message: string;
  website: string;
}

type Status = "idle" | "loading" | "success" | "error";

export default function Contact({ dict }: { dict: Dictionary }) {
  const rootRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", message: "", website: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useGSAP(
    () => {
      gsap.fromTo(
        rootRef.current?.querySelectorAll("[data-reveal]") ?? [],
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 75%" },
        }
      );
    },
    { scope: rootRef }
  );

  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;
      if (open) {
        gsap.set(panel, { height: "auto" });
        gsap.from(panel, { height: 0, opacity: 0, duration: 0.5, ease: "power3.inOut" });
      }
    },
    { dependencies: [open], scope: rootRef }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus("success");
      setFormData({ name: "", email: "", message: "", website: "" });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <section id="contact" ref={rootRef} className="chapter">
      <div className="frame">
        <p data-reveal className="kicker mb-6">
          {dict.contact.label}
        </p>
        <h2
          data-reveal
          className="mb-8 leading-[0.92] tracking-tight"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 9vw, 6.5rem)", fontWeight: 700 }}
        >
          {dict.contact.title1} <br />
          <span style={{ color: "var(--accent)" }}>{dict.contact.title2}</span>
        </h2>
        <p data-reveal className="max-w-xl mb-10" style={{ color: "var(--ink-dim)", fontSize: "1.1rem" }}>
          {dict.contact.desc}
        </p>

        <div data-reveal className="flex flex-wrap gap-4 mb-4">
          <button className="btn" onClick={() => setOpen((v) => !v)}>
            {open ? "×" : dict.contact.form.send}
          </button>
          <a href={`mailto:${siteConfig.email}`} className="btn-outline">
            {siteConfig.email}
          </a>
          {siteConfig.telegram && (
            <a href={siteConfig.telegram} target="_blank" rel="noopener noreferrer" className="btn-outline">
              {siteConfig.telegramHandle}
            </a>
          )}
        </div>

        {open && (
          <div ref={panelRef} className="overflow-hidden mt-8 max-w-xl">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={(e) => setFormData((f) => ({ ...f, website: e.target.value }))}
                autoComplete="off"
                tabIndex={-1}
                aria-hidden
                style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
              />
              <input
                required
                type="text"
                placeholder={dict.contact.form.name}
                value={formData.name}
                onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                className="bg-transparent py-3 outline-none"
                style={{ borderBottom: "1px solid var(--line-strong)", color: "var(--ink)" }}
              />
              <input
                required
                type="email"
                placeholder={dict.contact.form.email}
                value={formData.email}
                onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                className="bg-transparent py-3 outline-none"
                style={{ borderBottom: "1px solid var(--line-strong)", color: "var(--ink)" }}
              />
              <textarea
                required
                rows={4}
                placeholder={dict.contact.form.message}
                value={formData.message}
                onChange={(e) => setFormData((f) => ({ ...f, message: e.target.value }))}
                className="bg-transparent py-3 outline-none resize-none"
                style={{ borderBottom: "1px solid var(--line-strong)", color: "var(--ink)" }}
              />
              <button type="submit" className="btn w-fit" disabled={status === "loading"}>
                {status === "loading" ? dict.contact.form.sending : dict.contact.form.send}
              </button>
              {status === "success" && (
                <p className="text-sm" style={{ color: "var(--accent)" }}>
                  {dict.contact.form.success}
                </p>
              )}
              {status === "error" && (
                <p className="text-sm" style={{ color: "#ff5a1f" }}>
                  {errorMessage || dict.contact.form.error}
                </p>
              )}
            </form>
            <p className="kicker mt-6" style={{ textTransform: "none", letterSpacing: "normal" }}>
              {dict.contact.telegramNote}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
