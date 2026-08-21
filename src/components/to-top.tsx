"use client";

import { animate, utils } from "animejs";
import { useEffect, useRef, useState } from "react";

/** Appears once the reader is well past the hero, and takes them back up. */
export function ToTop({ label }: { label: string }) {
  const button = useRef<HTMLButtonElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 700);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const node = button.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      utils.set(node, { opacity: shown ? 1 : 0 });
      return;
    }

    animate(node, {
      opacity: shown ? 1 : 0,
      scale: shown ? 1 : 0.8,
      y: shown ? 0 : 12,
      duration: 420,
      ease: shown ? "outBack" : "outQuad",
    });
  }, [shown]);

  function toTop() {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: still ? "auto" : "smooth" });
  }

  return (
    <button
      ref={button}
      type="button"
      onClick={toTop}
      aria-label={label}
      tabIndex={shown ? 0 : -1}
      style={{ opacity: 0 }}
      className={`fixed right-5 bottom-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-brand-deep text-white shadow-[0_12px_30px_-12px_rgba(4,20,13,0.7)] transition-colors hover:bg-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:right-7 sm:bottom-7 ${
        shown ? "" : "pointer-events-none"
      }`}
    >
      <svg viewBox="0 0 16 16" fill="none" aria-hidden className="h-4 w-4">
        <path
          d="M8 13V3.6M3.8 7.8 8 3.6l4.2 4.2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
