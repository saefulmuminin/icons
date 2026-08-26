import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { Container, Cta, Eyebrow, PageTitle } from "@/components/ui";
import { EDITIONS, LINKS } from "@/lib/content";
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

  // Newest first: the most recent proceedings are the ones people came for.
  const editions = [...EDITIONS].reverse().map((edition) => ({
    ...edition,
    ordinal: edition.title.match(/\b(\d+(?:st|nd|rd|th))\b/)?.[1] ?? "",
    cover: coverFor(edition.year),
  }));

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
              <Cta href={LINKS.archive} size="lg">
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

      {/* One edition per row, running back through the years — the same shape
          the archive of recordings takes, because it is the same archive seen
          from a different side. */}
      <Container className="pt-14 pb-20 sm:pt-16 sm:pb-24">
        <Reveal>
          <ol className="grid gap-4">
            {editions.map((edition) => (
              <li
                key={edition.year}
                data-reveal
                className="flex flex-wrap items-center gap-x-5 gap-y-4 rounded-2xl border border-ink/10 bg-paper p-6 transition-colors duration-300 hover:border-brand/30"
              >
                {edition.cover ? (
                  <Image
                    src={edition.cover}
                    alt=""
                    width={283}
                    height={400}
                    sizes="5rem"
                    className="h-28 w-auto flex-none rounded-lg object-cover ring-1 ring-ink/10"
                  />
                ) : (
                  // No cover filed for this year — the ordinal stands in.
                  <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl border border-brand/20 bg-brand/6 font-display text-[0.9375rem] font-extrabold tracking-[-0.02em] text-brand">
                    {edition.ordinal}
                  </span>
                )}

                <div className="min-w-0 flex-1">
                  <span className="font-display text-[0.6875rem] font-semibold tracking-[0.18em] text-brand uppercase">
                    {edition.year}
                  </span>
                  <h2
                    lang="en"
                    className="mt-1.5 font-display text-[1.0625rem] leading-[1.35] font-semibold text-pretty text-ink"
                  >
                    {edition.title}
                  </h2>

                  {edition.theme ? (
                    <p
                      lang="en"
                      className="mt-2 font-display text-[0.875rem] leading-[1.45] font-normal text-pretty text-muted"
                    >
                      “{edition.theme}”
                    </p>
                  ) : null}
                </div>

                {edition.proceedings ? (
                  <a
                    href={edition.proceedings}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-none rounded-full border border-brand/28 bg-brand/6 px-4 py-2 font-sans text-[0.8125rem] font-semibold text-brand no-underline transition-colors hover:border-brand hover:bg-brand hover:text-white"
                  >
                    {t.procOpen} ↗
                  </a>
                ) : (
                  <span className="flex-none py-2 font-sans text-[0.8125rem] text-faint">
                    {t.procSoon}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </Reveal>
      </Container>
    </>
  );
}

/**
 * That year's proceedings cover, if one has been filed. Drop a file into
 * public/proceedings named with the year — 2025.png, iconz-2025.jpg, either
 * works — and it takes the place of the ordinal tile.
 */
function coverFor(year: string) {
  const dir = join(process.cwd(), "public", "proceedings");
  if (!existsSync(dir)) return null;

  const file = readdirSync(dir).find(
    (name) => /\.(svg|png|webp|avif|jpe?g)$/i.test(name) && name.includes(year),
  );

  return file ? encodeURI(`/proceedings/${file}`) : null;
}
