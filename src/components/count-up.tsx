"use client";

import { animate, onScroll } from "animejs";
import { useEffect, useRef } from "react";

/**
 * A number that runs up to itself as it comes into view.
 *
 * The finished figure is what the server renders, so a reader without
 * scripting — or a search engine — sees 300, not 0. The count only replaces it
 * once the band is still below the fold and there is a climb worth watching:
 * a figure already on screen is left exactly as it is rather than snapped back
 * to zero in front of the reader.
 */
export function CountUp({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  const node = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = node.current;
    if (!el) return;

    const target = Number(value);
    // Anything that is not a plain number — "300+", "3 hari" — stays as typed.
    if (!Number.isFinite(target)) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    const state = { n: 0 };
    el.textContent = "0";

    const run = animate(state, {
      n: target,
      duration: 1600,
      ease: "outExpo",
      onUpdate: () => {
        el.textContent = String(Math.round(state.n));
      },
      autoplay: onScroll({
        target: el,
        enter: { container: "92%", target: "top" },
        repeat: false,
      }),
    });

    return () => {
      run.revert();
      el.textContent = value;
    };
  }, [value]);

  return (
    <span ref={node} className={className}>
      {value}
    </span>
  );
}
