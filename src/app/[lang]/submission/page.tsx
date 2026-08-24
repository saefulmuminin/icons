import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ParallaxPlate } from "@/components/parallax-plate";
import { PlateViewer } from "@/components/plate-viewer";
import { StarLattice } from "@/components/pattern";
import { Reveal } from "@/components/reveal";
import {
  Container,
  Cta,
  Eyebrow,
  PageTitle,
  SectionTitle,
} from "@/components/ui";
import {
  BOOK_CHAPTER,
  getBookDates,
  getCfpDates,
  getJournals,
  getSubthemes,
  LINKS,
} from "@/lib/content";
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
    path: "/submission",
    title: t.navSubmission,
    description: t.submitIntro,
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
  const subthemes = getSubthemes();
  const journals = getJournals();
  const timeline = getCfpDates(lang);
  const bookDates = getBookDates(lang);
  const editors = BOOK_CHAPTER.editors.map((editor) => ({
    ...editor,
    portrait: portraitFor(editor.name),
  }));
  const publishers = BOOK_CHAPTER.publishers.map((name) => ({
    name,
    logo: publisherLogo(name),
  }));

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
            <Eyebrow>{t.navSubmission}</Eyebrow>
            <PageTitle className="max-w-[20ch]">{t.submitTitle}</PageTitle>
            <p className="mt-5 max-w-[52ch] font-sans text-[1.0625rem] leading-[1.7] text-pretty text-muted">
              {t.submitIntro}
            </p>

            {/* Two calls run at once, so the choice between them is offered in
                the masthead rather than further down: it is the first thing
                anyone arriving here has to make. Plain anchors down the page
                rather than two routes — both are short enough to read whole,
                and a reader who wants the other one is a thumb away from it. */}
            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              <Pick
                n="01"
                href="#call-for-papers"
                title={t.pickPapers}
                note={t.pickPapersNote}
              />
              <Pick
                n="02"
                href="#book-chapter"
                title={t.pickBook}
                note={t.pickBookNote}
              />
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

      {/* 01 — Call for Papers */}
      <section
        id="call-for-papers"
        className="scroll-mt-[var(--header-h)] pt-16 sm:pt-20"
      >
        <Container className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-14">
          <div>
            <Eyebrow>{t.pickPapers}</Eyebrow>
            <SectionTitle className="max-w-[24ch]">{t.cfpTitle}</SectionTitle>
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

          {/* The poster carries the same call in one picture — topics, dates
              and the submission QR — for anyone who would rather read it that
              way, or pass it on. Opens full size on click. */}
          <PlateViewer
            src="/image16.png"
            ratio="1080 / 1350"
            sizes="(min-width: 1024px) 20rem, 100vw"
            zoomLabel={t.imageZoom}
            closeLabel={t.imageClose}
            className="mx-auto aspect-[1080/1350] w-full max-w-[20rem] rounded-xl ring-1 ring-ink/10"
          />
        </Container>
      </section>

      {/* Sub-themes, on their own ground. The opening block above sits on the
          page's cream; leaving this one there too ran the two together into a
          single column with no seam anywhere the eye could find it. */}
      <section className="relative mt-16 overflow-hidden border-y border-ink/10 bg-sage sm:mt-20">
        <StarLattice
          id="subthemes-lattice"
          className="text-brand opacity-[0.06]"
        />

        <Container className="relative py-16 sm:py-20">
          {/* Centred over the whole width rather than parked in a sticky
              column: with the cards in three the list is wider than it is
              tall, and a heading pinned to the side of it had nothing left to
              stay beside. */}
          <div className="mx-auto max-w-[46rem] text-center">
            <SectionTitle>{t.subthemesTitle}</SectionTitle>
          </div>

          <Reveal className="mt-10 sm:mt-12">
            <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
      </section>

      {/* Timeline */}
      <section className="relative overflow-hidden">
        <ParallaxPlate src="/image12.png" />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.7)_45%,rgba(0,0,0,0.86)_100%)]"
        />

        <Container className="relative py-18 text-white sm:py-24">
          <div className="mx-auto max-w-[46rem] text-center">
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

      {/* Publication outlets */}
      <section className="bg-paper/60">
        <Container className="grid gap-10 pt-16 pb-20 sm:pt-22 sm:pb-24 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,0.68fr)] lg:gap-14">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
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

      {/* 02 — Call for International Book Chapter. Dark ground so the second
          call announces itself rather than reading as a fourth part of the
          first, but a plain gradient: a photograph here would have been the
          third picture on the page and the second one of the same crowd. */}
      <section
        id="book-chapter"
        className="relative scroll-mt-[var(--header-h)] overflow-hidden bg-[linear-gradient(165deg,var(--color-brand-mid)_0%,var(--color-brand-deep)_58%,var(--color-brand-shade)_100%)]"
      >
        <Container className="relative grid items-start gap-10 py-18 text-white sm:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-14">
          <div>
            <Eyebrow tone="mint">02</Eyebrow>
            <SectionTitle className="max-w-[22ch]">{t.bookTitle}</SectionTitle>

            <p className="mt-6 inline-flex flex-wrap items-baseline gap-x-2.5 rounded-full border border-mint/30 bg-white/8 px-4 py-2">
              <span className="font-sans text-[0.6875rem] font-semibold tracking-[0.16em] text-mint-dim uppercase">
                {t.bookThemeLabel}
              </span>
              <span
                lang="en"
                className="font-display text-[0.9375rem] font-bold text-white"
              >
                “{BOOK_CHAPTER.theme}”
              </span>
            </p>

            <p className="mt-6 font-sans text-[0.9375rem] leading-[1.7] text-pretty text-mint-pale">
              {t.bookLead}
            </p>
            <p className="mt-4 font-sans text-[0.9375rem] leading-[1.7] text-pretty text-white/75">
              {t.bookBody}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Cta
                href={BOOK_CHAPTER.links.submission}
                variant="light"
                size="lg"
              >
                {t.bookCta1}
              </Cta>
              <Cta
                href={BOOK_CHAPTER.links.guidelines}
                variant="ghost"
                size="lg"
              >
                {t.bookCta2}
              </Cta>
              <Cta href={BOOK_CHAPTER.links.template} variant="ghost" size="lg">
                {t.bookCta3}
              </Cta>
            </div>

            <p className="mt-5">
              <span className="inline-block rounded-full border border-mint/40 bg-mint/12 px-4 py-2 font-sans text-[0.8125rem] font-semibold text-mint">
                {t.bookFree}
              </span>
            </p>
          </div>

          {/* The same call in one picture, set beside the words the way the
              paper poster is on the half above. */}
          <PlateViewer
            src="/image5.png"
            ratio="1080 / 1350"
            sizes="(min-width: 1024px) 20rem, 100vw"
            zoomLabel={t.imageZoom}
            closeLabel={t.imageClose}
            className="mx-auto aspect-[1080/1350] w-full max-w-[20rem] rounded-xl ring-1 ring-white/20"
          />
        </Container>
      </section>

      {/* Everything the call asks a writer to know, on one ground: who is
          editing it, when it is due, and where a chosen chapter ends up.
          Splitting these into three bands made three headings out of what is
          really one set of particulars. */}
      <section className="bg-paper/60">
        <Container className="py-16 sm:py-20">
          <SectionTitle>{t.bookEditorsLabel}</SectionTitle>

          <Reveal className="mt-7">
            <ol className="grid gap-3 sm:grid-cols-2">
              {editors.map((editor) => (
                <li
                  key={editor.name}
                  data-reveal
                  className="flex items-start gap-4 rounded-xl border border-ink/10 bg-paper p-5 transition-colors duration-300 hover:border-brand/35"
                >
                  {editor.portrait ? (
                    <Image
                      src={editor.portrait}
                      alt=""
                      width={192}
                      height={192}
                      sizes="4rem"
                      // Anchored to the top: three of these are upright
                      // portraits, and a centre crop into a circle takes the
                      // top of the head off and keeps the chest.
                      className="h-16 w-16 flex-none rounded-full object-cover object-top ring-1 ring-ink/10"
                    />
                  ) : (
                    // No portrait filed yet — the initials hold the place, so
                    // the row never collapses to a different shape.
                    <span className="flex h-16 w-16 flex-none items-center justify-center rounded-full bg-brand/10 font-display text-[0.875rem] font-bold text-brand">
                      {initials(editor.name)}
                    </span>
                  )}

                  <span className="min-w-0 flex-1">
                    <span
                      lang="en"
                      className="block font-display text-[0.9375rem] leading-[1.35] font-bold text-pretty text-ink"
                    >
                      {editor.name}
                    </span>
                    <span
                      lang="en"
                      className="mt-1.5 block font-sans text-[0.8125rem] leading-[1.5] text-pretty text-muted"
                    >
                      {editor.at}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>

          <div className="mt-14 border-t border-ink/12 pt-12 sm:mt-16 sm:pt-14">
            <SectionTitle>{t.bookDatesLabel}</SectionTitle>

            <Reveal className="mt-7">
              <ol className="grid gap-3 sm:grid-cols-3">
                {bookDates.map((entry) => (
                  <li
                    key={entry.label}
                    data-reveal
                    className="rounded-xl border border-ink/10 bg-paper p-5"
                  >
                    <span className="block font-display text-[1rem] leading-[1.25] font-bold text-brand">
                      {entry.date}
                    </span>
                    <span
                      aria-hidden
                      className="mt-3.5 block h-px w-10 bg-brand/45"
                    />
                    <span className="mt-3 block font-sans text-[0.8125rem] leading-[1.55] text-pretty text-body">
                      {entry.label}
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>

            {/* Kept under the dates rather than ruled off on its own: where a
                chapter ends up is the last step of the same run, not a separate
                subject. */}
            <p className="mt-9 max-w-[54ch] font-sans text-[0.9375rem] leading-[1.7] text-pretty text-muted">
              {t.bookPublishers}
            </p>

            <ul className="mt-6 flex flex-wrap items-stretch gap-3">
              {publishers.map((house) => (
                <li
                  key={house.name}
                  className="flex items-center rounded-xl border border-ink/12 bg-paper px-5 py-3.5"
                >
                  {house.logo ? (
                    // The mark alone once one is filed: these are wordmarks,
                    // so setting the name beside them would print it twice.
                    <Image
                      src={house.logo}
                      alt={house.name}
                      width={320}
                      height={96}
                      sizes="10rem"
                      className="h-7 w-auto object-contain"
                    />
                  ) : (
                    <span
                      lang="en"
                      className="font-display text-[0.9375rem] font-bold text-ink"
                    >
                      {house.name}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </>
  );
}

/** Only letters and digits, so punctuation and spacing drift never matter. */
const loose = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * An editor's portrait, if one has been filed. Drop a file into public/editor
 * named after them — `abdul-ghafar-ismail.jpg`, `Irfan Syauqi Beik.png`,
 * either works — and it takes the place of their initials. Matched loosely, so
 * the titles in front of a name do not have to be repeated in the filename.
 */
function portraitFor(name: string) {
  const dir = join(process.cwd(), "public", "editor");
  if (!existsSync(dir)) return null;

  const target = loose(name);
  const file = readdirSync(dir).find((entry) => {
    if (!/\.(png|webp|avif|jpe?g)$/i.test(entry)) return false;

    const key = loose(entry.replace(/\.[^.]+$/, ""));
    return key.length > 3 && (target.includes(key) || key.includes(target));
  });

  return file ? encodeURI(`/editor/${file}`) : null;
}

/**
 * A publisher's mark, if one has been filed. Drop a file into public/publisher
 * named after them — `springer.svg`, `Emerald.png` — and it takes the place of
 * their name set in type. Matched the same loose way as everything else here.
 */
function publisherLogo(name: string) {
  const dir = join(process.cwd(), "public", "publisher");
  if (!existsSync(dir)) return null;

  const target = loose(name);
  const file = readdirSync(dir).find((entry) => {
    if (!/\.(svg|png|webp|avif|jpe?g)$/i.test(entry)) return false;

    const key = loose(entry.replace(/\.[^.]+$/, ""));
    return key.length > 3 && (target.includes(key) || key.includes(target));
  });

  return file ? encodeURI(`/publisher/${file}`) : null;
}

/**
 * Initials for someone with a string of titles in front of their name. Every
 * title here ends in a full stop — Prof., Dr., Assoc. — and the name itself
 * never does, which is the whole test.
 */
function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((word) => !word.endsWith("."))
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

/** One of the two calls, offered before either of them starts. */
function Pick({
  n,
  href,
  title,
  note,
}: {
  n: string;
  href: string;
  title: string;
  note: string;
}) {
  return (
    <a
      href={href}
      className="group flex items-start gap-3.5 rounded-2xl border border-ink/12 bg-paper p-5 no-underline shadow-[0_14px_34px_-28px_rgba(4,20,13,0.5)] transition-colors duration-300 hover:border-brand/35"
    >
      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-brand/10 font-display text-[0.75rem] font-bold text-brand">
        {n}
      </span>

      <span className="min-w-0 flex-1">
        <span
          lang="en"
          className="block font-display text-[1.0625rem] leading-[1.3] font-bold text-pretty text-ink"
        >
          {title}
        </span>
        <span className="mt-1.5 block font-sans text-[0.8125rem] leading-[1.55] text-pretty text-muted">
          {note}
        </span>
      </span>

      <span
        aria-hidden
        className="mt-1 flex-none font-sans text-pale transition-transform duration-300 group-hover:translate-y-0.5 group-hover:text-brand"
      >
        ↓
      </span>
    </a>
  );
}
