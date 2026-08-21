"use client";

import { animate } from "animejs";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import logo from "@/../public/iconz10-logo.png";

const SEEN = "iconz-splash";

/**
 * Longest anyone waits at the door. Set just past the opening clip so it can
 * finish, with the skip below for anyone who would rather not wait at all.
 * Re-time this whenever the clip is recut — it currently runs 5.0s.
 */
const HOLD = 5400;

/**
 * Whether this session has already had the screen. Read through a store
 * rather than an effect, so a repeat visit renders nothing at all instead of
 * mounting the screen and then taking it away again.
 */
const visited = {
  subscribe: () => () => {},
  getSnapshot: () => {
    try {
      return sessionStorage.getItem(SEEN) !== null;
    } catch {
      // Private windows and blocked storage: show it, just do not remember.
      return false;
    }
  },
  getServerSnapshot: () => false,
};

/**
 * The mark, held for a beat before the site itself. Shown once a session:
 * the first visit gets the whole reveal, and moving around the site after
 * that goes straight to the page.
 *
 * The screen is server-rendered so it is already painted when the browser
 * first draws — a splash mounted only after hydration would flash the page
 * behind it first. A blocking script in the layout removes it before paint
 * for anyone who has already seen it.
 */
export function Splash({ skipLabel }: { skipLabel: string }) {
  const screen = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const clip = useRef<HTMLVideoElement>(null);
  const skip = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);
  const seen = useSyncExternalStore(
    visited.subscribe,
    visited.getSnapshot,
    visited.getServerSnapshot,
  );

  useEffect(() => {
    if (seen) return;

    try {
      sessionStorage.setItem(SEEN, "1");
    } catch {
      // Nothing to remember it with; the screen simply shows again.
    }

    const stage = screen.current;
    const film = clip.current;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still) {
      const timer = setTimeout(() => setDone(true), 500);
      return () => clearTimeout(timer);
    }

    // The clip is cut twice, once for each shape of screen, and the source is
    // named here rather than in the markup so only the one that will actually
    // be watched is ever fetched. Chosen by the shape of the window rather than
    // its width, so a tablet held upright is treated as what it is.
    if (film) {
      const upright = window.matchMedia("(orientation: portrait)").matches;
      film.src = upright ? "/loader/openingmobile.mp4" : "/loader/opening.mp4";
    }

    document.body.style.overflow = "hidden";

    let closing = false;
    const leave = () => {
      if (closing) return;
      closing = true;

      if (!stage) {
        setDone(true);
        return;
      }
      animate(stage, {
        opacity: 0,
        duration: 520,
        ease: "outQuad",
        onComplete: () => setDone(true),
      });
    };

    // Each part runs on its own rather than off one timeline, so the mark can
    // be pulled out the moment the clip takes over without a tween further
    // along the line fading it straight back in.
    const parts: ReturnType<typeof animate>[] = [];

    const markIn = mark.current
      ? animate(mark.current, {
          opacity: [0, 1],
          scale: [0.92, 1],
          filter: ["blur(12px)", "blur(0px)"],
          duration: 800,
          delay: 80,
          ease: "outExpo",
        })
      : null;
    if (markIn) parts.push(markIn);

    if (bar.current) {
      parts.push(
        animate(bar.current, {
          scaleX: [0, 1],
          duration: HOLD,
          delay: 200,
          ease: "inOutQuad",
        }),
      );
    }

    if (skip.current) {
      parts.push(
        animate(skip.current, {
          opacity: [0, 1],
          duration: 500,
          delay: 1500,
          ease: "outExpo",
        }),
      );
    }

    // The clip carries the mark itself, so the still logo would only show it a
    // second time once frames are actually on screen. It bows out there and
    // stays put for a refused autoplay or a clip that never arrives.
    const takeOver = () => {
      markIn?.pause();
      if (mark.current) {
        animate(mark.current, { opacity: 0, duration: 420, ease: "outQuad" });
      }
    };
    film?.addEventListener("playing", takeOver, { once: true });

    // The clip is the star, but nobody should be held at the door: it ends
    // when the clip ends, when the cap runs out, or the moment anyone asks.
    const cap = setTimeout(leave, HOLD);
    film?.addEventListener("ended", leave);
    window.addEventListener("pointerdown", leave);
    window.addEventListener("keydown", leave);

    film?.play().catch(() => {
      // Autoplay refused, or no codec: the mark and the bar carry it alone.
    });

    return () => {
      document.body.style.overflow = "";
      clearTimeout(cap);
      film?.removeEventListener("ended", leave);
      film?.removeEventListener("playing", takeOver);
      window.removeEventListener("pointerdown", leave);
      window.removeEventListener("keydown", leave);
      for (const part of parts) part.revert();
    };
  }, [seen]);

  useEffect(() => {
    if (done) document.body.style.overflow = "";
  }, [done]);

  if (seen || done) return null;

  return (
    <div
      ref={screen}
      data-splash-screen
      aria-hidden
      className="fixed inset-0 z-200 flex flex-col items-center justify-center gap-8 bg-brand-deep"
    >
      {/* The clip is the screen once it plays; the mark holds the frame while
          it buffers, and is what is left if it never plays at all.

          Covered rather than contained, and with the source set above rather
          than here: each cut is close enough to the shape of the screen it is
          meant for that filling it trims edges rather than halves. */}
      <video
        ref={clip}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div ref={mark} className="relative px-8">
        <Image
          src={logo}
          alt=""
          priority
          className="h-11 w-auto brightness-0 invert sm:h-14"
        />
      </div>

      <span className="relative block h-px w-40 overflow-hidden bg-white/15">
        <span
          ref={bar}
          className="block h-full w-full origin-left scale-x-0 bg-mint"
        />
      </span>

      {/* A way out, offered a beat in rather than the moment it opens. */}
      <span
        ref={skip}
        style={{ opacity: 0 }}
        className="absolute right-5 bottom-5 font-sans text-[0.6875rem] font-semibold tracking-[0.18em] text-white/50 uppercase sm:right-7 sm:bottom-7"
      >
        {skipLabel}
      </span>
    </div>
  );
}

/** Runs before paint, so a repeat visit never flashes the screen. */
export const SPLASH_GUARD = `try{if(sessionStorage.getItem('${SEEN}'))document.documentElement.dataset.splash='seen'}catch(e){}`;
