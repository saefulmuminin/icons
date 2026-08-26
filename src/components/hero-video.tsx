"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { stillness } from "@/lib/motion";
import { HeroStinger } from "./hero-stinger";

const EMBED_ORIGIN = "https://www.youtube-nocookie.com";

/** Seconds of the reel handed over to the closing logo card. */
const OUTRO_LEAD = 6;

function post(frame: HTMLIFrameElement | null, message: object) {
  frame?.contentWindow?.postMessage(JSON.stringify(message), EMBED_ORIGIN);
}

function command(
  frame: HTMLIFrameElement | null,
  func: "playVideo" | "pauseVideo" | "mute" | "unMute" | "setVolume",
  args: unknown[] = [],
) {
  post(frame, { event: "command", func, args });
}

/** Player flags for a silent, chrome-less, endlessly looping backdrop. */
function embedSrc(id: string) {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    // A lone video loops only when it is also its own playlist.
    loop: "1",
    playlist: id,
    controls: "0",
    playsinline: "1",
    modestbranding: "1",
    rel: "0",
    fs: "0",
    disablekb: "1",
    iv_load_policy: "3",
    cc_load_policy: "0",
    enablejsapi: "1",
    origin: window.location.origin,
  });

  return `${EMBED_ORIGIN}/embed/${id}?${params}`;
}

export function HeroVideo({
  videoId,
  title,
  soundOnLabel,
  soundOffLabel,
  comingSoonLabel,
}: {
  videoId: string;
  title: string;
  soundOnLabel: string;
  soundOffLabel: string;
  comingSoonLabel: string;
}) {
  const backdrop = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const length = useRef(0);
  const [ready, setReady] = useState(false);
  /**
   * Whether the player is allowed to exist yet.
   *
   * The embed costs the better part of a megabyte and half a second of main
   * thread before it shows a single frame — spent, on a first visit, entirely
   * behind the splash screen. Held back until the browser is idle it lands
   * after the page has painted rather than in front of it, and the wash below
   * carries the hero in the meantime, exactly as it already does while the
   * player boots.
   */
  const [booted, setBooted] = useState(false);
  const [sound, setSound] = useState(false);
  const [outro, setOutro] = useState(false);

  const still = useSyncExternalStore(
    stillness.subscribe,
    stillness.getSnapshot,
    stillness.getServerSnapshot,
  );

  // The player reports its position once asked to; that is what tells the
  // closing logo card when the reel is about to run out.
  useEffect(() => {
    if (still) return;

    // Safari has no requestIdleCallback; a beat after paint is close enough.
    const lazy = "requestIdleCallback" in window;

    const handle = lazy
      ? window.requestIdleCallback(() => setBooted(true), { timeout: 3000 })
      : window.setTimeout(() => setBooted(true), 1200);

    return () => {
      if (lazy) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, [still]);

  useEffect(() => {
    if (still) return;

    function handle(event: MessageEvent) {
      if (event.origin !== EMBED_ORIGIN) return;
      if (event.source !== frame.current?.contentWindow) return;

      let payload: { info?: { currentTime?: number; duration?: number } };
      try {
        payload =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      } catch {
        return;
      }

      const info = payload?.info;
      if (!info) return;

      if (typeof info.duration === "number" && info.duration > 0) {
        length.current = info.duration;
      }
      if (typeof info.currentTime !== "number") return;

      const total = length.current;
      setOutro(
        total > OUTRO_LEAD * 2 && total - info.currentTime <= OUTRO_LEAD,
      );
    }

    window.addEventListener("message", handle);
    return () => window.removeEventListener("message", handle);
  }, [still]);

  // Scrolling past the hero parks the player, so the rest of the page is not
  // read over a video decoding — and possibly talking — out of sight.
  useEffect(() => {
    const node = backdrop.current;
    if (still || !node) return;

    const observer = new IntersectionObserver(([entry]) =>
      command(frame.current, entry.isIntersecting ? "playVideo" : "pauseVideo"),
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [still]);

  // Browsers autoplay a video only while it is muted, so sound waits here for
  // the reader to ask for it.
  function toggleSound() {
    const next = !sound;

    if (next) {
      command(frame.current, "setVolume", [40]);
      command(frame.current, "unMute");
    } else {
      command(frame.current, "mute");
    }

    setSound(next);
  }

  return (
    <>
      <div
        ref={backdrop}
        aria-hidden
        className="absolute inset-0 overflow-hidden"
      >
        {/* Media layer, taller than the box so it can drift under the
            scrims without ever exposing an edge. */}
        <div data-hero-media className="absolute inset-x-0 -inset-y-[12%]">
          {/* Base wash — the poster while the player boots, and the whole
              backdrop for readers who keep motion switched off. */}
          <div className="absolute inset-0 bg-[linear-gradient(178deg,var(--color-brand-deep)_0%,var(--color-brand-mid)_58%,var(--color-brand-shade)_100%)]" />
          <div className="absolute inset-0 opacity-[0.14] bg-[radial-gradient(circle_at_18%_22%,var(--color-mint)_0,transparent_42%),radial-gradient(circle_at_82%_78%,var(--color-brand-bright)_0,transparent_45%)]" />

          {!still && booted && (
            // Size containment lets the 16:9 frame cover the box exactly.
            <div className="absolute inset-0 [container-type:size]">
              <iframe
                ref={frame}
                src={embedSrc(videoId)}
                title={title}
                tabIndex={-1}
                allow="autoplay; encrypted-media"
                referrerPolicy="strict-origin-when-cross-origin"
                onLoad={() => {
                  setReady(true);
                  post(frame.current, {
                    event: "listening",
                    id: 1,
                    channel: "widget",
                  });
                }}
                className={`pointer-events-none absolute top-1/2 left-1/2 h-[56.25cqw] min-h-full w-[177.78cqh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0 transition-opacity delay-500 duration-1000 ${
                  ready ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          )}
        </div>

        {/* Scrims: keep the type legible while the footage still reads. */}
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(7,33,22,0.82)_0%,rgba(7,33,22,0.55)_34%,rgba(7,33,22,0.24)_68%,rgba(7,33,22,0.34)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(7,33,22,0.58)_0%,rgba(7,33,22,0.08)_30%,rgba(7,33,22,0)_46%),linear-gradient(to_bottom,rgba(7,33,22,0.62)_0%,rgba(7,33,22,0)_20%)]" />
        {/* Fine grain, so the compressed footage does not band. */}
        <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(rgba(255,255,255,0.35)_0.5px,transparent_0.5px)] [background-size:3px_3px]" />
      </div>

      {!still && <HeroStinger active={outro} label={comingSoonLabel} />}

      {!still && (
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={sound}
          aria-label={sound ? soundOffLabel : soundOnLabel}
          className="absolute top-[calc(var(--header-h)+0.875rem)] right-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-colors hover:border-white/60 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-7"
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden className="h-4 w-4">
            <path
              fill="currentColor"
              d="M3.2 6.1h2.3L8.8 3.2v9.6L5.5 9.9H3.2z"
            />
            {sound ? (
              <>
                <path
                  d="M11 5.6a3.4 3.4 0 0 1 0 4.8"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
                <path
                  d="M12.9 3.8a6 6 0 0 1 0 8.4"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </>
            ) : (
              <path
                d="m11 6 3.4 4M14.4 6 11 10"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      )}
    </>
  );
}
