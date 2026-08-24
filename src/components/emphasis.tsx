import type { ReactNode } from "react";

/**
 * Draws the given phrases out of a paragraph by weight alone. A marker band
 * used to sit under them; on a page already carrying photographs, video and a
 * moving belt of logos it was one voice too many. Anything not matched is left
 * untouched.
 */
export function Emphasis({
  text,
  marks = [],
}: {
  text: string;
  marks?: string[];
}) {
  const present = marks.filter((mark) => mark && text.includes(mark));
  if (!present.length) return <>{text}</>;

  // Split on every phrase at once, keeping the phrases in the result.
  const pattern = new RegExp(`(${present.map(escape).join("|")})`, "g");
  const pieces: ReactNode[] = text.split(pattern).map((piece, i) =>
    present.includes(piece) ? (
      <span
        key={i}
        className="font-semibold text-ink"
      >
        {piece}
      </span>
    ) : (
      piece
    ),
  );

  return <>{pieces}</>;
}

function escape(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
