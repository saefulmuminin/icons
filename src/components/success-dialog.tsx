"use client";

import { animate, createTimeline, utils } from "animejs";
import { useCallback, useEffect, useRef } from "react";

/**
 * The confirmation that a form went through, as a panel over the page.
 *
 * The mark draws itself: the ring sweeps round, the tick follows it, and the
 * badge takes one small breath at the end. It is the same beat the familiar
 * alert libraries use, built here out of the animation the site already
 * carries rather than adding a library for one dialog.
 *
 * Both figures are stroked paths measured at run time, so the drawing stays
 * exact if either shape is ever redrawn.
 */
export function SuccessDialog({
  title,
  text,
  actionLabel,
  closeLabel,
  onClose,
}: {
  title: string;
  text: string;
  actionLabel: string;
  closeLabel: string;
  onClose: () => void;
}) {
  const backdrop = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const tick = useRef<SVGPathElement>(null);
  const badge = useRef<HTMLDivElement>(null);
  const action = useRef<HTMLButtonElement>(null);

  // A second click while the panel is already leaving would fire onClose twice.
  const leaving = useRef(false);

  const still = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const dismiss = useCallback(() => {
    if (leaving.current) return;
    leaving.current = true;

    if (still() || !card.current) {
      onClose();
      return;
    }

    if (backdrop.current) {
      animate(backdrop.current, { opacity: 0, duration: 240, ease: "outQuad" });
    }

    animate(card.current, {
      opacity: 0,
      scale: 0.96,
      y: 16,
      duration: 260,
      ease: "outQuad",
      onComplete: onClose,
    });
  }, [onClose]);

  useEffect(() => {
    action.current?.focus();

    const restore = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const rows = card.current?.querySelectorAll<HTMLElement>("[data-row]");

    // Measured, not guessed: a dash the length of the line hides it exactly.
    const lengths: [SVGGeometryElement, number][] = [];
    for (const shape of [ring.current, tick.current]) {
      if (shape) lengths.push([shape, shape.getTotalLength()]);
    }

    if (still()) {
      if (rows) utils.set(rows, { opacity: 1 });
      if (card.current) utils.set(card.current, { opacity: 1 });
      for (const [shape] of lengths) utils.set(shape, { strokeDashoffset: 0 });

      return () => {
        document.body.style.overflow = restore;
      };
    }

    for (const [shape, length] of lengths) {
      utils.set(shape, { strokeDasharray: length, strokeDashoffset: length });
    }

    if (backdrop.current) {
      animate(backdrop.current, {
        opacity: [0, 1],
        duration: 260,
        ease: "outQuad",
      });
    }

    const intro = createTimeline({ defaults: { ease: "outExpo" } });

    if (card.current) {
      // outBack overshoots a little on the way in, which is what reads as a
      // pop rather than a fade.
      intro.add(
        card.current,
        {
          opacity: [0, 1],
          scale: [0.84, 1],
          y: [18, 0],
          duration: 620,
          ease: "outBack",
        },
        0,
      );
    }

    if (ring.current) {
      intro.add(
        ring.current,
        { strokeDashoffset: 0, duration: 620, ease: "outQuart" },
        140,
      );
    }

    if (tick.current) {
      intro.add(
        tick.current,
        { strokeDashoffset: 0, duration: 380, ease: "outQuart" },
        520,
      );
    }

    if (badge.current) {
      // One breath, once both lines have landed.
      intro.add(
        badge.current,
        { scale: [1, 1.12, 1], duration: 520, ease: "outElastic(1, .55)" },
        820,
      );
    }

    if (rows?.length) {
      intro.add(
        rows,
        { opacity: [0, 1], y: [12, 0], duration: 520, delay: 90 },
        420,
      );
    }

    return () => {
      document.body.style.overflow = restore;
      intro.revert();
    };
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") dismiss();
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dismiss]);

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="success-title"
      aria-describedby="success-text"
      className="fixed inset-0 z-100 flex items-center justify-center p-4"
    >
      <div
        ref={backdrop}
        onClick={dismiss}
        style={{ opacity: 0 }}
        className="absolute inset-0 bg-[rgba(7,20,14,0.86)] backdrop-blur-sm"
      />

      <div
        ref={card}
        style={{ opacity: 0 }}
        className="relative w-full max-w-[26rem] rounded-2xl bg-paper px-6 py-9 text-center shadow-[0_40px_90px_-40px_rgba(4,20,13,0.8)] sm:px-9"
      >
        <div ref={badge} className="mx-auto w-fit">
          <svg viewBox="0 0 52 52" aria-hidden className="size-20">
            <circle
              cx="26"
              cy="26"
              r="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-brand/20"
            />
            <circle
              ref={ring}
              cx="26"
              cy="26"
              r="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              // Starts at twelve o'clock and sweeps clockwise, the way a ring
              // of progress is read.
              transform="rotate(-90 26 26)"
              className="text-brand"
            />
            <path
              ref={tick}
              d="M15.5 26.5 22.5 33.5 36.5 19.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-brand"
            />
          </svg>
        </div>

        <h2
          id="success-title"
          data-row
          style={{ opacity: 0 }}
          className="mt-5 font-display text-[1.375rem] leading-tight font-bold text-ink"
        >
          {title}
        </h2>

        <p
          id="success-text"
          data-row
          style={{ opacity: 0 }}
          className="mx-auto mt-3 max-w-[34ch] font-sans text-[0.9375rem] leading-[1.65] text-pretty text-muted"
        >
          {text}
        </p>

        <button
          ref={action}
          type="button"
          data-row
          style={{ opacity: 0 }}
          onClick={dismiss}
          className="mt-7 rounded-full bg-brand px-[1.625rem] py-[0.8125rem] font-display text-[0.9375rem] font-bold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark"
        >
          {actionLabel}
        </button>

        <button
          type="button"
          onClick={dismiss}
          aria-label={closeLabel}
          className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
            <path
              d="m4 4 8 8M12 4l-8 8"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
