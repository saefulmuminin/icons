"use client";

import { animate, stagger } from "animejs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Dict, Lang } from "@/lib/i18n";
import { localizedHref, NAV_ITEMS } from "@/lib/nav";
import { Flag } from "./flag";
import { Container, Cta } from "./ui";
import logo from "@/../public/iconz10-logo.png";
import baznas from "@/../public/baznas-logo.png";

export function SiteHeader({ lang, t }: { lang: Lang; t: Dict }) {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  // The panel outlives `open` by exactly the length of its closing animation.
  const [shown, setShown] = useState(false);

  const drawer = useRef<HTMLElement>(null);
  const topBar = useRef<HTMLSpanElement>(null);
  const lowBar = useRef<HTMLSpanElement>(null);

  // Landing anywhere new closes the menu — back and forward included. Adjusted
  // while rendering rather than from an effect, so the menu is already down in
  // the first frame of the new page instead of being taken away in the second.
  //
  // This used to remember which page the menu was opened on and call it open
  // only there, which quietly meant returning to that page opened it again by
  // itself: open the menu at home, walk to a page, click the mark to come back,
  // and the menu was waiting.
  const [seen, setSeen] = useState(pathname);
  if (seen !== pathname) {
    setSeen(pathname);
    setOpen(false);
  }

  // Into the DOM first; the animation below picks it up once it is there.
  if (open && !shown) setShown(true);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const panel = drawer.current;
    if (!panel) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = panel.querySelectorAll("[data-menu-item]");

    if (open) {
      // Measured before the height is taken away: `scrollHeight` reports what
      // the content wants even while the panel is clipped to nothing.
      const full = panel.scrollHeight;

      const runs = [
        animate(panel, {
          height: [0, full],
          opacity: [0, 1],
          duration: still ? 1 : 340,
          ease: "outQuad",
          // Handing the height back at the end keeps the panel honest if the
          // phone is turned while the menu is open.
          onComplete: () => {
            panel.style.height = "auto";
          },
        }),
        animate(items, {
          opacity: [0, 1],
          y: [-10, 0],
          duration: still ? 1 : 300,
          delay: stagger(40, { start: 90 }),
          ease: "outQuad",
        }),
      ];

      return () => {
        for (const run of runs) run.pause();
      };
    }

    const run = animate(panel, {
      height: [panel.scrollHeight, 0],
      opacity: [1, 0],
      duration: still ? 1 : 240,
      ease: "inQuad",
      onComplete: () => setShown(false),
    });

    return () => run.pause();
  }, [open, shown]);

  // The two rules fold into a cross and unfold back into a menu.
  useEffect(() => {
    const top = topBar.current;
    const low = lowBar.current;
    if (!top || !low) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = still ? 1 : 300;

    const runs = [
      animate(top, {
        y: open ? 3.5 : 0,
        rotate: open ? 45 : 0,
        duration,
        ease: "outBack",
      }),
      animate(low, {
        y: open ? -3.5 : 0,
        rotate: open ? -45 : 0,
        duration,
        ease: "outBack",
      }),
    ];

    return () => {
      for (const run of runs) run.pause();
    };
  }, [open]);

  const isActive = (path: string) =>
    pathname === localizedHref(lang, path) ||
    (path === "" && pathname === `/${lang}`);

  // The home hero runs edge to edge behind this bar, so the bar stays
  // invisible until the reader scrolls off it.
  const isHome = pathname === `/${lang}`;
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    if (!isHome) return;

    const onScroll = () => setAtTop(window.scrollY < 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const overlay = isHome && atTop && !open;

  // The toggle keeps the reader on the same page, in the other language.
  const otherLang: Lang = lang === "id" ? "en" : "id";
  const swapped = pathname.replace(/^\/[^/]+/, `/${otherLang}`);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        overlay
          ? "border-transparent bg-transparent"
          : "border-ink/10 bg-cream/92 backdrop-blur-md"
      }`}
    >
      <Container className="flex h-[var(--header-h)] items-center gap-4 lg:gap-7">
        {/* The two marks read as one lockup: the conference's own, then the
            board that convenes it, parted by a hairline. Only the conference
            mark links home — a logo bar where every mark is clickable leaves
            nobody sure what they just pressed. */}
        <div className="flex flex-none items-center gap-2.5 sm:gap-3.5">
          <Link
            href={localizedHref(lang, "")}
            className="flex items-center"
            aria-label={t.navHome}
          >
            <Image
              src={logo}
              alt="The 10th ICONZ"
              priority
              className={`h-8 w-auto transition sm:h-11 ${
                overlay ? "brightness-0 invert" : ""
              }`}
            />
          </Link>

          <span
            aria-hidden
            className={`h-7 w-px transition-colors sm:h-9 ${
              overlay ? "bg-white/25" : "bg-ink/15"
            }`}
          />

          {/* Set shorter than the wordmark beside it: an emblem given the same
              box always reads as the larger of the two. */}
          <Image
            src={baznas}
            alt="The National Board of Zakat"
            priority
            className={`h-7 w-auto transition sm:h-9 ${
              overlay ? "brightness-0 invert" : ""
            }`}
          />
        </div>

        <nav className="ml-auto hidden flex-wrap items-center gap-0.5 lg:flex">
          {NAV_ITEMS.map((item) => {
            const here = isActive(item.path);

            return (
              <Link
                key={item.key}
                href={localizedHref(lang, item.path)}
                aria-current={here ? "page" : undefined}
                className={`group relative px-3 py-2 font-display text-[0.8125rem] font-semibold whitespace-nowrap no-underline transition-colors ${
                  overlay
                    ? here
                      ? "text-white"
                      : "text-white/75 hover:text-white"
                    : here
                      ? "text-brand-dark"
                      : "text-nav hover:text-brand-dark"
                }`}
              >
                {t[item.key]}

                {/* A rule under the label rather than a filled pill: it marks
                    the page without boxing the word in, and grows from the
                    centre on hover. */}
                <span
                  aria-hidden
                  className={`absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full transition-transform duration-300 ${
                    overlay ? "bg-mint" : "bg-brand"
                  } ${
                    here
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100 group-hover:opacity-50"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex flex-none items-center gap-2.5 lg:ml-0">
          {/* Flag first, code second: on a phone the picture is what carries
              at a glance, and the two letters confirm it. */}
          <Link
            href={swapped}
            aria-label={t.langSwitchTo}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 font-sans text-xs font-semibold tracking-[0.06em] no-underline transition-colors sm:px-3 sm:py-2 ${
              overlay
                ? "border-white/35 text-white hover:border-white hover:bg-white/10"
                : "border-ink/18 text-ink hover:border-brand hover:text-brand"
            }`}
          >
            <Flag
              lang={otherLang}
              className="h-3 w-[1.125rem] sm:h-3.5 sm:w-5"
            />
            {t.langSwitch}
          </Link>

          <span className="hidden sm:inline-block">
            <Cta
              href={localizedHref(lang, "/register")}
              size="sm"
              variant={overlay ? "light" : "primary"}
            >
              {t.register}
            </Cta>
          </span>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t.closeMenu : t.menu}
            className={`flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-full border transition-colors lg:hidden ${
              overlay
                ? "border-white/35 hover:border-white"
                : "border-ink/18 hover:border-brand"
            }`}
          >
            <span
              ref={topBar}
              className={`block h-px w-4 ${overlay ? "bg-white" : "bg-ink"}`}
            />
            <span
              ref={lowBar}
              className={`block h-px w-4 ${overlay ? "bg-white" : "bg-ink"}`}
            />
          </button>
        </div>
      </Container>

      {shown && (
        <nav
          id="mobile-nav"
          ref={drawer}
          style={{ height: 0, opacity: 0 }}
          className="overflow-hidden border-t border-ink/10 bg-cream lg:hidden"
        >
          <Container className="flex flex-col gap-1 py-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                data-menu-item
                href={localizedHref(lang, item.path)}
                aria-current={isActive(item.path) ? "page" : undefined}
                className={`rounded-lg px-3 py-2.5 font-display text-[0.9375rem] font-semibold no-underline ${
                  isActive(item.path)
                    ? "bg-brand/12 text-brand-dark"
                    : "text-nav"
                }`}
              >
                {t[item.key]}
              </Link>
            ))}

            <div data-menu-item className="mt-2 sm:hidden">
              <Cta
                href={localizedHref(lang, "/register")}
                className="w-full text-center"
              >
                {t.register}
              </Cta>
            </div>
          </Container>
        </nav>
      )}
    </header>
  );
}
