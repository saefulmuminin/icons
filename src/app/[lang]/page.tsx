import { existsSync, readdirSync } from "node:fs";
import type { Metadata } from "next";
import { join } from "node:path";
import { BackgroundStory } from "@/components/background-story";
import { Hero } from "@/components/hero";
import { KeyDates } from "@/components/key-dates";
import { StarLattice } from "@/components/pattern";
import { Reveal } from "@/components/reveal";
import { CountUp } from "@/components/count-up";
import { SectionJump } from "@/components/section-jump";
import { SpeakerGrid } from "@/components/speaker-grid";
import { SupporterMarquee } from "@/components/supporters";
import Image from "next/image";
import { Container, SectionTitle } from "@/components/ui";
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
import { portraitsIn } from "@/lib/marks";
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
  const portraits = portraitsIn(
    "pembicara",
    roster.map((one) => one.name),
  );
  const speakers = roster.map((one, i) => ({ ...one, photo: portraits[i] }));

  // The step illustrations are filed under their Indonesian labels whichever
  // language the page is being read in.
  const keyDates = getKeyDates(lang);

  const orgMarks = portraitsIn("logo", [...ORGANIZERS]);
  const organizers = ORGANIZERS.map((name, i) => ({ name, logo: orgMarks[i] }));
  const supMarks = portraitsIn("logo", [...SUPPORTERS]);
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
                <CountUp value={fact.value} />
              </div>
              <div className="mt-2 font-sans text-xs font-medium tracking-[0.1em] uppercase text-muted">
                {t[fact.key]}
              </div>
            </div>
          ))}
        </Container>
      </section>

      {/* 01 — Background. `scroll-mt` on each landing spot keeps the sticky
          bar from parking on top of the heading it just jumped to. */}
      <section
        id="background"
        className="relative scroll-mt-[var(--header-h)] overflow-hidden"
      >
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
      <div id="objectives" className="scroll-mt-[var(--header-h)]">
        <Objectives
          title={t.objTitle}
          intro={t.objIntro}
          objectives={objectives}
          labels={{
            label: t.objLabel,
            of: t.objOf,
            prev: t.objPrev,
            next: t.objNext,
          }}
        />
      </div>

      {/* 03 — Speakers */}
      <section
        id="speakers"
        className="relative scroll-mt-[var(--header-h)] overflow-hidden"
      >
        <Container className="relative pt-16 sm:pt-22">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
            <div>
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
              expertise: t.profileExpertise,
              highlights: t.profileHighlights,
            }}
          />
        </Container>
      </section>

      {/* 04 — Key dates */}
      <section
        id="key-dates"
        className="relative mt-16 scroll-mt-[var(--header-h)] overflow-hidden border-y border-ink/10 bg-sage sm:mt-22"
      >
        <StarLattice id="dates-lattice" className="text-brand opacity-[0.06]" />

        <Container className="relative py-16 sm:py-20">
          <SectionTitle>{t.datesTitle}</SectionTitle>
          <KeyDates entries={keyDates} />
        </Container>
      </section>

      {/* 05 — Organizers & supporters. The institutions behind the conference
          are its standing, so this is given the room a closing section earns:
          the heading centred over the page rather than pushed into a column,
          and each organiser on a plate of its own. */}
      <section
        id="organizers"
        className="relative scroll-mt-[var(--header-h)] overflow-hidden border-t border-ink/10 bg-paper"
      >
        <StarLattice id="org-lattice" className="text-brand opacity-[0.05]" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(48rem_28rem_at_50%_-6%,rgba(30,122,69,0.09),transparent_66%)]"
        />

        <Container className="relative py-20 sm:py-28">
          <Reveal>
            <div data-reveal className="mx-auto max-w-[46rem] text-center">
              <SectionTitle className="text-ink">{t.orgTitle}</SectionTitle>
            </div>

            <div className="mt-14 sm:mt-16">
              <Rule label={t.orgLabel} />

              <ul className="mt-9 grid gap-5 sm:grid-cols-3">
                {organizers.map((organizer) => (
                  <li
                    key={organizer.name}
                    data-reveal
                    className="group flex flex-col items-center gap-6 rounded-2xl border border-ink/10 bg-paper px-6 py-10 text-center shadow-[0_18px_44px_-32px_rgba(4,20,13,0.5)] transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-[0_30px_60px_-30px_rgba(4,20,13,0.4)]"
                  >
                    <OrganizerMark badge={organizer} />
                    <span className="font-display text-[1.0625rem] leading-[1.35] font-bold text-pretty text-ink">
                      {organizer.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div data-reveal className="mt-16 sm:mt-20">
              <Rule label={t.supLabel} />

              {/* One white card wrapping the whole belt. */}
              <div className="mt-9 overflow-hidden rounded-2xl border border-ink/10 bg-paper py-7 shadow-[0_18px_44px_-34px_rgba(4,20,13,0.5)]">
                <SupporterMarquee items={supporters} />
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <SectionJump
        label={t.jumpLabel}
        items={[
          { href: "#background", label: t.jumpBackground },
          { href: "#objectives", label: t.jumpObjectives },
          { href: "#speakers", label: t.jumpSpeakers },
          { href: "#key-dates", label: t.jumpDates },
          { href: "#organizers", label: t.jumpOrganizers },
        ]}
      />
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

/** An organizer's mark, or their initials while no file is on hand. */
/** A label set into a rule, so each half of the section opens on its own. */
function Rule({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-5">
      <span aria-hidden className="h-px flex-1 bg-ink/12" />
      <span className="font-sans text-xs font-semibold tracking-[0.16em] text-muted uppercase">
        {label}
      </span>
      <span aria-hidden className="h-px flex-1 bg-ink/12" />
    </div>
  );
}

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
        width={160}
        height={160}
        className="h-20 w-20 flex-none object-contain transition-transform duration-500 group-hover:scale-105"
      />
    );
  }

  return (
    <span className="flex h-20 w-20 flex-none items-center justify-center rounded-2xl bg-brand/10 font-display text-lg font-bold text-brand transition-transform duration-500 group-hover:scale-105">
      {badge.name
        .split(/\s+/)
        .filter((word) => /^[A-Z]/.test(word))
        .map((word) => word[0])
        .join("")
        .slice(0, 3)}
    </span>
  );
}
