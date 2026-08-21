import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1240px] px-5 sm:px-7 ${className}`}>
      {children}
    </div>
  );
}

export function Eyebrow({
  children,
  tone = "brand",
}: {
  children: ReactNode;
  tone?: "brand" | "muted" | "mint";
}) {
  const tones = {
    brand: "text-brand",
    muted: "text-muted",
    mint: "text-mint-dim",
  } as const;

  return (
    <div
      className={`font-sans text-xs font-semibold tracking-[0.16em] uppercase ${tones[tone]}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`mt-2.5 font-display text-[clamp(1.75rem,3vw,2.625rem)] leading-[1.08] font-bold tracking-[-0.02em] ${className}`}
    >
      {children}
    </h2>
  );
}

export function PageTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={`mt-3 font-display text-[clamp(2.125rem,4.4vw,3.75rem)] leading-[1.05] font-extrabold tracking-[-0.03em] ${className}`}
    >
      {children}
    </h1>
  );
}

const variants = {
  /** Solid green — the primary action on light backgrounds. */
  primary:
    "bg-brand text-white hover:bg-brand-dark focus-visible:outline-brand-dark",
  /** Outlined — the secondary action on light backgrounds. */
  outline:
    "border border-ink/20 text-ink hover:border-brand hover:text-brand focus-visible:outline-brand",
  /** Solid white — the primary action on dark backgrounds. */
  light:
    "bg-white text-brand-deep hover:bg-mint-pale focus-visible:outline-white",
  /** Outlined white — the secondary action on dark backgrounds. */
  ghost:
    "border border-white/40 text-white hover:border-white hover:bg-white/10 focus-visible:outline-white",
} as const;

const sizes = {
  sm: "px-4 py-2 text-[0.8125rem]",
  md: "px-[1.375rem] py-[0.8125rem] text-sm",
  lg: "px-[1.625rem] py-[0.9375rem] text-[0.9375rem]",
} as const;

/** The pill's classes, shared with anything that must look like a Cta but
 *  is not a link — the registration button, for one. */
export function ctaClasses({
  variant = "primary",
  size = "md",
  className = "",
}: {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
} = {}) {
  return `inline-block rounded-full font-display font-bold no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${variants[variant]} ${sizes[size]} ${className}`;
}

type CtaProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
} & ComponentProps<typeof Link>;

/** Pill-shaped call to action. Renders an external anchor when href is absolute. */
export function Cta({
  variant = "primary",
  size = "md",
  className = "",
  href,
  children,
  ...rest
}: CtaProps) {
  const classes = ctaClasses({ variant, size, className });
  const isExternal = typeof href === "string" && /^https?:\/\//.test(href);

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}

/**
 * "The 10th International Conference on Zakat" with a superscript ordinal.
 * The official name stays English in both editions, so it carries `lang` to
 * keep assistive tech from reading it as Indonesian.
 */
export function ConferenceName() {
  return (
    <span lang="en">
      The 10<span className="align-super text-[0.5em]">th</span> International
      Conference on Zakat
    </span>
  );
}
