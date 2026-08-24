"use client";

import { animate } from "animejs";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Container, Eyebrow, SectionTitle } from "@/components/ui";
import { Reveal } from "@/components/reveal";

type Objective = {
  n: string;
  text: string;
};

type ObjectivesProps = {
  title: string;
  intro: string;
  objectives: Objective[];
  /** The carousel's own words, handed in so they follow the page's language. */
  labels: { label: string; of: string; prev: string; next: string };
};

/**
 * The plates the carousel turns through. One for now — the earlier five were
 * of the previous leadership. Add more current photographs here and the
 * carousel goes back to changing picture with each objective.
 */
const DOC_PHOTOS = ["/image12.png"];

// Clean White Base Cards with subtle BAZNAS Ambient Accents (Hijau, Kuning/Gold BAZNAS, Ungu)
const CARD_THEMES = [
  {
    // 01: Hijau BAZNAS (Emerald Green)
    active:
      "bg-gradient-to-br from-[#0b3d26] via-[#125c3a] to-brand-deep text-white shadow-xl ring-2 ring-emerald-500/40",
    inactive:
      "bg-white text-ink border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/[0.04]",
    glow: "bg-emerald-400/25",
    accent: "bg-emerald-600",
    numColor: "text-emerald-700",
  },
  {
    // 02: Kuning / Emas BAZNAS (BAZNAS Amber Gold)
    active:
      "bg-gradient-to-br from-[#4a3608] via-[#6d510e] to-[#362705] text-white shadow-xl ring-2 ring-amber-400/40",
    inactive:
      "bg-white text-ink border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-500/[0.04]",
    glow: "bg-amber-400/25",
    accent: "bg-amber-500",
    numColor: "text-amber-600",
  },
  {
    // 03: Ungu Soft (Soft Purple)
    active:
      "bg-gradient-to-br from-[#2a134a] via-[#432073] to-[#1d0c35] text-white shadow-xl ring-2 ring-purple-400/40",
    inactive:
      "bg-white text-ink border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/[0.04]",
    glow: "bg-purple-400/20",
    accent: "bg-purple-600",
    numColor: "text-purple-600",
  },
  {
    // 04: Hijau Mint BAZNAS (Mint / Lime Green)
    active:
      "bg-gradient-to-br from-[#0d422a] via-[#156641] to-[#092d1c] text-white shadow-xl ring-2 ring-mint/40",
    inactive:
      "bg-white text-ink border-emerald-400/20 hover:border-emerald-400/50 hover:bg-emerald-400/[0.04]",
    glow: "bg-mint/30",
    accent: "bg-emerald-500",
    numColor: "text-emerald-600",
  },
  {
    // 05: Kuning Terang BAZNAS (Warm Yellow Gold)
    active:
      "bg-gradient-to-br from-[#3d2c07] via-[#5c430c] to-[#2b1f04] text-white shadow-xl ring-2 ring-yellow-400/40",
    inactive:
      "bg-white text-ink border-yellow-500/20 hover:border-yellow-500/50 hover:bg-yellow-500/[0.04]",
    glow: "bg-yellow-400/25",
    accent: "bg-yellow-500",
    numColor: "text-amber-600",
  },
  {
    // 06: Hijau Pekat BAZNAS (Forest Green)
    active:
      "bg-gradient-to-br from-[#0a331f] via-[#134e30] to-[#072415] text-white shadow-xl ring-2 ring-emerald-400/40",
    inactive:
      "bg-white text-ink border-emerald-600/20 hover:border-emerald-600/50 hover:bg-emerald-600/[0.04]",
    glow: "bg-emerald-500/25",
    accent: "bg-emerald-700",
    numColor: "text-emerald-700",
  },
];

export function Objectives({
  title,
  intro,
  objectives,
  labels,
}: ObjectivesProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  // Smooth photo transition animation using AnimeJS
  useEffect(() => {
    if (!photoRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    animate(photoRef.current, {
      opacity: [0.15, 1],
      scale: [1.08, 1],
      filter: ["blur(10px)", "blur(0px)"],
      duration: 700,
      ease: "outExpo",
    });
  }, [activeIndex]);

  // Smooth AnimeJS scroll to selected card
  const selectCard = (index: number) => {
    setActiveIndex(index);
    const track = trackRef.current;
    if (!track) return;
    const cardNodes = track.children;
    const targetCard = cardNodes[index] as HTMLElement;
    if (!targetCard) return;

    const targetScroll = targetCard.offsetLeft - track.offsetLeft;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      track.scrollLeft = targetScroll;
      return;
    }

    animate(track, {
      scrollLeft: targetScroll,
      duration: 650,
      ease: "outQuad",
    });
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      selectCard(activeIndex - 1);
    } else {
      selectCard(objectives.length - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < objectives.length - 1) {
      selectCard(activeIndex + 1);
    } else {
      selectCard(0);
    }
  };

  // Current documentation photo
  const currentPhoto = DOC_PHOTOS[activeIndex % DOC_PHOTOS.length];

  return (
    <section className="relative mt-16 sm:mt-24 overflow-hidden bg-paper/60 py-16 sm:py-22 border-y border-ink/10">
      <Container>
        {/* Top Header: Title on Left, Description on Right */}
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end mb-12 sm:mb-16">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-2.5">
              <Eyebrow tone="brand">02</Eyebrow>
              <div className="inline-flex items-center rounded-lg bg-white px-3 py-1 shadow-sm border border-ink/10">
                <Image
                  src="/iconz10-logo.png"
                  alt="ICONZ 10 Logo"
                  width={100}
                  height={32}
                  className="h-6 w-auto object-contain"
                />
              </div>
            </div>
            <SectionTitle className="text-ink">{title}</SectionTitle>
          </div>

          <div className="lg:col-span-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="max-w-[50ch] font-sans text-[0.9375rem] leading-[1.7] text-muted text-pretty">
              {intro}
            </p>
          </div>
        </div>

        {/* Main Section: Left Photo + Right Cards Carousel */}
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-12 items-stretch">
            {/* Left Featured Documentation Photo Container (AnimeJS Smooth Transition) */}
            <div className="lg:col-span-5 relative overflow-hidden bg-brand-deep min-h-[380px] lg:min-h-[440px]">
              <div ref={photoRef} className="absolute inset-0">
                <Image
                  src={currentPhoto}
                  alt="Dokumentasi ICONZ"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover object-center"
                  priority
                />
              </div>
            </div>

            {/* Right Side: Sliding Carousel Track for White Base Cards with BAZNAS Ambient Accents */}
            <div className="lg:col-span-7 flex flex-col justify-between overflow-hidden">
              {/* Carousel Track (2 cards visible, 3rd card ~20% peek preview) */}
              <div
                ref={trackRef}
                className="flex gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory scroll-smooth pb-3 pt-1 -mx-1 px-1"
              >
                {objectives.map((objective, i) => {
                  const isActive = i === activeIndex;
                  const theme = CARD_THEMES[i % CARD_THEMES.length];
                  return (
                    <div
                      key={objective.n}
                      onClick={() => selectCard(i)}
                      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 transition-all duration-300 cursor-pointer snap-start w-[85%] sm:w-[46%] lg:w-[44%] shrink-0 border shadow-sm hover:shadow-md ${
                        isActive ? theme.active : theme.inactive
                      }`}
                    >
                      {/* Soft ambient glowing blurred circle background ("samar-samar BAZNAS color accent") */}
                      <div
                        aria-hidden
                        className={`absolute -right-8 -bottom-8 h-28 w-28 rounded-full ${theme.glow} blur-2xl opacity-60 pointer-events-none transition-opacity duration-300 group-hover:opacity-90`}
                      />

                      {/* Top Section: Number & Accent Line */}
                      <div className="relative z-10">
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-display text-2xl font-extrabold ${
                              isActive ? "text-white" : theme.numColor
                            }`}
                          >
                            {objective.n}
                          </span>

                          <div
                            className={`h-1 w-8 rounded-full ${
                              isActive ? "bg-white/60" : theme.accent
                            }`}
                          />
                        </div>

                        <p
                          className={`mt-4 font-sans text-[0.90625rem] leading-[1.68] text-pretty ${
                            isActive ? "text-white/95" : "text-body"
                          }`}
                        >
                          {objective.text}
                        </p>
                      </div>

                      {/* Bottom Right Arrow Icon ↗ */}
                      <div className="relative z-10 mt-6 flex justify-end">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300 ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-ink/5 text-muted group-hover:bg-brand/10 group-hover:text-brand"
                          }`}
                        >
                          ↗
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Carousel Controls (← → buttons on the right under the cards) */}
              <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4">
                <div className="font-sans text-xs font-semibold tracking-wider text-muted uppercase">
                  {labels.label} {activeIndex + 1} {labels.of}{" "}
                  {objectives.length}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label={labels.prev}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-white text-ink shadow-sm hover:border-brand hover:bg-brand hover:text-white transition-all cursor-pointer"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label={labels.next}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-white text-ink shadow-sm hover:border-brand hover:bg-brand hover:text-white transition-all cursor-pointer"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
