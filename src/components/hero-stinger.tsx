"use client";

import { animate, createTimeline, stagger, utils } from "animejs";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { CONFERENCE } from "@/lib/content";
import logo from "@/../public/iconz10-logo.png";

/**
 * The card that signs off the reel: as the footage runs out, the ICONZ 10
 * logo assembles itself over the backdrop and dissolves when the loop
 * restarts. Wide screens only — anything narrower has no room beside the
 * headline, and the card must never cover it.
 */
export function HeroStinger({
  active,
  label,
  dates,
}: {
  active: boolean;
  label: string;
  dates: string;
}) {
  const card = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = card.current;
    if (!node) return;

    const parts = node.querySelectorAll<HTMLElement>("[data-stinger]");
    const rule = node.querySelector<HTMLElement>("[data-stinger-rule]");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      utils.set(node, { opacity: active ? 1 : 0 });
      utils.set(parts, { opacity: 1 });
      return;
    }

    if (!active) {
      const out = animate(node, {
        opacity: 0,
        scale: 0.96,
        filter: "blur(12px)",
        duration: 520,
        ease: "outQuad",
      });
      return () => {
        out.revert();
      };
    }

    const timeline = createTimeline({ defaults: { ease: "outExpo" } });

    timeline
      .add(
        node,
        {
          opacity: [0, 1],
          scale: [0.92, 1],
          filter: ["blur(14px)", "blur(0px)"],
          duration: 900,
        },
        0,
      )
      .add(
        parts,
        { opacity: [0, 1], y: [18, 0], duration: 800, delay: stagger(90) },
        220,
      );

    if (rule) {
      timeline.add(rule, { scaleX: [0, 1], duration: 700 }, 420);
    }

    return () => {
      timeline.revert();
    };
  }, [active]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-[32%] max-w-[22rem] items-center justify-center pr-7 pb-40 xl:flex"
    >
      <div
        ref={card}
        style={{ opacity: 0 }}
        className="w-full rounded-2xl border border-white/15 bg-[rgba(7,33,22,0.55)] px-8 py-9 text-center backdrop-blur-md"
      >
        {/* The logo keeps its own green, so it sits on a light plate rather
            than being flattened to white. */}
        <div data-stinger className="rounded-xl bg-white px-5 py-4">
          <Image src={logo} alt="" className="mx-auto h-auto w-[10.5rem]" />
        </div>

        <div
          data-stinger
          data-stinger-rule
          className="mx-auto mt-6 h-px w-full origin-left bg-white/25"
        />

        <div
          data-stinger
          className="mt-5 font-display text-sm font-bold tracking-[0.3em] uppercase text-mint-soft"
        >
          {label}
        </div>

        <div
          data-stinger
          className="mt-2 font-sans text-xs tracking-[0.12em] uppercase text-white/60"
        >
          {dates}
        </div>
      </div>
    </div>
  );
}
