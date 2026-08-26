"use client";

import { animate, utils } from "animejs";
import { useEffect, useRef, useState } from "react";

export type Jump = { href: string; label: string };

/**
 * A table of contents that stays out of the way until it is asked for.
 *
 * It began as a row of chips under the facts band, which put a second palisade
 * across the top of a page that already opens on a film. As a button it costs
 * the page nothing until someone wants it — and it is still there at the foot
 * of a long scroll, where a row pinned to the top would have been long gone.
 *
 * Sits above the "back to top" button and keeps its distance whether that one
 * is showing or not, so neither ever moves under a thumb mid-reach.
 */
export function SectionJump({
  label,
  items,
}: {
  label: string;
  items: Jump[];
}) {
  const panel = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const node = panel.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      utils.set(node, { opacity: open ? 1 : 0 });
      return;
    }

    animate(node, {
      opacity: open ? 1 : 0,
      scale: open ? 1 : 0.94,
      y: open ? 0 : 10,
      duration: 320,
      ease: open ? "outBack" : "outQuad",
    });
  }, [open]);

  return (
    <>
      {/* Anywhere else on the page shuts it again. */}
      {open ? (
        <button
          type="button"
          tabIndex={-1}
          aria-hidden
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 cursor-default"
        />
      ) : null}

      <div className="fixed right-5 bottom-[4.75rem] z-50 sm:right-7 sm:bottom-[5.75rem]">
        <nav
          ref={panel}
          aria-label={label}
          aria-hidden={!open}
          style={{ opacity: 0 }}
          className={`absolute right-0 bottom-full mb-3 w-60 origin-bottom-right rounded-2xl border border-ink/10 bg-paper p-2 shadow-[0_24px_50px_-20px_rgba(4,20,13,0.45)] ${
            open ? "" : "pointer-events-none"
          }`}
        >
          <p className="px-3 pt-2 pb-1.5 font-sans text-[0.625rem] font-semibold tracking-[0.16em] text-faint uppercase">
            {label}
          </p>

          <ul>
            {items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2.5 font-sans text-[0.875rem] font-semibold text-nav no-underline transition-colors hover:bg-sage hover:text-brand-dark"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={label}
          className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-brand-deep text-white shadow-[0_12px_30px_-12px_rgba(4,20,13,0.7)] transition-colors hover:bg-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden
            className="h-4 w-4"
          >
            {open ? (
              <path d="M4 4l8 8M12 4l-8 8" />
            ) : (
              <>
                <path d="M6 4.5h6.5M6 8h6.5M6 11.5h6.5" />
                <circle cx="3.4" cy="4.5" r="0.9" fill="currentColor" stroke="none" />
                <circle cx="3.4" cy="8" r="0.9" fill="currentColor" stroke="none" />
                <circle cx="3.4" cy="11.5" r="0.9" fill="currentColor" stroke="none" />
              </>
            )}
          </svg>
        </button>
      </div>
    </>
  );
}
