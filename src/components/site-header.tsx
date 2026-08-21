"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Dict, Lang } from "@/lib/i18n";
import { localizedHref, NAV_ITEMS } from "@/lib/nav";
import { Container, Cta } from "./ui";
import logo from "@/../public/iconz10-logo.png";

export function SiteHeader({ lang, t }: { lang: Lang; t: Dict }) {
  const pathname = usePathname();

  // The menu is open only for the page it was opened on, so navigating
  // anywhere — including via back/forward — closes it without an effect.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;

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
        <Link
          href={localizedHref(lang, "")}
          className="flex flex-none items-center"
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
          <Link
            href={swapped}
            className={`rounded-full border px-3 py-2 font-sans text-xs font-semibold tracking-[0.06em] no-underline transition-colors ${
              overlay
                ? "border-white/35 text-white hover:border-white hover:bg-white/10"
                : "border-ink/18 text-ink hover:border-brand hover:text-brand"
            }`}
          >
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
            onClick={() => setOpenFor(open ? null : pathname)}
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
              className={`block h-px w-4 transition-transform ${
                overlay ? "bg-white" : "bg-ink"
              } ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
            />
            <span
              className={`block h-px w-4 transition-transform ${
                overlay ? "bg-white" : "bg-ink"
              } ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </Container>

      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-ink/10 bg-cream lg:hidden"
        >
          <Container className="flex flex-col gap-1 py-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
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
            <div className="mt-2 sm:hidden">
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
