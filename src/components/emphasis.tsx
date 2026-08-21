import type { ReactNode } from "react";

/**
 * Draws the given phrases out of a paragraph with a marker stroke — a soft
 * mint band sitting under the words rather than boxing them in, so the line
 * still reads as running text. Anything not matched is left untouched.
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
        className="font-medium text-ink [background:linear-gradient(to_top,rgba(127,211,162,0.5)_0,rgba(127,211,162,0.5)_0.42em,transparent_0.42em)] [box-decoration-break:clone]"
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
