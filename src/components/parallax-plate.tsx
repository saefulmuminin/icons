"use client";

import { animate, onScroll } from "animejs";
import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * A full-bleed photograph that drifts against the scroll. The picture sits in
 * a layer taller than its frame, so it can travel without ever exposing an
 * edge, and the travel is keyed to the section's own pass through the
 * viewport rather than to a timer.
 */
export function ParallaxPlate({ src }: { src: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = frame.current;
    const media = layer.current;
    if (!target || !media) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Default thresholds cover the whole pass: from the frame entering the
    // bottom of the viewport to its last pixel leaving the top.
    const drift = animate(media, {
      y: ["-7%", "7%"],
      ease: "linear",
      autoplay: onScroll({ target, sync: true }),
    });

    return () => {
      drift.revert();
    };
  }, []);

  return (
    <div ref={frame} aria-hidden className="absolute inset-0 overflow-hidden">
      <div ref={layer} className="absolute inset-x-0 -inset-y-[14%]">
        <Image
          src={src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
    </div>
  );
}
