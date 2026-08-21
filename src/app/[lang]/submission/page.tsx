import type { Metadata } from "next";
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
import { getCfpDates, LINKS } from "@/lib/content";
import { getDictionary, isLang } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

/** A tone per step, from the palette the run-up cards use. */
const ACCENTS = ["#1e7a45", "#0e7490"];

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
    path: "/submission",
    title: t.navSubmission,
    description: t.loginText,
  });
}

export default async function SubmissionPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const t = getDictionary(lang);
  const timeline = getCfpDates(lang);

  const steps = [
    {
      title: t.guideTitle,
      text: t.guideText,
      cta: t.guideCta,
      href: LINKS.template,
      variant: "outline" as const,
    },
    {
      title: t.loginTitle,
      text: t.loginText,
      cta: t.loginCta,
      href: LINKS.submission,
      variant: "primary" as const,
    },
  ];

  return (
    <>
      {/* Masthead */}
      <section className="relative overflow-hidden border-b border-ink/10 bg-paper/70">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(52rem_34rem_at_6%_-4%,rgba(30,122,69,0.1),transparent_62%),radial-gradient(44rem_30rem_at_98%_92%,rgba(214,178,58,0.16),transparent_64%)]"
        />

        <Container className="relative pt-12 pb-12 sm:pt-16 sm:pb-14">
          <Eyebrow>{t.navSubmission}</Eyebrow>
          <PageTitle className="max-w-[20ch]">{t.subTitle}</PageTitle>
        </Container>
      </section>

      {/* 01 — The two moves an author has to make, in order */}
      <Container className="pt-16 sm:pt-22">
        <Reveal>
          <ol className="grid gap-5 md:grid-cols-2">
            {steps.map((step, i) => {
              const accent = ACCENTS[i % ACCENTS.length];

              return (
                <li
                  key={step.title}
                  data-reveal
                  className="group flex flex-col rounded-2xl border border-ink/10 bg-paper p-7 transition-colors duration-300 hover:border-brand/35 sm:p-8"
                >
                  <span
                    style={{ color: accent }}
                    className="font-sans text-[0.6875rem] font-semibold tracking-[0.18em] uppercase"
                  >
                    {`0${i + 1}`}
                  </span>

                  <h2 className="mt-3 font-display text-[1.375rem] leading-[1.25] font-bold text-pretty">
                    {step.title}
                  </h2>

                  <span
                    aria-hidden
                    style={{ backgroundColor: accent }}
                    className="mt-4 block h-px w-10 opacity-60 transition-all duration-500 group-hover:w-16 group-hover:opacity-100"
                  />

                  <p className="mt-4 mb-7 font-sans text-base leading-[1.7] text-pretty text-muted">
                    {step.text}
                  </p>

                  <span className="mt-auto">
                    <Cta href={step.href} variant={step.variant}>
                      {step.cta}
                    </Cta>
                  </span>
                </li>
              );
            })}
          </ol>
        </Reveal>
      </Container>

      {/* 02 — The dates an author is working against */}
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
            <ol className="grid gap-px overflow-hidden rounded-2xl bg-white/12 sm:grid-cols-2 lg:grid-cols-4">
              {timeline.map((entry) => (
                <li
                  key={entry.label}
                  data-reveal
                  className="bg-[rgba(7,20,14,0.55)] px-6 py-6 backdrop-blur-sm"
                >
                  <div className="font-display text-[1rem] leading-[1.25] font-bold text-mint-soft">
                    {entry.date}
                  </div>
                  <p className="mt-2 font-sans text-[0.8125rem] leading-[1.55] text-pretty text-white/70">
                    {entry.label}
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>
        </Container>
      </section>

      <div className="pb-20 sm:pb-24" />
    </>
  );
}
