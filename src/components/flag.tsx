import { useId } from "react";
import type { Lang } from "@/lib/i18n";

/**
 * A language's flag, drawn rather than typed.
 *
 * Flag emoji are the one glyph Windows ships no picture for — 🇮🇩 renders there
 * as the letters "ID" — and the language toggle is precisely where a reader
 * should not have to read to know which way it goes.
 */
export function Flag({
  lang,
  className = "",
}: {
  lang: Lang;
  className?: string;
}) {
  // Two of these can sit on one page, and a clip path answers to its id alone.
  const clip = useId();
  const box = `shrink-0 rounded-[2px] ring-1 ring-inset ring-black/15 ${className}`;

  if (lang === "id") {
    return (
      <svg
        viewBox="0 0 60 40"
        preserveAspectRatio="none"
        aria-hidden
        className={box}
      >
        <rect width="60" height="20" fill="#ce1126" />
        <rect y="20" width="60" height="20" fill="#fff" />
      </svg>
    );
  }

  // The Union Jack is 2:1 and the chip is not, so it is cropped rather than
  // stretched — a squashed flag reads as a mistake, a cropped one does not.
  return (
    <svg
      viewBox="0 0 60 30"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className={box}
    >
      <clipPath id={clip}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path
        d="M0,0 L60,30 M60,0 L0,30"
        clipPath={`url(#${clip})`}
        stroke="#c8102e"
        strokeWidth="4"
      />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#c8102e" strokeWidth="6" />
    </svg>
  );
}
