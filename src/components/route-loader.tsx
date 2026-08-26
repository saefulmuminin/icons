"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import logo from "@/../public/iconz10-logo.png";

/**
 * Shortest the screen stays up. Every route here is static and prefetched, so
 * the hop itself costs no time at all — without a floor the screen would be a
 * flicker rather than a beat.
 */
const FLOOR = 1200;

/**
 * Longest it stays up when something never settles, so a picture that fails to
 * arrive can never leave the site sitting behind a curtain.
 */
const CEILING = 8000;

const wait = (ms: number) => new Promise((done) => setTimeout(done, ms));

/**
 * The pictures the visitor is about to look at: whatever sits on screen, plus a
 * quarter screen either side. Waiting on the whole document would mean waiting
 * on lazy pictures far below the fold that have not even been asked for yet.
 */
function inView() {
  const margin = window.innerHeight * 0.25;

  return [...document.images].filter((img) => {
    if (img.complete) return false;

    const box = img.getBoundingClientRect();
    return box.top < window.innerHeight + margin && box.bottom > -margin;
  });
}

/**
 * The screen between pages, held until the next one is actually ready to look
 * at rather than merely mounted.
 *
 * Next's own `loading.tsx` covers the wait for a route's data, which on a site
 * built entirely of static pages is no wait at all — every route is prefetched
 * the moment its link comes into view, so the fallback never gets a frame. What
 * is left to wait for is the artwork, and that is what this watches.
 */
export function RouteLoader({ label }: { label: string }) {
  const pathname = usePathname();
  const [active, setActive] = useState(false);

  // The route the current wait started from: null when nothing is in flight,
  // and what tells the settle below that the new page has actually landed.
  const from = useRef<string | null>(null);
  const since = useRef(0);

  useEffect(() => {
    const start = () => {
      if (from.current !== null) return;

      from.current = pathname;
      since.current = Date.now();
      setActive(true);
    };

    // Caught on the way down, before Next takes the click: a prefetched route
    // swaps so fast that waiting for the render would show the new page first
    // and the screen second.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const hit = event.target;
      if (!(hit instanceof Element)) return;

      const link = hit.closest("a");
      if (!(link instanceof HTMLAnchorElement)) return;
      if (link.hasAttribute("download")) return;
      if (link.target && link.target !== "_self") return;

      const url = new URL(link.href, window.location.href);
      // Another site, or the same page under a different hash: no page to wait
      // for either way.
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;

      start();
    };

    // Back and forward, but not a jump to a fragment: landing on `#key-dates`
    // traverses history without changing the page, and the browser reports it
    // here the same way it reports a real move. Starting on one of those puts
    // the screen up over a page that was never going anywhere, and nothing
    // below can take it down again — the pathname it is waiting on never
    // changes. So the address is asked where it actually went.
    const onPop = () => {
      if (window.location.pathname === pathname) return;
      start();
    };

    document.addEventListener("click", onClick, { capture: true });
    window.addEventListener("popstate", onPop);

    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("popstate", onPop);
    };
  }, [pathname]);

  // Down when the new page is ready, and down regardless once the ceiling is
  // reached — a click that never turns into a navigation ends here too.
  useEffect(() => {
    if (!active) return;

    const bail = setTimeout(() => {
      from.current = null;
      setActive(false);
    }, CEILING);

    return () => clearTimeout(bail);
  }, [active]);

  useEffect(() => {
    if (!active || from.current === null || pathname === from.current) return;

    let live = true;

    const settle = async () => {
      // One frame, so the page being measured is the one now on screen.
      await new Promise(requestAnimationFrame);

      const spent = () => Date.now() - since.current;

      await Promise.race([
        Promise.all([
          ...inView().map((img) => img.decode().catch(() => {})),
          document.fonts?.ready,
        ]),
        wait(Math.max(0, CEILING - spent())),
      ]);

      const left = FLOOR - spent();
      if (left > 0) await wait(left);
      if (!live) return;

      from.current = null;
      setActive(false);
    };

    settle();

    return () => {
      live = false;
    };
  }, [active, pathname]);

  useEffect(() => {
    if (!active) return;

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  // Always mounted and merely hidden, so it can fade both ways and its mark is
  // already decoded by the time it is called for.
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy={active}
      className={`fixed inset-0 z-150 flex flex-col items-center justify-center gap-6 bg-cream transition-opacity duration-300 ${
        active ? "opacity-100" : "invisible opacity-0"
      }`}
    >
      <Image
        src={logo}
        alt=""
        priority
        className="h-9 w-auto animate-pulse motion-reduce:animate-none sm:h-11"
      />

      <span className="block h-px w-32 overflow-hidden bg-ink/10">
        <span className="block h-full w-1/3 animate-sweep bg-brand motion-reduce:w-full motion-reduce:animate-none" />
      </span>

      <span className="sr-only">{active ? label : ""}</span>
    </div>
  );
}
