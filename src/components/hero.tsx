"use client";

import {
  animate,
  createTimeline,
  onScroll,
  splitText,
  stagger,
  utils,
} from "animejs";
import Image from "next/image";
import { useEffect, useRef } from "react";
import {
  conferenceRange,
  CONFERENCE,
  CONFERENCE_LINKS,
  HERO_VIDEO,
} from "@/lib/content";
import type { Dict, Lang } from "@/lib/i18n";
import { localizedHref } from "@/lib/nav";
import { Countdown } from "./countdown";
import { HeroVideo } from "./hero-video";
import { ConferenceName, Container, Cta, Eyebrow } from "./ui";
import ipb from "@/../public/logo/IPB University.png";

/**
 * Scroll-linked range for the parallax layers: the scrub starts with the hero
 * flush to the top of the viewport and finishes as its last pixel leaves.
 * Thresholds read "<container edge> <target edge>".
 */
const SCRUB = { enter: "top top", leave: "top bottom", sync: true } as const;

export function Hero({ lang, t }: { lang: Lang; t: Dict }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = root.current;
    if (!node) return;

    const reveals = node.querySelectorAll<HTMLElement>("[data-hero]");

    // Motion-averse readers get the finished frame, never the journey.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      utils.set(reveals, { opacity: 1 });
      return;
    }

    const title = node.querySelector<HTMLElement>('[data-hero="title"]');
    const theme = node.querySelector<HTMLElement>('[data-hero="theme"]');
    const actions = node.querySelectorAll<HTMLElement>('[data-hero="action"]');
    const rail = node.querySelectorAll<HTMLElement>('[data-hero="rail"]');
    const content = node.querySelector<HTMLElement>("[data-hero-content]");
    const media = node.querySelector<HTMLElement>("[data-hero-media]");

    // The theme reveals word by word, each sliding out from behind its own
    // clip mask; the wrapper itself is uncovered up front.
    const quote = theme
      ? splitText(theme, { words: { wrap: "clip" }, chars: false })
      : null;
    if (theme) utils.set(theme, { opacity: 1 });

    const intro = createTimeline({ defaults: { ease: "outExpo" } });

    if (title) {
      intro.add(
        title,
        {
          opacity: [0, 1],
          y: [54, 0],
          filter: ["blur(16px)", "blur(0px)"],
          duration: 1500,
        },
        260,
      );
    }
    const rule = node.querySelector<HTMLElement>('[data-hero="rule"]');
    if (rule) {
      intro.add(rule, { opacity: [0, 1], scaleX: [0, 1], duration: 700 }, 560);
    }
    if (quote) {
      intro.add(
        quote.words,
        {
          opacity: [0, 1],
          y: ["115%", "0%"],
          duration: 900,
          delay: stagger(26),
        },
        620,
      );
    }
    if (actions.length) {
      intro.add(
        actions,
        {
          opacity: [0, 1],
          y: [20, 0],
          scale: [0.94, 1],
          duration: 800,
          delay: stagger(90),
        },
        980,
      );
    }
    if (rail.length) {
      intro.add(
        rail,
        { opacity: [0, 1], y: [26, 0], duration: 900, delay: stagger(110) },
        1120,
      );
    }

    // A slow push-in on the footage, then a drift keyed to the scroll. The
    // two touch different properties, so neither overwrites the other.
    const push = media
      ? animate(media, {
          scale: [1.16, 1.06],
          duration: 2400,
          ease: "outQuint",
        })
      : null;
    const drift = media
      ? animate(media, {
          y: ["-4%", "6%"],
          ease: "linear",
          autoplay: onScroll({ target: node, ...SCRUB }),
        })
      : null;
    const lift = content
      ? animate(content, {
          y: [0, -90],
          opacity: [1, 0],
          ease: "linear",
          autoplay: onScroll({ target: node, ...SCRUB }),
        })
      : null;

    return () => {
      intro.revert();
      push?.revert();
      drift?.revert();
      lift?.revert();
      quote?.revert();
    };
  }, []);

  return (
    <section
      ref={root}
      className="relative isolate -mt-[calc(var(--header-h)+1px)] flex min-h-svh flex-col overflow-hidden bg-brand-deep pt-[calc(var(--header-h)+1px)] text-white"
    >
      <HeroVideo
        videoId={HERO_VIDEO.id}
        title={HERO_VIDEO.title}
        soundOnLabel={t.heroSoundOn}
        soundOffLabel={t.heroSoundOff}
        comingSoonLabel={t.heroComingSoon}
        dates={conferenceRange(lang)}
      />

      <Container className="relative flex flex-1 flex-col justify-center pt-16 pb-14 sm:pt-20 sm:pb-16">
        <div data-hero-content className="max-w-184">
          <h1
            data-hero="title"
            className="-ml-[0.055em] font-display text-[clamp(2.625rem,6.1vw,5.5rem)] leading-[0.98] font-extrabold tracking-[-0.038em] text-balance [text-shadow:0_2px_28px_rgba(4,20,13,0.55)]"
          >
            <ConferenceName />
          </h1>

          <p
            data-hero="theme"
            lang="en"
            className="mt-6 max-w-[40ch] font-display text-[clamp(1.1875rem,2.15vw,1.75rem)] leading-[1.36] font-normal text-pretty text-mint-pale"
          >
            “{CONFERENCE.theme}”
          </p>

          <div className="mt-8 flex flex-wrap gap-3.5">
            <span data-hero="action" className="inline-block">
              <Cta
                href={localizedHref(lang, "/register")}
                variant="light"
                size="lg"
              >
                {t.heroCta1}
              </Cta>
            </span>
            <span data-hero="action" className="inline-block">
              <Cta
                href={localizedHref(lang, "/call-for-paper")}
                variant="ghost"
                size="lg"
              >
                {t.heroCta2}
              </Cta>
            </span>
          </div>
        </div>
      </Container>

      {/* Key facts rail, glassed over the footage */}
      <div className="relative border-t border-white/15 bg-[rgba(7,33,22,0.5)] backdrop-blur-md">
        <Container className="grid gap-y-6 py-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)_minmax(0,1fr)] md:gap-y-0 md:py-7">
          <div data-hero="rail" className="md:pr-8">
            <Eyebrow tone="mint">{t.dateOnly}</Eyebrow>
            <a
              href={CONFERENCE_LINKS.calendar}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-1.5 block no-underline"
            >
              <span className="block font-display text-[1.375rem] leading-[1.3] font-bold transition-colors group-hover:text-mint-soft">
                {conferenceRange(lang)}
              </span>
              <span className="mt-1.5 inline-flex items-center gap-1.5 font-sans text-xs font-medium text-white/60 transition-colors group-hover:text-white">
                <CalendarGlyph />
                {t.calendarCta}
              </span>
            </a>
          </div>

          <div
            data-hero="rail"
            className="md:border-x md:border-white/12 md:px-8"
          >
            <Eyebrow tone="mint">{t.venueLabel}</Eyebrow>
            <a
              href={CONFERENCE_LINKS.map}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-1.5 block no-underline"
            >
              <span className="flex items-start gap-3">
                <Image
                  src={ipb}
                  alt="IPB University"
                  className="mt-0.5 h-9 w-9 flex-none"
                />
                <span className="font-sans text-sm leading-[1.55] text-white/78 transition-colors group-hover:text-white">
                  {CONFERENCE.venueShort}
                </span>
              </span>
              <span className="mt-2 inline-flex items-center gap-1.5 font-sans text-xs font-medium text-white/60 transition-colors group-hover:text-white">
                <PinGlyph />
                {t.mapCta}
              </span>
            </a>
          </div>

          <div data-hero="rail" className="md:pl-8">
            <Eyebrow tone="mint">{t.countdownLabel}</Eyebrow>
            <Countdown t={t} />
          </div>
        </Container>
      </div>
    </section>
  );
}

function CalendarGlyph() {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden className="h-3.5 w-3.5">
      <rect
        x="1.6"
        y="2.6"
        width="10.8"
        height="9.8"
        rx="1.6"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M1.6 5.8h10.8M4.6 1.4v2.2M9.4 1.4v2.2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PinGlyph() {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden className="h-3.5 w-3.5">
      <path
        d="M7 12.6s4.4-4 4.4-7a4.4 4.4 0 1 0-8.8 0c0 3 4.4 7 4.4 7Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
