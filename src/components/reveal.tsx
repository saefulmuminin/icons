"use client";

import { animate, onScroll, utils } from "animejs";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

/**
 * Reveals every `[data-reveal]` descendant as it climbs into the viewport —
 * each on its own scroll observer, so a long column unfolds while it is read
 * rather than all at once. The pieces start hidden in CSS; readers who ask
 * for less motion, or run without scripting, get them already in place.
 */
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = root.current;
    if (!node) return;

    const items = node.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!items.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      utils.set(items, { opacity: 1 });
      return;
    }

    const entrances = Array.from(items).map((item) =>
      animate(item, {
        opacity: [0, 1],
        y: [30, 0],
        filter: ["blur(8px)", "blur(0px)"],
        duration: 900,
        ease: "outExpo",
        autoplay: onScroll({
          target: item,
          // Starts once the piece has climbed a tenth of the way up.
          enter: { container: "90%", target: "top" },
          repeat: false,
        }),
      }),
    );

    return () => {
      entrances.forEach((entrance) => entrance.revert());
    };
  }, []);

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
