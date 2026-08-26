"use client";

import { createTimeline, onScroll, stagger, utils } from "animejs";
import { useEffect, useRef } from "react";

export type KeyDate = { date: string; label: string };

/** One hue per step, warm to cool, so the row reads as five distinct beats. */
/** One tone per milestone, read from the theme rather than spelled here. */
const ACCENTS = [
  "var(--color-step-amber)",
  "var(--color-brand)",
  "var(--color-step-teal)",
  "var(--color-step-olive)",
  "var(--color-mint)",
];

/** Mixes an accent into white — computed rather than hand-picked, so the wash
 *  and the hairline always trail the same hue as the step. */
function wash(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16);
  const mix = (channel: number) =>
    Math.round(channel * amount + 255 * (1 - amount));

  return `rgb(${mix((n >> 16) & 255)} ${mix((n >> 8) & 255)} ${mix(n & 255)})`;
}

/**
 * The run-up as a timeline: a rail draws itself along the milestones, a marker
 * lands on it for each one, and a compact card hangs beneath carrying the
 * date, the milestone and a small spot illustration. The conference itself
 * inverts to dark, so the destination reads apart from the deadlines.
 */
export function KeyDates({ entries }: { entries: KeyDate[] }) {
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const node = list.current;
    if (!node) return;

    const hidden = node.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!hidden.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      utils.set(hidden, { opacity: 1 });
      return;
    }

    const across = node.querySelector<HTMLElement>("[data-rail-across]");
    const down = node.querySelector<HTMLElement>("[data-rail-down]");
    const dots = node.querySelectorAll<HTMLElement>("[data-dot]");
    const cards = node.querySelectorAll<HTMLElement>("[data-card]");
    const entrance = createTimeline({
      defaults: { ease: "outExpo" },
      autoplay: onScroll({
        target: node,
        enter: { container: "86%", target: "top" },
        repeat: false,
      }),
    });

    // Only one rail is on screen at a time; animating both costs nothing and
    // keeps the timeline free of breakpoint guesswork.
    if (across) {
      entrance.add(
        across,
        { opacity: [0, 1], scaleX: [0, 1], duration: 1100 },
        0,
      );
    }
    if (down) {
      entrance.add(
        down,
        { opacity: [0, 1], scaleY: [0, 1], duration: 1100 },
        0,
      );
    }

    entrance
      .add(
        dots,
        {
          opacity: [0, 1],
          scale: [0, 1],
          duration: 620,
          ease: "outBack",
          delay: stagger(120),
        },
        180,
      )
      .add(
        cards,
        {
          opacity: [0, 1],
          y: [20, 0],
          duration: 780,
          delay: stagger(120),
        },
        300,
      );

    return () => {
      entrance.revert();
    };
  }, []);

  return (
    <ol
      ref={list}
      className="relative mt-10 grid gap-5 sm:mt-12 lg:grid-cols-5"
    >
      {/* Stacked down the page on a phone, laid along the top on a desktop. */}
      <span
        aria-hidden
        data-reveal
        data-rail-down
        className="absolute top-[9px] bottom-[9px] left-[5px] w-px origin-top bg-ink/15 lg:hidden"
      />
      <span
        aria-hidden
        data-reveal
        data-rail-across
        className="absolute top-[5px] right-[5px] left-[5px] hidden h-px origin-left bg-ink/15 lg:block"
      />

      {entries.map((entry, i) => {
        const arrival = i === entries.length - 1;
        const accent = ACCENTS[i % ACCENTS.length];

        return (
          <li
            key={entry.label}
            className="relative flex flex-col pl-8 lg:pt-9 lg:pl-0"
          >
            <span
              aria-hidden
              data-reveal
              data-dot
              style={{
                borderColor: accent,
                backgroundColor: arrival ? accent : undefined,
              }}
              className={`absolute top-[3px] left-0 block h-[11px] w-[11px] rounded-full border-2 lg:top-0 ${
                arrival ? "" : "bg-sage"
              }`}
            />

            <div
              data-reveal
              data-card
              style={{ boxShadow: `inset 0 0 0 1px ${wash(accent, 0.28)}` }}
              className="relative flex-1 overflow-hidden rounded-xl bg-paper p-4 sm:p-[1.125rem]"
            >
              <div
                style={{ color: accent }}
                className="font-display text-[1rem] leading-[1.25] font-bold"
              >
                {entry.date}
              </div>

              <p className="mt-1.5 font-sans text-[0.8125rem] leading-[1.55] text-pretty text-body">
                {entry.label}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
