"use client";

import Link from "next/link";
import { Container, Cta, Eyebrow, PageTitle } from "@/components/ui";
import { getDictionary } from "@/lib/i18n";
import { localizedHref, NAV_ITEMS } from "@/lib/nav";
import { useRouteLang } from "@/lib/use-route-lang";

/**
 * A page asked for by name that the site does not hold.
 *
 * This one sits inside the layout, so it keeps the bar and the footer and
 * reads as part of the site rather than a dead end. Unmatched addresses that
 * never reach a language — `/anything` — land on `global-not-found.tsx`
 * instead, which has to build its own document.
 */
export default function NotFound() {
  const lang = useRouteLang();
  const t = getDictionary(lang);

  // Home already has its own button below, so the list is everywhere else.
  const elsewhere = NAV_ITEMS.filter((item) => item.path !== "");

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center sm:py-32">
      <Eyebrow>{t.notFoundCode}</Eyebrow>
      <PageTitle className="max-w-2xl text-ink">{t.notFoundTitle}</PageTitle>

      <p className="mt-5 max-w-xl font-sans text-[0.9375rem] leading-relaxed text-body">
        {t.notFoundText}
      </p>

      <div className="mt-9">
        <Cta href={localizedHref(lang, "")} size="lg">
          {t.notFoundHome}
        </Cta>
      </div>

      <div className="mt-14 w-full max-w-2xl border-t border-ink/10 pt-9">
        <Eyebrow tone="muted">{t.notFoundElse}</Eyebrow>

        <ul className="mt-5 flex flex-wrap justify-center gap-x-7 gap-y-3">
          {[...elsewhere, { path: "/register", key: "register" as const }].map(
            (item) => (
              <li key={item.path}>
                <Link
                  href={localizedHref(lang, item.path)}
                  className="font-sans text-sm font-medium text-nav underline-offset-4 transition-colors hover:text-brand hover:underline"
                >
                  {t[item.key]}
                </Link>
              </li>
            ),
          )}
        </ul>
      </div>
    </Container>
  );
}
