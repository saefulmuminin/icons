import Image from "next/image";
import type { Edition } from "@/lib/content";
import type { Plate } from "@/lib/plates";
import { PlateViewer } from "./plate-viewer";

export type EditionPlate = Edition & {
  mark: string | null;
  posters: Plate[];
  ordinal: string;
};

const EMBED_ORIGIN = "https://www.youtube-nocookie.com";

/** Pulls the id out of a watch, live or short YouTube link. */
function videoId(href: string) {
  const match = href.match(
    /(?:youtu\.be\/|\/live\/|\/embed\/|[?&]v=)([\w-]{11})/,
  );

  return match ? match[1] : null;
}

/**
 * The archive of past editions, each folded shut until it is asked for.
 *
 * Nine editions carrying thirteen recordings and four posters between them
 * made a page nobody reached the end of. Folded, the whole archive fits on one
 * screen and a reader can see what every year holds before choosing one.
 *
 * Built on `details` rather than a component with state: the browser already
 * knows how to open and close one, announces it to assistive tech and answers
 * the keyboard — and the players inside a closed one never load at all. The
 * page ships no JavaScript for any of this.
 */
export function EditionVideos({
  editions,
  noArchiveLabel,
  filmsLabel,
  postersLabel,
  zoomLabel,
  closeLabel,
}: {
  editions: EditionPlate[];
  noArchiveLabel: string;
  filmsLabel: string;
  postersLabel: string;
  zoomLabel: string;
  closeLabel: string;
}) {
  return (
    <ol className="grid gap-3">
      {editions.map((edition, i) => {
        const films = edition.links
          .map((link) => ({ ...link, id: videoId(link.href) }))
          .filter((link) => link.id);

        // Anything that is not a recording stays an ordinary link out.
        const others = edition.links.filter((link) => !videoId(link.href));
        const holds = films.length
          ? `${films.length} ${filmsLabel}`
          : edition.posters.length
            ? `${edition.posters.length} ${postersLabel}`
            : noArchiveLabel;

        return (
          <li key={edition.year} data-reveal>
            <details
              // The most recent edition stands open, so the page never opens
              // on a column of shut doors.
              open={i === 0}
              className="group rounded-2xl border border-ink/10 bg-paper transition-colors duration-300 hover:border-brand/30 open:border-brand/25"
            >
              <summary className="flex cursor-pointer list-none items-center gap-4 p-5 sm:p-6 [&::-webkit-details-marker]:hidden">
                {edition.mark ? (
                  <Image
                    src={edition.mark}
                    alt=""
                    width={120}
                    height={120}
                    className="h-11 w-11 flex-none object-contain"
                  />
                ) : (
                  // No mark on file for this edition — its ordinal stands in,
                  // set the way the conference sets its own.
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-brand/20 bg-brand/6 font-display text-[0.875rem] font-extrabold tracking-[-0.02em] text-brand">
                    {edition.ordinal}
                  </span>
                )}

                <span className="min-w-0 flex-1">
                  <span className="font-display text-[0.6875rem] font-semibold tracking-[0.18em] text-brand uppercase">
                    {edition.year}
                  </span>
                  <span
                    lang="en"
                    className="mt-1 block font-display text-[1rem] leading-[1.35] font-semibold text-pretty text-ink"
                  >
                    {edition.title}
                  </span>
                </span>

                {/* What is inside, before it is opened. */}
                <span className="hidden flex-none font-sans text-[0.75rem] text-faint sm:block">
                  {holds}
                </span>

                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                  className="h-4 w-4 flex-none text-muted transition-transform duration-300 group-open:rotate-180"
                >
                  <path d="m4 6.5 4 4 4-4" />
                </svg>
              </summary>

              <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                {/* Only the editions whose theme is on record carry one. */}
                {edition.theme ? (
                  <p
                    lang="en"
                    className="border-t border-ink/8 pt-4 font-display text-[0.875rem] leading-[1.45] font-normal text-pretty text-muted"
                  >
                    “{edition.theme}”
                  </p>
                ) : null}

                {films.length > 0 && (
                  <div
                    className={`mt-4 grid gap-3 ${
                      films.length > 1 ? "sm:grid-cols-2" : ""
                    }`}
                  >
                    {films.map((film) => (
                      <figure key={film.href} className="min-w-0">
                        <div className="relative aspect-video overflow-hidden rounded-xl bg-black ring-1 ring-ink/10">
                          <iframe
                            src={`${EMBED_ORIGIN}/embed/${film.id}?rel=0&modestbranding=1`}
                            title={`${edition.title} — ${film.label}`}
                            loading="lazy"
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 h-full w-full border-0"
                          />
                        </div>

                        {/* Named under the frame: with two side by side, the
                            poster alone does not say which is which. */}
                        <figcaption className="mt-2 font-sans text-[0.75rem] font-medium text-muted">
                          {film.label}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                )}

                {/* No recording was ever made of the earliest editions; the
                    posters are what survives of them. */}
                {!films.length && edition.posters.length > 0 && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {/* Each frame takes its own picture's ratio: the posters
                        are square, the 2016 documentation is not, and one
                        forced into the other's box loses its edges. */}
                    {edition.posters.map((poster) => (
                      <PlateViewer
                        key={poster.src}
                        src={poster.src}
                        ratio={`${poster.width} / ${poster.height}`}
                        sizes="(min-width: 640px) 22rem, 100vw"
                        style={{
                          aspectRatio: `${poster.width} / ${poster.height}`,
                        }}
                        zoomLabel={zoomLabel}
                        closeLabel={closeLabel}
                        className="w-full self-start rounded-xl ring-1 ring-ink/10"
                      />
                    ))}
                  </div>
                )}

                {others.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {others.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-brand/28 bg-brand/6 px-3.5 py-2 font-sans text-[0.8125rem] font-semibold text-brand no-underline transition-colors hover:border-brand hover:bg-brand hover:text-white"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}

                {!films.length && !edition.posters.length && !others.length && (
                  <p className="border-t border-ink/8 pt-4 font-sans text-[0.8125rem] text-faint">
                    {noArchiveLabel}
                  </p>
                )}
              </div>
            </details>
          </li>
        );
      })}
    </ol>
  );
}
