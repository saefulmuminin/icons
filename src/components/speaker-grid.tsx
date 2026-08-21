"use client";

import { animate, createTimeline, onScroll, stagger, utils } from "animejs";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ProfileGroup, ProfileGroupKey } from "@/lib/content";

export type Speaker = {
  role: string;
  name: string;
  photo: string | null;
  profile: ProfileGroup[] | null;
};

export type ProfileLabels = Record<ProfileGroupKey, string> & {
  open: string;
  close: string;
};

export function SpeakerGrid({
  speakers,
  labels,
}: {
  speakers: Speaker[];
  labels: ProfileLabels;
}) {
  const grid = useRef<HTMLUListElement>(null);
  const [opened, setOpened] = useState<number | null>(null);

  // The row arrives as a wave: each portrait wipes up from its own bottom
  // edge while the picture inside keeps easing out of a slow zoom, and the
  // captions climb in behind them.
  useEffect(() => {
    const node = grid.current;
    if (!node) return;

    const hidden = node.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!hidden.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      utils.set(hidden, { opacity: 1 });
      return;
    }

    const frames = node.querySelectorAll<HTMLElement>("[data-frame]");
    const shots = node.querySelectorAll<HTMLElement>("[data-shot]");
    const lines = node.querySelectorAll<HTMLElement>("[data-line]");

    const entrance = createTimeline({
      defaults: { ease: "outExpo" },
      autoplay: onScroll({
        target: node,
        enter: { container: "82%", target: "top" },
        repeat: false,
      }),
    });

    entrance
      .add(
        frames,
        {
          opacity: [0, 1],
          clipPath: ["inset(100% 0 0 0)", "inset(0% 0 0 0)"],
          duration: 950,
          delay: stagger(70),
        },
        0,
      )
      .add(
        shots,
        {
          scale: [1.22, 1],
          duration: 1900,
          ease: "outQuint",
          delay: stagger(70),
        },
        0,
      )
      .add(
        lines,
        { opacity: [0, 1], y: [16, 0], duration: 700, delay: stagger(36) },
        340,
      );

    return () => {
      entrance.revert();
    };
  }, []);

  return (
    <>
      {/* Ten columns, two to a card: five fill the first row and the
          remaining four sit centred beneath them. */}
      <ul
        ref={grid}
        className="mt-10 grid grid-cols-2 gap-x-5 gap-y-9 sm:mt-12 sm:grid-cols-3 lg:grid-cols-10"
      >
        {speakers.map((speaker, i) => (
          <SpeakerCard
            key={speaker.name}
            speaker={speaker}
            openLabel={labels.open}
            onOpen={() => setOpened(i)}
            className={`lg:col-span-2 ${i === 5 ? "lg:col-start-2" : ""}`}
          />
        ))}
      </ul>

      {opened !== null && (
        <SpeakerDetail
          speaker={speakers[opened]}
          labels={labels}
          onClose={() => setOpened(null)}
        />
      )}
    </>
  );
}

/** One speaker: portrait, role, name. */
function SpeakerCard({
  speaker,
  openLabel,
  onOpen,
  className = "",
}: {
  speaker: Speaker;
  openLabel: string;
  onOpen: () => void;
  className?: string;
}) {
  const body = (
    <>
      <div
        data-reveal
        data-frame
        className="relative aspect-[4/5] overflow-hidden rounded-xl bg-pale/40"
      >
        {speaker.photo ? (
          <Image
            data-shot
            src={speaker.photo}
            alt={speaker.name}
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 30vw, 45vw"
            className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          // No portrait on file yet — a quiet plate, never a broken frame.
          <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(160deg,#e6ece7_0%,#cfdcd4_100%)]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
              className="h-9 w-9 text-brand/35"
            >
              <circle
                cx="12"
                cy="8.4"
                r="3.9"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <path
                d="M4.6 20.4a7.4 7.4 0 0 1 14.8 0"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}

        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_top,rgba(11,46,31,0.72),transparent_46%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />

        {speaker.profile && (
          <span className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-2 font-sans text-[0.625rem] font-semibold tracking-[0.14em] text-white uppercase opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            {openLabel} →
          </span>
        )}
      </div>

      <div
        data-reveal
        data-line
        className="mt-3.5 font-sans text-[0.6875rem] font-semibold tracking-[0.12em] text-brand uppercase"
      >
        {speaker.role}
      </div>
      <div
        data-reveal
        data-line
        className="mt-1.5 font-display text-[0.9375rem] leading-[1.35] font-semibold text-pretty text-ink"
      >
        {speaker.name}
      </div>
    </>
  );

  if (!speaker.profile) {
    return <li className={`group ${className}`}>{body}</li>;
  }

  return (
    <li className={className}>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`${openLabel}: ${speaker.name}`}
        className="group block w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
      >
        {body}
      </button>
    </li>
  );
}

/**
 * The profile sheet. The portrait unveils itself from the bottom edge and
 * drifts slowly inward while the entries climb in behind it.
 */
function SpeakerDetail({
  speaker,
  labels,
  onClose,
}: {
  speaker: Speaker;
  labels: ProfileLabels;
  onClose: () => void;
}) {
  const backdrop = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const portrait = useRef<HTMLImageElement>(null);
  const closer = useRef<HTMLButtonElement>(null);
  const leaving = useRef(false);

  const dismiss = useCallback(() => {
    if (leaving.current) return;
    leaving.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onClose();
      return;
    }

    if (backdrop.current) {
      animate(backdrop.current, { opacity: 0, duration: 280, ease: "outQuad" });
    }
    if (!sheet.current) {
      onClose();
      return;
    }
    animate(sheet.current, {
      opacity: 0,
      y: 24,
      scale: 0.98,
      duration: 320,
      ease: "outQuad",
      onComplete: onClose,
    });
  }, [onClose]);

  useEffect(() => {
    closer.current?.focus();

    const restore = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rows = sheet.current?.querySelectorAll<HTMLElement>("[data-row]");

    if (still) {
      if (rows) utils.set(rows, { opacity: 1 });
      return () => {
        document.body.style.overflow = restore;
      };
    }

    if (backdrop.current) {
      animate(backdrop.current, {
        opacity: [0, 1],
        duration: 300,
        ease: "outQuad",
      });
    }

    const intro = createTimeline({ defaults: { ease: "outExpo" } });

    if (sheet.current) {
      intro.add(
        sheet.current,
        { opacity: [0, 1], y: [28, 0], scale: [0.97, 1], duration: 640 },
        0,
      );
    }
    if (portrait.current) {
      // The picture wipes up from its own bottom edge, then keeps easing in.
      intro
        .add(
          portrait.current,
          {
            clipPath: ["inset(100% 0 0 0)", "inset(0% 0 0 0)"],
            duration: 900,
          },
          120,
        )
        .add(
          portrait.current,
          { scale: [1.18, 1], duration: 2400, ease: "outQuint" },
          120,
        );
    }
    if (rows?.length) {
      intro.add(
        rows,
        {
          opacity: [0, 1],
          y: [18, 0],
          duration: 700,
          delay: stagger(55),
        },
        380,
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
      role="dialog"
      aria-modal="true"
      aria-label={speaker.name}
      className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-8"
    >
      <div
        ref={backdrop}
        onClick={dismiss}
        className="absolute inset-0 bg-[rgba(7,20,14,0.9)] backdrop-blur-sm"
      />

      <div
        ref={sheet}
        style={{ opacity: 0 }}
        className="relative flex max-h-full w-full max-w-[62rem] flex-col overflow-hidden rounded-2xl bg-cream shadow-[0_40px_90px_-40px_rgba(4,20,13,0.8)] sm:flex-row"
      >
        <div className="relative aspect-[4/3] flex-none overflow-hidden bg-pale/40 sm:aspect-auto sm:w-[38%]">
          {speaker.photo && (
            <Image
              ref={portrait}
              src={speaker.photo}
              alt={speaker.name}
              fill
              sizes="(min-width: 640px) 24rem, 100vw"
              className="object-cover object-top"
            />
          )}
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_top,rgba(11,46,31,0.55),transparent_52%)]"
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-6 sm:p-9">
          <div
            data-row
            className="font-sans text-[0.6875rem] font-semibold tracking-[0.14em] text-brand uppercase"
          >
            {speaker.role}
          </div>
          <h3
            data-row
            className="mt-2 font-display text-[clamp(1.25rem,2.4vw,1.75rem)] leading-[1.2] font-bold tracking-[-0.02em] text-pretty text-ink"
          >
            {speaker.name}
          </h3>

          {speaker.profile?.map((group) => (
            <section key={group.key} className="mt-7">
              <h4
                data-row
                className="font-sans text-[0.6875rem] font-semibold tracking-[0.14em] text-muted uppercase"
              >
                {labels[group.key]}
              </h4>
              <ul className="mt-3">
                {group.entries.map((entry) => (
                  <li
                    key={`${entry.label}${entry.note ?? ""}`}
                    data-row
                    className="border-t border-ink/10 py-2.5"
                  >
                    <div className="font-display text-[0.9375rem] leading-[1.45] font-semibold text-pretty text-ink">
                      {entry.label}
                    </div>
                    {entry.note && (
                      <div className="mt-0.5 font-sans text-[0.8125rem] leading-[1.5] text-muted">
                        {entry.note}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <button
          ref={closer}
          type="button"
          onClick={dismiss}
          aria-label={labels.close}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 bg-cream/90 text-ink backdrop-blur-sm transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden className="h-4 w-4">
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
