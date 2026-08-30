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

    const addListeners = () => {
      const interactiveEls = document.querySelectorAll(
        'a, button, [role="button"], .cursor-pointer, input, select, textarea, label'
      );
      const textEls = document.querySelectorAll("input[type='text'], input[type='email'], textarea");

      interactiveEls.forEach((el) => {
        el.addEventListener("mouseenter", onMouseEnterLink);
        el.addEventListener("mouseleave", onMouseLeaveLink);
      });

      textEls.forEach((el) => {
        el.addEventListener("mouseenter", onMouseEnterText);
        el.addEventListener("mouseleave", onMouseLeaveText);
      });
    };

    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });
    addListeners();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, []);

  return <div id="cursor-dot" ref={dotRef} />;
}
