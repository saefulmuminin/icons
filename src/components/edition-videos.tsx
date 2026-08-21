"use client";

import { animate, createTimeline } from "animejs";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Edition } from "@/lib/content";

export type EditionPlate = Edition & { mark: string | null; ordinal: string };

const EMBED_ORIGIN = "https://www.youtube-nocookie.com";

/** Pulls the id out of a watch, live or short YouTube link. */
function videoId(href: string) {
  const match = href.match(
    /(?:youtu\.be\/|\/live\/|\/embed\/|[?&]v=)([\w-]{11})/,
  );

  return match ? match[1] : null;
}

type Playing = { id: string; label: string };

/**
 * The archive of past editions. Recordings open in a player over the page
 * rather than sending the reader off to YouTube, so the archive is browsed
 * without ever leaving the site.
 */
export function EditionVideos({
  editions,
  noArchiveLabel,
  closeLabel,
}: {
  editions: EditionPlate[];
  noArchiveLabel: string;
  closeLabel: string;
}) {
  const [playing, setPlaying] = useState<Playing | null>(null);

  return (
    <>
      <ol className="grid gap-4 md:grid-cols-2">
        {editions.map((edition) => (
          <li
            key={edition.year}
            data-reveal
            className="flex flex-col rounded-2xl border border-ink/10 bg-paper p-6 transition-colors duration-300 hover:border-brand/30"
          >
            <div className="flex items-start gap-4">
              {edition.mark ? (
                <Image
                  src={edition.mark}
                  alt=""
                  width={120}
                  height={120}
                  className="h-12 w-12 flex-none object-contain"
                />
              ) : (
                // No mark on file for this edition — its ordinal stands in,
                // set the way the conference sets its own.
                <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl border border-brand/20 bg-brand/6 font-display text-[0.9375rem] font-extrabold tracking-[-0.02em] text-brand">
                  {edition.ordinal}
                </span>
              )}

              <div>
                <span className="font-display text-[0.6875rem] font-semibold tracking-[0.18em] text-brand uppercase">
                  {edition.year}
                </span>
                <h2
                  lang="en"
                  className="mt-1.5 font-display text-[1.0625rem] leading-[1.35] font-semibold text-pretty text-ink"
                >
                  {edition.title}
                </h2>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {edition.links.map((link) => {
                const id = videoId(link.href);

                // Anything that is not a recording stays an ordinary link out.
                if (!id) {
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-brand/28 bg-brand/6 px-3.5 py-2 font-sans text-[0.8125rem] font-semibold text-brand no-underline transition-colors hover:border-brand hover:bg-brand hover:text-white"
                    >
                      {link.label}
                    </a>
                  );
                }

                return (
                  <button
                    key={link.href}
                    type="button"
                    onClick={() => setPlaying({ id, label: link.label })}
                    className="flex cursor-pointer items-center gap-2 rounded-full border border-brand/28 bg-brand/6 px-3.5 py-2 font-sans text-[0.8125rem] font-semibold text-brand transition-colors hover:border-brand hover:bg-brand hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    <svg
                      viewBox="0 0 12 12"
                      aria-hidden
                      className="h-2.5 w-2.5 flex-none"
                    >
                      <path fill="currentColor" d="M3 1.6 10 6l-7 4.4z" />
                    </svg>
                    {link.label}
                  </button>
                );
              })}

              {edition.links.length === 0 && (
                <span className="py-2 font-sans text-[0.8125rem] text-faint">
                  {noArchiveLabel}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>

      {playing && (
        <Player
          playing={playing}
          closeLabel={closeLabel}
          onClose={() => setPlaying(null)}
        />
      )}
    </>
  );
}

function Player({
  playing,
  closeLabel,
  onClose,
}: {
  playing: Playing;
  closeLabel: string;
  onClose: () => void;
}) {
  const backdrop = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
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
    if (!stage.current) {
      onClose();
      return;
    }
    animate(stage.current, {
      opacity: 0,
      scale: 0.96,
      duration: 300,
      ease: "outQuad",
      onComplete: onClose,
    });
  }, [onClose]);

  useEffect(() => {
    closer.current?.focus();

    const restore = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const intro = createTimeline({ defaults: { ease: "outExpo" } });

      if (backdrop.current) {
        intro.add(
          backdrop.current,
          { opacity: [0, 1], duration: 300, ease: "outQuad" },
          0,
        );
      }
      if (stage.current) {
        intro.add(
          stage.current,
          { opacity: [0, 1], scale: [0.95, 1], y: [18, 0], duration: 600 },
          60,
        );
      }
    }

    return () => {
      document.body.style.overflow = restore;
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
      aria-label={playing.label}
      className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-8"
    >
      <div
        ref={backdrop}
        onClick={dismiss}
        className="absolute inset-0 bg-[rgba(7,20,14,0.92)] backdrop-blur-sm"
      />

      <div
        ref={stage}
        style={{ opacity: 0 }}
        className="relative aspect-video w-full max-w-[68rem] overflow-hidden rounded-xl bg-black shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)]"
      >
        <iframe
          src={`${EMBED_ORIGIN}/embed/${playing.id}?autoplay=1&rel=0&modestbranding=1`}
          title={playing.label}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>

      <button
        ref={closer}
        type="button"
        onClick={dismiss}
        aria-label={closeLabel}
        className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
  );
}
