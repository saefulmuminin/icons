import type { ReactNode } from "react";

/** A white panel with a titled head — the one container everything sits in. */
export function Card({
  title,
  note,
  action,
  children,
}: {
  title?: string;
  note?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-ink/10 bg-paper">
      {title ? (
        <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-ink/8 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 className="font-display text-[0.9375rem] font-bold text-ink">
              {title}
            </h2>
            {note ? (
              <p className="mt-1 font-sans text-[0.75rem] text-muted">{note}</p>
            ) : null}
          </div>
          {action ? <div className="ml-auto flex-none">{action}</div> : null}
        </header>
      ) : null}

      {children}
    </section>
  );
}

/** The heading block every page in the panel opens with. */
export function PageHead({
  title,
  blurb,
  action,
}: {
  title: string;
  blurb: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-7 flex flex-wrap items-start gap-x-6 gap-y-3">
      <div className="min-w-0 max-w-[46rem]">
        <h1 className="font-display text-[1.625rem] leading-tight font-extrabold tracking-[-0.025em] text-ink">
          {title}
        </h1>
        <p className="mt-2 font-sans text-[0.875rem] leading-relaxed text-muted">
          {blurb}
        </p>
      </div>
      {action ? <div className="ml-auto flex-none">{action}</div> : null}
    </header>
  );
}

/** One counted thing about the site. */
export function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-paper px-5 py-5">
      <p className="font-display text-[1.75rem] leading-none font-extrabold tracking-[-0.03em] text-brand">
        {value}
      </p>
      <p className="mt-2 font-sans text-[0.75rem] leading-snug text-muted">
        {label}
      </p>
    </div>
  );
}

/** A pill that says what state a row is in. */
export function Tag({
  children,
  tone = "brand",
}: {
  children: ReactNode;
  tone?: "brand" | "muted" | "warn";
}) {
  const tones = {
    brand: "border-brand/25 bg-brand/8 text-brand-dark",
    muted: "border-ink/12 bg-sage text-muted",
    warn: "border-[#e0c46a]/60 bg-[#fdf6e0] text-[#6b5410]",
  } as const;

  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-1 font-sans text-[0.6875rem] font-semibold whitespace-nowrap ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
