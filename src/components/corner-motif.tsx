import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ART = /\.(svg|png|webp|avif|jpe?g)$/i;

/**
 * Finds the house motif. Anything dropped into public/pattern counts, whatever
 * it is called; elsewhere under public, a name carrying "pattern" or "motif"
 * counts too. Nothing found means nothing is drawn, so the section is never
 * left with a broken frame.
 */
function motifSrc() {
  const roots: [dir: string, prefix: string][] = [
    [join(process.cwd(), "public", "pattern"), "/pattern"],
    [join(process.cwd(), "public"), ""],
    [join(process.cwd(), "public", "image"), "/image"],
  ];

  for (const [dir, prefix] of roots) {
    if (!existsSync(dir)) continue;

    const named = prefix === "/pattern";
    const file = readdirSync(dir).find(
      (name) => ART.test(name) && (named || /pattern|motif/i.test(name)),
    );

    if (file) return encodeURI(`${prefix}/${file}`);
  }

  return null;
}

/**
 * The house motif, set into two opposite corners.
 *
 * The artwork carries its own clusters at the left and right edges, so each
 * corner shows the half that already faces the right way — no rotation, no
 * mirrored glyphs. It is painted as a background rather than an element, which
 * keeps it clear of the layout, and multiplied rather than laid on top, which
 * drops the artwork's white ground against the page without needing an alpha
 * channel in the file.
 */
export function CornerMotif() {
  const src = motifSrc();
  if (!src) return null;

  const plate = {
    backgroundImage: `url("${src}")`,
    mixBlendMode: "multiply" as const,
  };

  const box =
    "pointer-events-none absolute h-[13rem] w-[15rem] bg-no-repeat opacity-70 select-none [background-size:26rem_auto] sm:h-[15rem] sm:w-[17rem] sm:[background-size:34rem_auto] lg:h-[18rem] lg:w-[21rem] lg:[background-size:42rem_auto]";

  return (
    <>
      <div
        aria-hidden
        style={{ ...plate, backgroundPosition: "right bottom" }}
        className={`${box} top-0 right-0`}
      />
      <div
        aria-hidden
        style={{ ...plate, backgroundPosition: "left bottom" }}
        className={`${box} bottom-0 left-0`}
      />
    </>
  );
}
