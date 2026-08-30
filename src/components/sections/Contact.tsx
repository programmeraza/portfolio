"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig } from "@/lib/data";
import type { Dictionary } from "@/dictionaries/types";
gsap.registerPlugin(ScrollTrigger);

interface FormData {
  name: string;
  email: string;
  message: string;
}

type Status = "idle" | "loading" | "success" | "error";

function FloatInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  required,
  multiline = false,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  multiline?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value.length > 0;

  const inputClass =
    "w-full bg-transparent outline-none text-sm resize-none transition-colors duration-300";

  const inputStyle = {
    color: "var(--color-text-primary)",
    fontFamily: "var(--font-body)",
    caretColor: "var(--color-accent-cyan)",
  };

  const wrapperStyle = {
    background: "var(--color-surface)",
    border: `1px solid ${focused ? "var(--color-accent-cyan)" : "var(--color-border)"}`,
    borderRadius: "12px",
    padding: "20px 20px 12px",
    position: "relative" as const,
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
    boxShadow: focused ? "0 0 0 3px rgba(0, 212, 255, 0.08)" : "none",
  };

  const labelStyle = {
    position: "absolute" as const,
    top: isActive ? "10px" : "50%",
    left: "20px",
    transform: multiline ? (isActive ? "none" : "translateY(0)") : isActive ? "none" : "translateY(-50%)",
    fontSize: isActive ? "0.7rem" : "0.875rem",
    color: isActive ? "var(--color-accent-cyan)" : "var(--color-text-muted)",
    fontFamily: "var(--font-heading)",
    letterSpacing: isActive ? "0.1em" : "normal",
    textTransform: isActive ? ("uppercase" as const) : ("none" as const),
    transition: "all 0.25s var(--ease-smooth)",
    pointerEvents: "none" as const,
  };

  return (
    <div style={wrapperStyle}>
      <label htmlFor={id} style={labelStyle}>
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          rows={5}
          className={inputClass}
          style={{ ...inputStyle, paddingTop: "4px" }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
        />
      ) : (
        <input
          id={id}
          type={type}
          className={inputClass}
          style={{ ...inputStyle, paddingTop: "4px" }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
        />
      )}
    </div>
  );
}

export default function Contact({ dict }: { dict?: Dictionary }) {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

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

      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: formRef.current, start: "top 85%" },
        }
      );
    }, sectionRef.current ?? undefined);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setErrorMessage("");

    // Button loading animation
    if (btnRef.current) {
      gsap.to(btnRef.current, { scale: 0.97, duration: 0.2 });
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });

      // Success animation
      if (btnRef.current) {
        gsap.fromTo(
          btnRef.current,
          { scale: 0.97 },
          { scale: 1, duration: 0.4, ease: "back.out(2)" }
        );
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");

      // Error shake
      if (btnRef.current) {
        gsap.fromTo(
          btnRef.current,
          { x: -8 },
          { x: 0, duration: 0.4, ease: "elastic.out(1, 0.3)" }
        );
      }
    }

    setTimeout(() => {
      setStatus((prev) => (prev !== "loading" ? "idle" : prev));
    }, 5000);
  };

  return (
    <section ref={sectionRef} id="contact" className="section-padding">
      <div className="container-custom">
        {/* Header */}
        <div ref={headingRef} className="text-center mb-16">
          <div className="section-label justify-center">{dict?.contact?.label || "Contact"}</div>
          <h2 className="text-heading mb-4" style={{ color: "var(--color-text-primary)" }}>
            {dict?.contact?.title1 || "Let's build"} <span className="gradient-text">{dict?.contact?.title2 || "something great together"}</span>
          </h2>
          <p
            className="text-subheading max-w-lg mx-auto"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {dict?.contact?.desc || "Have a project in mind? I'd love to hear about it. Message goes straight to my Telegram — I reply fast."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
          {/* Left — info cards */}
          <div className="lg:col-span-2 space-y-4">
            {/* Available badge */}
            {siteConfig.availableForWork && (
              <div
                className="glass-card p-5 rounded-2xl flex items-center gap-3"
              >
                <div
                  className="w-3 h-3 rounded-full animate-pulse-glow flex-shrink-0"
                  style={{ background: "var(--color-accent-emerald)" }}
                />
                <div>
                  <div
                    className="text-sm font-semibold"
                    style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}
                  >
                    {dict?.contact?.available || "Available for work"}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {dict?.contact?.availableDesc || "Open to full-time & freelance"}
                  </div>
                </div>
              </div>
            )}

            {/* Contact items */}
            {[
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                ),
                label: "Email",
                value: siteConfig.email,
                href: `mailto:${siteConfig.email}`,
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                ),
                label: "Telegram",
                value: siteConfig.telegramHandle,
                href: siteConfig.telegram,
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                ),
                label: "GitHub",
                value: siteConfig.githubHandle,
                href: siteConfig.github,
              },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="glass-card p-5 rounded-2xl flex items-center gap-4 transition-all duration-300 hover:border-[var(--color-border-strong)] hover:translate-y-[-2px] block"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(0,212,255,0.1)",
                    color: "var(--color-accent-cyan)",
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <div
                    className="text-xs mb-0.5 tracking-widest uppercase"
                    style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-heading)" }}
                  >
                    {item.label}
                  </div>
                  <div
                    className="text-sm font-medium"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {item.value}
                  </div>
                </div>
              </a>
            ))}

            {/* Telegram note */}
            <div
              className="p-4 rounded-xl text-xs"
              style={{
                background: "rgba(0, 212, 255, 0.05)",
                border: "1px solid rgba(0, 212, 255, 0.15)",
                color: "var(--color-text-secondary)",
              }}
            >
              {dict?.contact?.telegramNote ||
                "📱 Form messages are delivered instantly to my Telegram. Expect a reply within 24 hours."}
            </div>
          </div>

          {/* Right — Form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="lg:col-span-3 space-y-4"
            style={{ opacity: 0 }}
          >
            <FloatInput
              id="contact-name"
              label={dict?.contact?.form?.name || "Your Name"}
              value={formData.name}
              onChange={(v) => setFormData((f) => ({ ...f, name: v }))}
              required
            />
            <FloatInput
              id="contact-email"
              label={dict?.contact?.form?.email || "Email Address"}
              type="email"
              value={formData.email}
              onChange={(v) => setFormData((f) => ({ ...f, email: v }))}
              required
            />
            <FloatInput
              id="contact-message"
              label={dict?.contact?.form?.message || "Your Message"}
              value={formData.message}
              onChange={(v) => setFormData((f) => ({ ...f, message: v }))}
              multiline
              required
            />

            {/* Status messages */}
            {status === "success" && (
              <div
                className="p-4 rounded-xl text-sm flex items-center gap-3"
                style={{
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  color: "var(--color-accent-emerald)",
                }}
              >
                ✅ {dict?.contact?.form?.success || "Message sent! I'll get back to you soon."}
              </div>
            )}

            {status === "error" && (
              <div
                className="p-4 rounded-xl text-sm flex items-center gap-3"
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#ef4444",
                }}
              >
                ❌ {errorMessage || dict?.contact?.form?.error || "Something went wrong. Please try again."}
              </div>
            )}

            {/* Submit */}
            <button
              ref={btnRef}
              type="submit"
              disabled={status === "loading"}
              className="btn-primary w-full justify-center py-4"
              style={{ opacity: status === "loading" ? 0.7 : 1 }}
            >
              {status === "loading" ? (
                <>
                  <svg
                    className="animate-spin"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  {dict?.contact?.form?.sending || "Sending..."}
                </>
              ) : (
                <>
                  {dict?.contact?.form?.send || "Send Message"}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
