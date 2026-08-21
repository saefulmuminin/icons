import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ParallaxPlate } from "@/components/parallax-plate";
import { Reveal } from "@/components/reveal";
import {
  Container,
  Cta,
  Eyebrow,
  PageTitle,
  SectionTitle,
} from "@/components/ui";
import { getJournals, LINKS } from "@/lib/content";
import { getDictionary, isLang } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

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
    path: "/proceedings",
    title: t.navProceedings,
    description: t.procText,
  });
}

export default async function ProceedingsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const t = getDictionary(lang);
  const journals = getJournals();

  return (
    <>
      {/* Masthead */}
      <section className="relative overflow-hidden border-b border-ink/10 bg-paper/70">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(52rem_34rem_at_6%_-4%,rgba(30,122,69,0.1),transparent_62%),radial-gradient(44rem_30rem_at_98%_92%,rgba(214,178,58,0.16),transparent_64%)]"
        />

        <Container className="relative grid items-center gap-10 pt-12 pb-12 sm:pt-16 sm:pb-14 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,0.38fr)] lg:gap-12">
          <div>
            <Eyebrow>{t.navProceedings}</Eyebrow>
            <PageTitle className="max-w-[20ch]">{t.procTitle}</PageTitle>
            <p className="mt-5 max-w-[52ch] font-sans text-[1.0625rem] leading-[1.7] text-pretty text-muted">
              {t.procText}
            </p>

            <div className="mt-8">
              <Cta href={LINKS.submission} size="lg">
                {t.procCta}
              </Cta>
            </div>
          </div>

          {/* A shape that never quite settles: the filled blob drifts through
              its own corner radii, with an outlined echo turning against it. */}
          <div className="relative">
            <span
              aria-hidden
              className="absolute inset-x-[4%] top-[6%] bottom-[2%] animate-blob rounded-[46%_54%_38%_62%/38%_44%_56%_62%] border border-brand/25 [animation-direction:reverse]"
            />
            <span
              aria-hidden
              className="absolute inset-x-[9%] top-[14%] bottom-0 animate-blob rounded-[46%_54%_38%_62%/38%_44%_56%_62%] bg-brand"
            />

            <Image
              src="/image/image2.png"
              alt=""
              priority
              width={404}
              height={553}
              sizes="(min-width: 1024px) 34vw, 100vw"
              className="relative mx-auto h-auto w-full max-w-[18rem]"
            />
          </div>
        </Container>
      </section>

      {/* Where accepted papers can land */}
      <section className="relative mt-16 overflow-hidden sm:mt-22">
        <ParallaxPlate src="/image/bg.png" />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.7)_45%,rgba(0,0,0,0.86)_100%)]"
        />

        <Container className="relative py-18 text-white sm:py-24">
          <div className="mx-auto max-w-[46rem] text-center">
            <Eyebrow tone="mint">01</Eyebrow>
            <SectionTitle>{t.pubTitle}</SectionTitle>
            <p className="mx-auto mt-5 max-w-[54ch] font-sans text-[0.9375rem] leading-[1.7] text-pretty text-white/75">
              {t.pubIntro}
            </p>
          </div>

          <Reveal className="mt-12 sm:mt-14">
            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {journals.map((journal) => (
                <li
                  key={journal.n}
                  data-reveal
                  className="group rounded-2xl bg-white p-6 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.7)] transition-transform duration-500 hover:-translate-y-1"
                >
                  <span className="font-display text-[0.6875rem] font-semibold tracking-[0.18em] text-brand uppercase">
                    {journal.n}
                  </span>
                  <span
                    aria-hidden
                    className="mt-3 block h-px w-10 bg-brand/50 transition-all duration-500 group-hover:w-16 group-hover:bg-brand"
                  />
                  <p
                    lang="en"
                    className="mt-4 font-sans text-[0.9375rem] leading-[1.6] text-pretty text-body"
                  >
                    {journal.text}
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
