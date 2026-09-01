"use client";

import { useSyncExternalStore } from "react";
import { RegistrationForm } from "@/components/registration-form";
import { clock } from "@/lib/clock";
import type { Dict, Lang } from "@/lib/i18n";

/**
 * The form, or the date it opens.
 *
 * The decision is made against a live clock rather than at build time, so the
 * form appears on its own the moment registration opens — no deploy, and
 * nobody has to remember to do it on the morning.
 *
 * `getServerSnapshot` returns null, so the prerendered markup is the closed
 * state and hydration cannot mismatch. Closed is the right thing to render
 * blind anyway: showing a form that is not open yet is worse than the reverse.
 */
export function RegistrationGate({
  lang,
  t,
  opensAt,
  opensOn,
}: {
  lang: Lang;
  t: Dict;
  /** ISO timestamp, or null once registration is simply open. */
  opensAt: string | null;
  /** That date in words, already in the reader's language. */
  opensOn: string;
}) {
  const now = useSyncExternalStore(
    clock.subscribe,
    clock.getSnapshot,
    clock.getServerSnapshot,
  );

  if (!opensAt) return <RegistrationForm lang={lang} t={t} />;

  const target = Date.parse(opensAt);
  if (now !== null && now >= target) {
    return <RegistrationForm lang={lang} t={t} />;
  }

  // A dash rather than a zero until the clock is live: zeroes read as "it is
  // open now", which is the one thing this panel must not say by accident.
  const left = now === null ? null : Math.max(0, target - now);
  const pad = (n: number) => String(n).padStart(2, "0");

  const cells =
    left === null
      ? [
          { value: "–", label: t.cdD },
          { value: "––", label: t.cdH },
          { value: "––", label: t.cdM },
          { value: "––", label: t.cdS },
        ]
      : [
          { value: String(Math.floor(left / 86_400_000)), label: t.cdD },
          { value: pad(Math.floor(left / 3_600_000) % 24), label: t.cdH },
          { value: pad(Math.floor(left / 60_000) % 60), label: t.cdM },
          { value: pad(Math.floor(left / 1000) % 60), label: t.cdS },
        ];

  return (
    <div className="text-center">
      <div className="font-sans text-[0.6875rem] font-semibold tracking-[0.16em] text-brand uppercase">
        {t.regClosedOn}
      </div>
      <h2 className="mt-2 font-display text-[clamp(1.25rem,2.4vw,1.75rem)] leading-tight font-bold text-ink">
        {opensOn}
      </h2>
      <p className="mx-auto mt-3 max-w-[34ch] font-sans text-[0.9375rem] leading-[1.65] text-pretty text-muted">
        {t.regClosedNote}
      </p>

      <div
        className="mt-7 grid grid-cols-4 gap-2"
        role="timer"
        aria-live="off"
        aria-label={t.regClosedTitle}
      >
        {cells.map((cell) => (
          <div
            key={cell.label}
            className="rounded-xl border border-ink/10 bg-cream px-2 py-3"
          >
            <div className="font-display text-[1.375rem] leading-[1.25] font-bold tabular-nums text-ink">
              {cell.value}
            </div>
            <div className="mt-1 font-sans text-[0.6875rem] tracking-[0.12em] text-muted uppercase">
              {cell.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
