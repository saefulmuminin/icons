"use client";

import { animate } from "animejs";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { clock } from "@/lib/clock";
import { CONFERENCE } from "@/lib/content";
import type { Dict } from "@/lib/i18n";

const TARGET = Date.parse(CONFERENCE.startsAt);

type Parts = { d: string; h: string; m: string; s: string };

const PLACEHOLDER: Parts = { d: "–", h: "––", m: "––", s: "––" };

function remaining(now: number): Parts {
  let s = Math.max(0, Math.floor((TARGET - now) / 1000));
  const d = Math.floor(s / 86400);
  s -= d * 86400;
  const h = Math.floor(s / 3600);
  s -= h * 3600;
  const m = Math.floor(s / 60);
  s -= m * 60;

  const pad = (n: number) => String(n).padStart(2, "0");
  return { d: String(d), h: pad(h), m: pad(m), s: pad(s) };
}

export function Countdown({ t }: { t: Dict }) {
  const now = useSyncExternalStore(
    clock.subscribe,
    clock.getSnapshot,
    clock.getServerSnapshot,
  );

  // null until the clock is live on the client, which keeps the prerendered
  // markup stable and free of a hydration mismatch.
  const parts = now === null ? PLACEHOLDER : remaining(now);

  const cells = [
    { value: parts.d, label: t.cdD },
    { value: parts.h, label: t.cdH },
    { value: parts.m, label: t.cdM },
    { value: parts.s, label: t.cdS },
  ];

  return (
    <div className="mt-2.5 grid grid-cols-4 gap-2">
      {cells.map((cell) => (
        <Cell key={cell.label} value={cell.value} label={cell.label} />
      ))}
    </div>
  );
}

/** One unit of the clock, its digits rolling up whenever they change. */
function Cell({ value, label }: { value: string; label: string }) {
  const digits = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);

  useEffect(() => {
    if (shown.current === value) return;
    shown.current = value;

    const node = digits.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // React has already swapped the text, so the new figure rides up into
    // place from behind the clipped edge.
    const roll = animate(node, {
      y: ["105%", "0%"],
      opacity: [0, 1],
      duration: 480,
      ease: "outExpo",
    });

    return () => {
      roll.revert();
    };
  }, [value]);

  return (
    <div className="rounded-[10px] border border-white/12 bg-white/10 px-2 py-2.5 text-center backdrop-blur-sm">
      <span className="block overflow-hidden">
        <span
          ref={digits}
          className="block font-display text-[1.375rem] leading-[1.25] font-bold tabular-nums"
        >
          {value}
        </span>
      </span>
      <span className="mt-0.5 block font-sans text-[0.625rem] font-medium tracking-[0.1em] uppercase text-mint-dim">
        {label}
      </span>
    </div>
  );
}
