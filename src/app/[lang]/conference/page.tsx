import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ParallaxPlate } from "@/components/parallax-plate";
import { PlateCarousel } from "@/components/plate-viewer";
import { Reveal } from "@/components/reveal";
import {
  Container,
  Cta,
  Eyebrow,
  PageTitle,
  SectionTitle,
} from "@/components/ui";
import {
  CONFERENCE,
  CONFERENCE_LINKS,
  getParticipants,
  SUB_EVENTS,
} from "@/lib/content";
import { getDictionary, isLang } from "@/lib/i18n";
import { localizedHref } from "@/lib/nav";
import { pageMetadata } from "@/lib/seo";
import { readPlates } from "@/lib/plates";

/**
 * Posters from the editions before this one, cycling beside the masthead.
 * Their shapes differ — 9:16 through to square — and the frame takes each
 * one's own ratio rather than cropping them to a common box.
 */
const PLATES = [
  "/image/bglatarbelakang.png",
  "/image/iconz-9-2025.png",
  "/image/road-to-iconz-9-2025.png",
  "/image/iconz-7-2023.png",
];

/**
 * A muted tone per sub-event — enough to tell the cards apart, quiet enough
 * that four of them side by side still read as one set.
 */
const ACCENTS = ["#6f9c86", "#a08a5e", "#7b8fa6", "#84956b"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const safe = isLang(lang) ? lang : "en";
  const t = getDictionary(safe);

  return pageMetadata({
    lang: safe,
    path: "/conference",
    title: t.navConference,
    description: t.confTitle,
  });
}

export default async function ConferencePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const t = getDictionary(lang);
  const participants = getParticipants(lang);

  const summary = [
    {
      label: t.dateOnly,
      value: CONFERENCE.dateRange,
      href: CONFERENCE_LINKS.calendar,
      cta: t.calendarCta,
    },
    {
      label: t.venueLabel,
      value: CONFERENCE.venueShort,
      href: CONFERENCE_LINKS.map,
      cta: t.mapCta,
    },
    { label: t.themeLabel, value: CONFERENCE.theme, lang: "en" },
  ];

  return (
    <>
      {/* Masthead */}
      <section className="relative overflow-hidden border-b border-ink/10 bg-paper/70">
        {/* The page wash barely carries through a white band, so this one gets
            its own pair of blooms — green off the top, gold low on the right. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(52rem_34rem_at_6%_-4%,rgba(30,122,69,0.1),transparent_62%),radial-gradient(44rem_30rem_at_98%_92%,rgba(214,178,58,0.16),transparent_64%)]"
        />

        <Container className="relative grid gap-8 pt-12 pb-12 sm:pt-16 sm:pb-14 lg:grid-cols-[minmax(0,0.64fr)_minmax(0,0.36fr)] lg:gap-12">
          <div>
            <Eyebrow>{t.navConference}</Eyebrow>
            <PageTitle className="max-w-[22ch]">{t.confTitle}</PageTitle>

            {/* Cream boxes on the white band, so each fact still reads as its
                own thing rather than melting into the surface. */}
            <dl className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-3 lg:gap-4">
              {summary.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-ink/8 bg-cream px-5 py-5"
                >
                  <dt className="font-sans text-[0.6875rem] font-semibold tracking-[0.16em] text-muted uppercase">
                    {item.label}
                  </dt>
                  <dd
                    lang={item.lang}
                    className="mt-2.5 font-display text-[1.0625rem] leading-[1.45] font-semibold text-pretty"
                  >
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block no-underline"
                      >
                        <span className="transition-colors group-hover:text-brand">
                          {item.value}
                        </span>
                        <span className="mt-2 block font-sans text-xs font-medium text-muted transition-colors group-hover:text-brand">
                          {item.cta} →
                        </span>
                      </a>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            {/* The venue on a map, so a reader can place it without leaving. */}
            <iframe
              src={CONFERENCE_LINKS.mapEmbed}
              title={CONFERENCE.venue}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="mt-3 h-[17rem] w-full rounded-xl border border-ink/8 sm:mt-4 sm:h-[21rem]"
            />
          </div>

          {/* Whatever upright plates sit in public/image, cycling. */}
          <PlateCarousel
            plates={readPlates(PLATES)}
            sizes="(min-width: 1024px) 34vw, 100vw"
            zoomLabel={t.imageZoom}
            closeLabel={t.imageClose}
            className="w-full self-start rounded-xl ring-1 ring-ink/10"
          />
        </Container>
      </section>

      {/* 01 — Participants */}
      <Container className="grid gap-10 pt-16 sm:pt-22 lg:grid-cols-[minmax(0,0.36fr)_minmax(0,0.64fr)] lg:gap-14">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
          <Eyebrow>01</Eyebrow>
          <SectionTitle>{t.partTitle}</SectionTitle>
          <p className="mt-5 max-w-[34ch] font-sans text-[0.9375rem] leading-[1.65] text-pretty text-muted">
            {t.partIntro}
          </p>
        </div>

        <Reveal className="max-w-[64ch]">
          <ol>
            {participants.map((participant, i) => (
              <li
                key={participant}
                data-reveal
                className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-baseline gap-2 border-t border-ink/12 py-4"
              >
                <span className="font-display text-xs font-bold tabular-nums text-brand">
                  {`0${i + 1}`}
                </span>
                <span className="font-sans text-[1.0625rem] leading-[1.65] text-pretty text-body">
                  {participant}
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
      </Container>

      {/* 02 — Sub-events */}
      <section className="relative mt-16 overflow-hidden sm:mt-22">
        <ParallaxPlate src="/image12.png" />
        {/* Black, heavily drawn down: the photograph is atmosphere here, not
            something to be read. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.7)_45%,rgba(0,0,0,0.86)_100%)]"
        />

        <Container className="relative py-18 text-white sm:py-24">
          <div className="mx-auto max-w-[46rem] text-center">
            <Eyebrow tone="mint">02</Eyebrow>
            <SectionTitle>{t.eventsTitle}</SectionTitle>
            <p className="mx-auto mt-5 max-w-[54ch] font-sans text-[0.9375rem] leading-[1.7] text-pretty text-white/75">
              {t.eventsIntro}
            </p>
          </div>

          <Reveal className="mt-12 sm:mt-14">
            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
              {SUB_EVENTS.map((event, i) => {
                const accent = ACCENTS[i % ACCENTS.length];

                return (
                  <li
                    key={event}
                    data-reveal
                    className="group rounded-2xl bg-white p-6 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.7)] transition-transform duration-500 hover:-translate-y-1"
                  >
                    <div
                      style={{ color: accent }}
                      className="font-display text-[2.5rem] leading-none font-extrabold tabular-nums"
                    >
                      {`0${i + 1}`}
                    </div>

                    <span
                      aria-hidden
                      style={{ backgroundColor: accent }}
                      className="mt-4 block h-px w-10 opacity-60 transition-all duration-500 group-hover:w-16 group-hover:opacity-100"
                    />
                    <p
                      lang="en"
                      className="mt-3.5 font-display text-[1.125rem] leading-[1.3] font-semibold text-pretty text-ink"
                    >
                      {event}
                    </p>
                  </li>
                );
              })}
            </ol>
          </Reveal>
        </Container>
      </section>

      {/* 03 — Registration */}
      <section className="bg-paper/60">
        <Container className="grid gap-10 pt-16 pb-20 sm:pt-22 sm:pb-24 lg:grid-cols-[minmax(0,0.36fr)_minmax(0,0.64fr)] lg:gap-14">
          <div>
            <Eyebrow>03</Eyebrow>
            <SectionTitle>{t.regTitle}</SectionTitle>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-[linear-gradient(160deg,#11402c,#0b2e1f)] p-7 text-white sm:p-9">
            <p className="max-w-[46ch] font-display text-[clamp(1.125rem,1.8vw,1.375rem)] leading-[1.45] font-medium text-pretty text-mint-pale">
              {t.regText}
            </p>
            <div className="mt-7">
              <Cta
                href={localizedHref(lang, "/register")}
                variant="light"
                size="lg"
              >
                {t.regCta}
              </Cta>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
