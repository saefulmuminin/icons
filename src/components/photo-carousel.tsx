"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * A row of photographs the reader moves through one at a time.
 *
 * Built on scroll snapping rather than a transform: the browser then gives the
 * swipe, the momentum and the snap for nothing, and they behave the way every
 * other scrollable thing on the phone does. The buttons and dots below drive
 * the same scroll, so both ways of moving stay in step — nothing here is a
 * second copy of "which picture are we on".
 */
export function PhotoCarousel({
  photos,
  prevLabel,
  nextLabel,
  goLabel,
  className = "",
}: {
  photos: readonly { src: string; width: number; height: number }[];
  prevLabel: string;
  nextLabel: string;
  goLabel: string;
  className?: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;

    // Scroll fires far more often than the dots need to change, so the read is
    // held back to one a frame.
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!el.clientWidth) return;
        const i = Math.round(el.scrollLeft / el.clientWidth);
        setAt(Math.max(0, Math.min(photos.length - 1, i)));
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
    };
  }, [photos.length]);

  const goTo = (i: number) => {
    const el = track.current;
    if (!el) return;

    const next = Math.max(0, Math.min(photos.length - 1, i));
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    setAt(next);
  };

  const step =
    "grid size-8 place-items-center rounded-full border border-ink/15 bg-paper/90 text-ink backdrop-blur transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:pointer-events-none disabled:opacity-35";

  return (
    <div className={className}>
      <div className="relative">
        <div
          ref={track}
          className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-2xl ring-1 ring-ink/10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {photos.map((photo, i) => (
            <div
              key={photo.src}
              className="relative aspect-3/2 w-full flex-none snap-center"
            >
              <Image
                src={photo.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="object-cover"
                // Only the one on screen at first load is worth fetching eagerly.
                loading={i === 0 ? undefined : "lazy"}
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-2 top-1/2 flex -translate-y-1/2 justify-between">
          <button
            type="button"
            onClick={() => goTo(at - 1)}
            disabled={at === 0}
            aria-label={prevLabel}
            className={`pointer-events-auto ${step}`}
          >
            <Arrow className="rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => goTo(at + 1)}
            disabled={at === photos.length - 1}
            aria-label={nextLabel}
            className={`pointer-events-auto ${step}`}
          >
            <Arrow />
          </button>
        </div>
      </div>

      <div className="mt-3 flex justify-center gap-1.5">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`${goLabel} ${i + 1}`}
            aria-current={i === at || undefined}
            className={`h-1.5 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
              i === at ? "w-5 bg-brand" : "w-1.5 bg-ink/20 hover:bg-ink/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={`size-4 ${className}`}
    >
      <path
        d="m6.5 3.5 4.5 4.5-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
