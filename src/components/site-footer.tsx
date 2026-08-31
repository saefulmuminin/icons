import { CalendarGlyph, PinGlyph } from "./glyphs";
import Image from "next/image";
import Link from "next/link";
import { CONFERENCE, ORGANIZERS } from "@/lib/content";
import type { Dict, Lang } from "@/lib/i18n";
import { markFor } from "@/lib/marks";
import { localizedHref, NAV_ITEMS } from "@/lib/nav";
import { ConferenceName, Container, Cta } from "./ui";

/** The edition's own year, rather than a number that quietly goes stale. */
const YEAR = new Date(CONFERENCE.startsAt).getFullYear();

export function SiteFooter({ lang, t }: { lang: Lang; t: Dict }) {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/15 bg-gradient-to-b from-brand-night via-brand-deep to-brand-ink text-white/80">
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-mint/10 blur-3xl"
      />

      <Container className="relative grid gap-12 py-14 sm:py-18 lg:grid-cols-12 lg:gap-10">
        {/* The conference, and the two things a reader is most likely here for. */}
        <div className="lg:col-span-5">
          <Image
            src="/iconz10-logo.png"
            alt="The 10th ICONZ"
            width={140}
            height={44}
            className="h-9 w-auto brightness-0 invert"
          />

          <div className="mt-6 font-display text-[1.375rem] leading-[1.25] font-extrabold tracking-tight text-white">
            <ConferenceName />
          </div>

          <dl className="mt-5 space-y-3 font-sans text-[0.9375rem] leading-[1.6]">
            <div className="flex items-start gap-2.5">
              <dt className="sr-only">{t.dateOnly}</dt>
              <CalendarGlyph className="mt-[0.1875rem] h-4 w-4 text-mint" />
              <dd className="font-medium text-mint-soft">
                {CONFERENCE.dateRange}
              </dd>
            </div>
            <div className="flex items-start gap-2.5">
              <dt className="sr-only">{t.venueLabel}</dt>
              <PinGlyph className="mt-[0.1875rem] h-4 w-4 text-mint" />
              <dd className="max-w-[46ch] text-white/75">{CONFERENCE.venue}</dd>
            </div>
          </dl>

          <div className="mt-7 flex flex-wrap gap-3">
            <Cta
              href={localizedHref(lang, "/register")}
              variant="light"
              size="sm"
            >
              {t.register}
            </Cta>
            <Cta
              href={localizedHref(lang, "/call-for-paper")}
              variant="ghost"
              size="sm"
            >
              {t.heroCta2}
            </Cta>
          </div>
        </div>

        <nav className="lg:col-span-3">
          <h2 className="font-sans text-xs font-semibold tracking-[0.14em] text-white/50 uppercase">
            {t.menu}
          </h2>
          <ul className="mt-4 flex flex-col gap-2.5">
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link
                  href={localizedHref(lang, item.path)}
                  className="font-sans text-[0.9375rem] text-white/75 no-underline transition-colors hover:text-mint"
                >
                  {t[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* One plate for all three marks, split by hairlines — the same lockup
            the organizers get in section 05. */}
        <div className="lg:col-span-4">
          <h2 className="font-sans text-xs font-semibold tracking-[0.14em] text-white/50 uppercase">
            {t.orgLabel}
          </h2>

          <ul className="mt-4 grid grid-cols-3 divide-x divide-ink/10 overflow-hidden rounded-xl bg-white">
            {ORGANIZERS.map((organizer) => {
              const mark = markFor(organizer);

              return (
                <li
                  key={organizer}
                  title={organizer}
                  className="flex items-center justify-center px-3 py-5"
                >
                  {mark ? (
                    <Image
                      src={mark}
                      alt={organizer}
                      width={120}
                      height={120}
                      className="h-11 w-auto object-contain"
                    />
                  ) : (
                    <span className="text-center font-sans text-[0.6875rem] leading-tight font-semibold text-ink">
                      {organizer}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/12 bg-black/30 backdrop-blur-md">
        <Container className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-5 font-sans text-[0.8125rem] text-white/60">
          <span>{t.footOrg}</span>
          <span>© {YEAR} The 10th ICONZ</span>
        </Container>
      </div>
    </footer>
  );
}
