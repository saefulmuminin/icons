/**
 * The two marks that stand beside a date and a place.
 *
 * They are drawn once and shared: the footer and the registration page both
 * label the same two facts, and two copies of the same lines would drift the
 * moment one of them was tuned.
 */

const BASE = "flex-none";

export function CalendarGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={`${BASE} ${className}`}
    >
      <rect
        x="2"
        y="3"
        width="12"
        height="11"
        rx="1.8"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M2 6.6h12M5.2 1.6v2.4M10.8 1.6v2.4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PinGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={`${BASE} ${className}`}
    >
      <path
        d="M8 14.4s5-4.5 5-8a5 5 0 1 0-10 0c0 3.5 5 8 5 8Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6.2" r="1.7" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
