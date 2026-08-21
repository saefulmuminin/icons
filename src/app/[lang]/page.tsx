import { existsSync, readdirSync } from "node:fs";
import type { Metadata } from "next";
import { join } from "node:path";
import { BackgroundStory } from "@/components/background-story";
import { Hero } from "@/components/hero";
import { KeyDates } from "@/components/key-dates";
import { CornerMotif } from "@/components/corner-motif";
import { StarLattice } from "@/components/pattern";
import { SpeakerGrid } from "@/components/speaker-grid";
import { SupporterMarquee } from "@/components/supporters";
import Image from "next/image";
import { Container, Eyebrow, SectionTitle } from "@/components/ui";
import {
  CONFERENCE,
  FACTS,
  getBackgroundMarks,
  getKeyDates,
  getObjectives,
  getSpeakers,
  ORGANIZERS,
  SUPPORTERS,
} from "@/lib/content";
import { getDictionary, isLang } from "@/lib/i18n";
import { eventJsonLd, pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

import { Objectives } from "@/components/objectives";

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
    title: "The 10th International Conference on Zakat",
    description: `${CONFERENCE.theme} — ${CONFERENCE.dateRange}, ${t.venueLabel}: ${CONFERENCE.venueShort}.`,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const t = getDictionary(lang);
  const objectives = getObjectives(lang);
  const roster = getSpeakers(lang);
  const portraits = matchFiles(
    "pembicara",
    roster.map((one) => one.name),
  );
  const speakers = roster.map((one, i) => ({ ...one, photo: portraits[i] }));

  // The step illustrations are filed under their Indonesian labels whichever
  // language the page is being read in.
  const milestones = getKeyDates(lang);
  const plates = matchFiles(
    "ilutasi",
    getKeyDates("id").map((one) => one.label),
  );
  const keyDates = milestones.map((one, i) => ({ ...one, image: plates[i] }));

  const orgMarks = matchFiles("logo", [...ORGANIZERS]);
  const organizers = ORGANIZERS.map((name, i) => ({ name, logo: orgMarks[i] }));
  const supMarks = matchFiles("logo", [...SUPPORTERS]);
  const supporters = SUPPORTERS.map((name, i) => ({ name, logo: supMarks[i] }));

  // Four movements of the background story, each with the thread it carries
  // and the plate that illustrates it.
  const passages = [
    { n: "01", label: t.bgKey1, text: t.bg1 },
    { n: "02", label: t.bgKey2, text: t.bg2 },
    { n: "03", label: t.bgKey3, text: t.bg3 },
    { n: "04", label: t.bgKey4, text: t.bg4 },
  ].map((passage, i) => ({
    ...passage,
    image: passageImage(i + 1),
    marks: getBackgroundMarks(lang)[i],
  }));

  return (
    <>
      {/* The conference as structured data, so search engines can surface its
          dates, venue and organisers directly. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd(lang)) }}
      />

      <Hero lang={lang} t={t} />

      {/* Facts band */}
      <section className="border-b border-ink/10 bg-paper/70">
        <Container className="grid grid-cols-2 md:grid-cols-4">
          {FACTS.map((fact, i) => (
            <div
              key={fact.key}
              className={[
                "border-ink/10 py-6.5",
                // Two per row on small screens, four in a row from md up.
                i % 2 === 0 ? "border-r" : "pl-6.5",
                i < 2 ? "border-b md:border-b-0" : "",
                i === 0 ? "md:pl-0" : "md:pl-6.5",
                i < FACTS.length - 1 ? "md:border-r" : "md:border-r-0",
              ].join(" ")}
            >
              <div className="font-display text-[2rem] leading-none font-bold text-brand">
                {fact.value}
              </div>
              <div className="mt-2 font-sans text-xs font-medium tracking-[0.1em] uppercase text-muted">
                {t[fact.key]}
              </div>
            </div>
          ))}
        </Container>
      </section>

      {/* 01 — Background */}
      <section className="relative overflow-hidden">
        <div className="relative">
          <BackgroundStory
            title={t.bgTitle}
            intro={t.bgIntro}
            passages={passages}
            zoomLabel={t.imageZoom}
            closeLabel={t.imageClose}
          />
        </div>
      </section>

      {/* 02 — Objectives */}
      <Objectives
        title={t.objTitle}
        intro={t.objIntro}
        objectives={objectives}
      />

      {/* 03 — Speakers */}
      <section className="relative overflow-hidden">
        <CornerMotif />

        <Container className="relative pt-16 sm:pt-22">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
            <div>
              <Eyebrow>03</Eyebrow>
              <SectionTitle>{t.speakersTitle}</SectionTitle>
            </div>
            <p className="max-w-[38ch] font-sans text-[0.9375rem] leading-[1.65] text-muted text-pretty">
              {t.speakersNote}
            </p>
          </div>

          <SpeakerGrid
            speakers={speakers}
            labels={{
              open: t.speakerProfile,
              close: t.imageClose,
              education: t.profileEducation,
              work: t.profileWork,
              entrepreneur: t.profileEntrepreneur,
              community: t.profileCommunity,
              politics: t.profilePolitics,
              dakwah: t.profileDakwah,
              schooling: t.profileSchooling,
            }}
          />
        </Container>
      </section>

      {/* 04 — Key dates */}
      <section className="relative mt-16 overflow-hidden border-y border-ink/10 bg-sage sm:mt-22">
        <StarLattice id="dates-lattice" className="text-brand opacity-[0.06]" />

        <Container className="relative py-16 sm:py-20">
          <Eyebrow>04</Eyebrow>
          <SectionTitle>{t.datesTitle}</SectionTitle>
          <KeyDates entries={keyDates} />
        </Container>
      </section>

      {/* 05 — Organizers & supporters */}
      <section className="bg-paper/60">
        <Container className="grid gap-10 pt-16 sm:pt-22 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,0.68fr)] lg:gap-14">
          <div>
            <Eyebrow>05</Eyebrow>
            <SectionTitle>{t.orgTitle}</SectionTitle>
          </div>

          <div>
            <div className="mb-3.5 font-sans text-xs font-semibold tracking-[0.14em] uppercase text-muted">
              {t.orgLabel}
            </div>

            {/* One card holding all three, split by a hairline. */}
            <ul className="grid divide-y divide-ink/10 overflow-hidden rounded-xl border border-ink/10 bg-paper sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {organizers.map((organizer) => (
                <li
                  key={organizer.name}
                  className="flex items-center gap-3.5 px-5 py-5"
                >
                  <OrganizerMark badge={organizer} />
                  <span className="font-display text-[0.9375rem] leading-[1.35] font-semibold text-pretty">
                    {organizer.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Container>

        <Container className="pt-10 pb-20 sm:pt-12 sm:pb-24">
          <div className="mb-4 font-sans text-xs font-semibold tracking-[0.14em] uppercase text-muted">
            {t.supLabel}
          </div>

          {/* One white card wrapping the whole belt. */}
          <div className="overflow-hidden rounded-xl border border-ink/10 bg-paper py-5">
            <SupporterMarquee items={supporters} />
          </div>
        </Container>
      </section>
    </>
  );
}

/**
 * The plate for a passage, or null while it is still missing — checked as the
 * page is prerendered, so dropping the file into public/image is enough to
 * bring it in on the next build. Either naming scheme is accepted.
 */
function passageImage(n: number) {
  const candidates = [`/image/latabelakangpr${n}.png`, `/image/${n}.png`];
  return (
    candidates.find((src) => existsSync(join(process.cwd(), "public", src))) ??
    null
  );
}

const ART = /\.(jpe?g|png|webp|avif)$/i;

/** Only letters and digits, so punctuation and spacing drift never matter. */
const loose = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * Pairs a list of names with the files in a public folder, matching loosely so
 * a file renamed with different punctuation, spacing or extension still finds
 * its way home. A name with nothing to match returns null, and the page falls
 * back to a plain plate rather than a broken frame.
 */
function matchFiles(folder: string, names: string[]) {
  const dir = join(process.cwd(), "public", folder);

  const files = existsSync(dir)
    ? readdirSync(dir)
        .filter((file) => ART.test(file))
        .map((file) => ({ file, key: loose(file.replace(/\.[^.]+$/, "")) }))
    : [];

  return names.map((name) => {
    const target = loose(name);
    const match = files
      .filter(
        ({ key }) =>
          key.length > 3 && (target.includes(key) || key.includes(target)),
      )
      // An exact name wins outright; otherwise the closest length wins, so
      // "presentasi paper" cannot be swallowed by "technical meeting
      // presentasi paper".
      .sort(
        (a, b) =>
          Number(a.key !== target) - Number(b.key !== target) ||
          Math.abs(a.key.length - target.length) -
            Math.abs(b.key.length - target.length),
      )[0];

    return match ? encodeURI(`/${folder}/${match.file}`) : null;
  });
}

/** An organizer's mark, or their initials while no file is on hand. */
function OrganizerMark({
  badge,
}: {
  badge: { name: string; logo: string | null };
}) {
  if (badge.logo) {
    return (
      <Image
        src={badge.logo}
        alt=""
        width={96}
        height={96}
        className="h-10 w-10 flex-none object-contain"
      />
    );
  }

  return (
    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-brand/10 font-display text-xs font-bold text-brand">
      {badge.name
        .split(/\s+/)
        .filter((word) => /^[A-Z]/.test(word))
        .map((word) => word[0])
        .join("")
        .slice(0, 3)}
    </span>
  );
}
