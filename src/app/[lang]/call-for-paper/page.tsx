import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ParallaxPlate } from "@/components/parallax-plate";
import { Reveal } from "@/components/reveal";
import {
  Container,
  Cta,
  Eyebrow,
  PageTitle,
  SectionTitle,
} from "@/components/ui";
import { getCfpDates, getJournals, getSubthemes, LINKS } from "@/lib/content";
import { getDictionary, isLang } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

/** A muted tone per milestone, matching the run-up cards on the home page. */
const ACCENTS = ["#b45309", "#1e7a45", "#0e7490", "#4d7c0f"];

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
    path: "/call-for-paper",
    title: t.navCfp,
    description: t.cfpIntro,
  });
}

export default async function CallForPaperPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const t = getDictionary(lang);
  const subthemes = getSubthemes();
  const journals = getJournals();
  const timeline = getCfpDates(lang);

  return (
    <>
      {/* Masthead */}
      <section className="relative overflow-hidden border-b border-ink/10 bg-paper/70">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(52rem_34rem_at_6%_-4%,rgba(30,122,69,0.1),transparent_62%),radial-gradient(44rem_30rem_at_98%_92%,rgba(214,178,58,0.16),transparent_64%)]"
        />

        <Container className="relative grid items-end gap-10 pt-12 pb-12 sm:pt-16 sm:pb-14 lg:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)] lg:gap-12">
          <div>
            <Eyebrow>{t.navCfp}</Eyebrow>
            <PageTitle className="max-w-[24ch]">{t.cfpTitle}</PageTitle>
            <p className="mt-5 max-w-[52ch] font-sans text-[1.0625rem] leading-[1.7] text-pretty text-muted">
              {t.cfpIntro}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Cta href={LINKS.submission} size="lg">
                {t.cfpCta1}
              </Cta>
              <Cta href={LINKS.template} variant="outline" size="lg">
                {t.cfpCta2}
              </Cta>
            </div>
          </div>

          {/* One shape for the cut-out to stand on, sized off the artwork
              rather than a fixed box. */}
          <div className="relative">
            <span
              aria-hidden
              className="absolute inset-x-[10%] bottom-0 aspect-square rounded-full bg-brand"
            />

            <Image
              src="/image/image1.png"
              alt=""
              priority
              width={541}
              height={461}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="relative h-auto w-full"
            />
          </div>
        </Container>
      </section>

      {/* 01 — Sub-themes */}
      <Container className="grid gap-10 pt-16 sm:pt-22 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,0.68fr)] lg:gap-14">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
          <Eyebrow>01</Eyebrow>
          <SectionTitle>{t.subthemesTitle}</SectionTitle>
        </div>

        <Reveal>
          <ol className="grid gap-3 sm:grid-cols-2">
            {subthemes.map((subtheme) => (
              <li
                key={subtheme.n}
                data-reveal
                className="group rounded-xl border border-ink/10 bg-paper p-5 transition-colors duration-300 hover:border-brand/35"
              >
                <span className="font-display text-xs font-bold tabular-nums text-brand">
                  {subtheme.n}
                </span>
                <p
                  lang="en"
                  className="mt-2.5 font-display text-[0.9375rem] leading-[1.5] font-semibold text-pretty text-ink"
                >
                  {subtheme.text}
                </p>
              </li>
            ))}
          </ol>
        </Reveal>
      </Container>

      {/* 02 — Timeline */}
      <section className="relative mt-16 overflow-hidden sm:mt-22">
        <ParallaxPlate src="/image/bg.png" />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.7)_45%,rgba(0,0,0,0.86)_100%)]"
        />

        <Container className="relative py-18 text-white sm:py-24">
          <div className="mx-auto max-w-[46rem] text-center">
            <Eyebrow tone="mint">02</Eyebrow>
            <SectionTitle>{t.timelineTitle}</SectionTitle>
          </div>

          <Reveal className="mt-12 sm:mt-14">
            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
              {timeline.map((entry, i) => {
                const accent = ACCENTS[i % ACCENTS.length];

                return (
                  <li
                    key={entry.label}
                    data-reveal
                    className="group rounded-2xl bg-white p-6 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.7)] transition-transform duration-500 hover:-translate-y-1"
                  >
                    <div
                      style={{ color: accent }}
                      className="font-display text-[0.6875rem] font-semibold tracking-[0.16em] uppercase"
                    >
                      {`0${i + 1}`}
                    </div>
                    <div
                      style={{ color: accent }}
                      className="mt-2 font-display text-[1rem] leading-[1.25] font-bold"
                    >
                      {entry.date}
                    </div>
                    <span
                      aria-hidden
                      style={{ backgroundColor: accent }}
                      className="mt-4 block h-px w-10 opacity-60 transition-all duration-500 group-hover:w-16 group-hover:opacity-100"
                    />
                    <p className="mt-3.5 font-sans text-[0.8125rem] leading-[1.55] text-pretty text-body">
                      {entry.label}
                    </p>
                  </li>
                );
              })}
            </ol>
          </Reveal>
        </Container>
      </section>

      {/* 03 — Publication outlets */}
      <section className="bg-paper/60">
        <Container className="grid gap-10 pt-16 pb-20 sm:pt-22 sm:pb-24 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,0.68fr)] lg:gap-14">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
            <Eyebrow>03</Eyebrow>
            <SectionTitle>{t.pubTitle}</SectionTitle>
            <p className="mt-5 max-w-[34ch] font-sans text-[0.9375rem] leading-[1.65] text-pretty text-muted">
              {t.pubIntro}
            </p>
          </div>

          <Reveal className="max-w-[64ch]">
            <ol>
              {journals.map((journal) => (
                <li
                  key={journal.n}
                  data-reveal
                  className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-baseline gap-2 border-t border-ink/12 py-4"
                >
                  <span className="font-display text-xs font-bold tabular-nums text-brand">
                    {journal.n}
                  </span>
                  <span
                    lang="en"
                    className="font-sans text-[0.9375rem] leading-[1.6] text-pretty text-body"
                  >
                    {journal.text}
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
