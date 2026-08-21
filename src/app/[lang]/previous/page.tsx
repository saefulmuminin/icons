import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditionVideos } from "@/components/edition-videos";
import { Reveal } from "@/components/reveal";
import { Container, Eyebrow, PageTitle } from "@/components/ui";
import { EDITIONS } from "@/lib/content";
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
    path: "/previous",
    title: t.navPrevious,
    description: t.prevIntro,
  });
}

export default async function PreviousPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const t = getDictionary(lang);
  // Newest first: the most recent edition is the one people came to see.
  const editions = [...EDITIONS].reverse().map((edition) => ({
    ...edition,
    ordinal: edition.title.match(/\b(\d+(?:st|nd|rd|th))\b/)?.[1] ?? "",
    mark: editionMark(edition.year),
  }));

  return (
    <>
      {/* Masthead */}
      <section className="relative overflow-hidden border-b border-ink/10 bg-paper/70">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(52rem_34rem_at_6%_-4%,rgba(30,122,69,0.1),transparent_62%),radial-gradient(44rem_30rem_at_98%_92%,rgba(214,178,58,0.16),transparent_64%)]"
        />

        <Container className="relative pt-12 pb-12 sm:pt-16 sm:pb-14">
          <Eyebrow>{t.navPrevious}</Eyebrow>
          <PageTitle className="max-w-[20ch]">{t.prevTitle}</PageTitle>
          <p className="mt-5 max-w-[62ch] font-sans text-[1.0625rem] leading-[1.7] text-pretty text-muted">
            {t.prevIntro}
          </p>
        </Container>
      </section>

      {/* The archive */}
      <Container className="pt-16 pb-20 sm:pt-22 sm:pb-24">
        <Reveal>
          <EditionVideos
            editions={editions}
            noArchiveLabel={t.noArchive}
            closeLabel={t.videoClose}
          />
        </Reveal>
      </Container>
    </>
  );
}

/**
 * An edition's own mark, if one has been filed. Drop a file into
 * public/logo/edition named with the year — 2025.png, iconz-2025.svg, either
 * works — and it takes the place of the ordinal tile.
 */
function editionMark(year: string) {
  const dir = join(process.cwd(), "public", "logo", "edition");
  if (!existsSync(dir)) return null;

  const file = readdirSync(dir).find(
    (name) => /\.(svg|png|webp|avif|jpe?g)$/i.test(name) && name.includes(year),
  );

  return file ? encodeURI(`/logo/edition/${file}`) : null;
}
