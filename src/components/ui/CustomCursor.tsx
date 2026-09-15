"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    // На тач-устройствах нет курсора мыши — не тратим ресурсы впустую
    const hasFinePointer =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches;
    if (!hasFinePointer) return;

    // Smooth follow using linear interpolation
    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    const animateDot = () => {
      dotPos.current.x = lerp(dotPos.current.x, mousePos.current.x, 0.15);
      dotPos.current.y = lerp(dotPos.current.y, mousePos.current.y, 0.15);

      dot.style.left = `${dotPos.current.x}px`;
      dot.style.top = `${dotPos.current.y}px`;

      rafRef.current = requestAnimationFrame(animateDot);
    };
    rafRef.current = requestAnimationFrame(animateDot);

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseEnterLink = () => dot.classList.add("cursor-hover");
    const onMouseLeaveLink = () => dot.classList.remove("cursor-hover");
    const onMouseEnterText = () => dot.classList.add("cursor-text");
    const onMouseLeaveText = () => dot.classList.remove("cursor-text");

    const onMouseDown = () => {
      gsap.to(dot, { scale: 0.5, duration: 0.15 });
    };

    const onMouseUp = () => {
      gsap.to(dot, { scale: 1, duration: 0.3, ease: "back.out(2)" });
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    // Delegated hover tracking instead of binding mouseenter/mouseleave to
    // every matching element (plus a MutationObserver to re-bind on every
    // DOM change): that version never removed old listeners, so they piled
    // up without bound on any page with dynamic content. mouseover/mouseout
    // bubble, so one pair of listeners on document covers elements added
    // later for free — closest() + relatedTarget avoids re-triggering while
    // the pointer moves between nested children of the same match.
    const interactiveSelector =
      'a, button, [role="button"], .cursor-pointer, input, select, textarea, label';
    const textSelector = "input[type='text'], input[type='email'], textarea";

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest(interactiveSelector)) onMouseEnterLink();
      if (target.closest(textSelector)) onMouseEnterText();
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as Element;
      const related = e.relatedTarget as Element | null;
      if (target.closest(interactiveSelector) && !related?.closest(interactiveSelector)) {
        onMouseLeaveLink();
      }
      if (target.closest(textSelector) && !related?.closest(textSelector)) {
        onMouseLeaveText();
      }
    };

    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <div id="cursor-dot" ref={dotRef} />;
}
