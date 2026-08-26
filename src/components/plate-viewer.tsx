"use client";

import { animate, createTimeline, utils } from "animejs";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A picture that opens. Clicking it lifts a full-height view out of the page:
 * the backdrop fades, the plate rises from a blur, and the whole thing plays
 * back out before it is taken down again.
 */
export function PlateViewer({
  src,
  ratio,
  sizes,
  zoomLabel,
  closeLabel,
  className = "",
  style,
}: {
  src: string;
  ratio: string;
  sizes: string;
  zoomLabel: string;
  closeLabel: string;
  className?: string;
  /** For a frame whose shape is only known once the picture is measured. */
  style?: React.CSSProperties;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={zoomLabel}
        style={style}
        className={`group relative block cursor-zoom-in overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${className}`}
      >
        <Image
          src={src}
          alt=""
          fill
          sizes={sizes}
          className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
        />

        <span className="pointer-events-none absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden className="h-4 w-4">
            <circle
              cx="7"
              cy="7"
              r="4.6"
              stroke="currentColor"
              strokeWidth="1.3"
            />
            <path
              d="M10.4 10.4 14 14M7 5.1v3.8M5.1 7h3.8"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>

      {open && (
        <Lightbox
          src={src}
          ratio={ratio}
          closeLabel={closeLabel}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

/**
 * The same picture frame, cycling through several plates. It advances on its
 * own, holds while the pointer is over it, and opens whichever plate is
 * showing when clicked.
 */
export function PlateCarousel({
  plates,
  sizes,
  zoomLabel,
  closeLabel,
  className = "",
}: {
  plates: { src: string; width: number; height: number }[];
  sizes: string;
  zoomLabel: string;
  closeLabel: string;
  className?: string;
}) {
  const frames = useRef<(HTMLSpanElement | null)[]>([]);
  const [at, setAt] = useState(0);
  const [held, setHeld] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (plates.length < 2 || held || open) return;

    const timer = setInterval(
      () => setAt((current) => (current + 1) % plates.length),
      5200,
    );

    return () => clearInterval(timer);
  }, [plates.length, held, open]);

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    frames.current.forEach((frame, i) => {
      if (!frame) return;

      const showing = i === at;
      if (still) {
        utils.set(frame, { opacity: showing ? 1 : 0 });
        return;
      }

      animate(frame, {
        opacity: showing ? 1 : 0,
        scale: showing ? 1 : 1.04,
        duration: 900,
        ease: "outQuad",
      });
    });
  }, [at]);

  return (
    <>
      <div
        onPointerEnter={() => setHeld(true)}
        onPointerLeave={() => setHeld(false)}
        // The frame takes the shape of whichever plate is showing, and eases
        // between shapes as they change — so nothing is ever cropped to fit.
        style={{
          aspectRatio: `${plates[at].width} / ${plates[at].height}`,
        }}
        className={`group relative overflow-hidden transition-[aspect-ratio] duration-700 ease-out ${className}`}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={zoomLabel}
          className="absolute inset-0 block cursor-zoom-in focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
        >
          {plates.map((plate, i) => (
            <span
              key={plate.src}
              ref={(el) => {
                frames.current[i] = el;
              }}
              style={{ opacity: i === 0 ? 1 : 0 }}
              className="absolute inset-0 block"
            >
              <Image
                src={plate.src}
                alt=""
                fill
                priority={i === 0}
                sizes={sizes}
                className="object-contain object-center"
              />
            </span>
          ))}
        </button>

        {plates.length > 1 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center gap-1.5 bg-[linear-gradient(to_top,rgba(4,20,13,0.55),transparent)] px-4 pt-8 pb-4">
            {plates.map((plate, i) => (
              <button
                key={plate.src}
                type="button"
                onClick={() => setAt(i)}
                aria-label={`${i + 1}`}
                aria-current={i === at}
                className={`pointer-events-auto h-1.5 rounded-full transition-all duration-500 ${
                  i === at
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {open && (
        <Lightbox
          src={plates[at].src}
          ratio={`${plates[at].width} / ${plates[at].height}`}
          closeLabel={closeLabel}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

function Lightbox({
  src,
  ratio,
  closeLabel,
  onClose,
}: {
  src: string;
  ratio: string;
  closeLabel: string;
  onClose: () => void;
}) {
  const backdrop = useRef<HTMLDivElement>(null);
  const figure = useRef<HTMLDivElement>(null);
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
      animate(backdrop.current, { opacity: 0, duration: 300, ease: "outQuad" });
    }
    if (!figure.current) {
      onClose();
      return;
    }
    animate(figure.current, {
      opacity: 0,
      scale: 0.95,
      filter: "blur(10px)",
      duration: 320,
      ease: "outQuad",
      onComplete: onClose,
    });
  }, [onClose]);

  useEffect(() => {
    closer.current?.focus();

    const restore = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => {
        document.body.style.overflow = restore;
      };
    }

    const intro = createTimeline({ defaults: { ease: "outExpo" } });

    if (backdrop.current) {
      intro.add(
        backdrop.current,
        { opacity: [0, 1], duration: 320, ease: "outQuad" },
        0,
      );
    }
    if (figure.current) {
      intro.add(
        figure.current,
        {
          opacity: [0, 1],
          scale: [0.94, 1],
          filter: ["blur(12px)", "blur(0px)"],
          duration: 680,
        },
        60,
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
      aria-label={closeLabel}
      className="fixed inset-0 z-100 flex items-center justify-center p-5 sm:p-10"
    >
      <div
        ref={backdrop}
        onClick={dismiss}
        className="absolute inset-0 bg-[rgba(7,20,14,0.9)] backdrop-blur-sm"
      />

      <div
        ref={figure}
        style={{ opacity: 0, aspectRatio: ratio }}
        className="relative h-[min(86vh,60rem)] max-w-full"
      >
        <Image
          src={src}
          alt=""
          fill
          sizes="(min-width: 768px) 44vh, 90vw"
          className="object-contain"
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
