import Image from "next/image";
import type { Edition } from "@/lib/content";

export type EditionPlate = Edition & { mark: string | null; ordinal: string };

const EMBED_ORIGIN = "https://www.youtube-nocookie.com";

/** Pulls the id out of a watch, live or short YouTube link. */
function videoId(href: string) {
  const match = href.match(
    /(?:youtu\.be\/|\/live\/|\/embed\/|[?&]v=)([\w-]{11})/,
  );

  return match ? match[1] : null;
}

/**
 * The archive of past editions, each with its recordings playing in place.
 *
 * The recordings used to sit behind buttons that opened a player over the
 * page. They are the reason anyone comes to this page, so they are simply on
 * it now — no click to find out what is there. Every frame loads lazily, which
 * is what keeps a dozen players on one page from costing anything until they
 * are scrolled to.
 *
 * No state and no player to dismiss, so this is a server component: the page
 * ships none of it to the browser.
 */
export function EditionVideos({
  editions,
  noArchiveLabel,
}: {
  editions: EditionPlate[];
  noArchiveLabel: string;
}) {
  return (
    <ol className="grid gap-4">
      {editions.map((edition) => {
        const films = edition.links
          .map((link) => ({ ...link, id: videoId(link.href) }))
          .filter((link) => link.id);

        // Anything that is not a recording stays an ordinary link out.
        const others = edition.links.filter((link) => !videoId(link.href));

        return (
          <li
            key={edition.year}
            data-reveal
            className="flex flex-col rounded-2xl border border-ink/10 bg-paper p-6 transition-colors duration-300 hover:border-brand/30"
          >
            <div className="flex items-start gap-4">
              {edition.mark ? (
                <Image
                  src={edition.mark}
                  alt=""
                  width={120}
                  height={120}
                  className="h-12 w-12 flex-none object-contain"
                />
              ) : (
                // No mark on file for this edition — its ordinal stands in,
                // set the way the conference sets its own.
                <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl border border-brand/20 bg-brand/6 font-display text-[0.9375rem] font-extrabold tracking-[-0.02em] text-brand">
                  {edition.ordinal}
                </span>
              )}

              <div>
                <span className="font-display text-[0.6875rem] font-semibold tracking-[0.18em] text-brand uppercase">
                  {edition.year}
                </span>
                <h2
                  lang="en"
                  className="mt-1.5 font-display text-[1.0625rem] leading-[1.35] font-semibold text-pretty text-ink"
                >
                  {edition.title}
                </h2>
              </div>
            </div>

            {films.length > 0 && (
              <div
                className={`mt-5 grid gap-3 ${
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

                    {/* Named under the frame: with two side by side, the poster
                        alone does not say which is the opening and which the
                        second day. */}
                    <figcaption className="mt-2 font-sans text-[0.75rem] font-medium text-muted">
                      {film.label}
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}

            {others.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
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

            {edition.links.length === 0 && (
              <p className="mt-5 font-sans text-[0.8125rem] text-faint">
                {noArchiveLabel}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
