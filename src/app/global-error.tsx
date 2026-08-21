"use client";

import { ctaClasses } from "@/components/ui";
import "./globals.css";

/**
 * The last boundary: a failure in the root layout itself, which every other
 * boundary sits inside and so cannot catch. It replaces the document, which is
 * why it declares one.
 *
 * No `next/font` here on purpose — this renders on the path where something has
 * already gone wrong, so it leans on the system stack the theme falls back to
 * rather than a second webfont it would have to fetch first. It also cannot
 * know the language, having no layout above it, so it says both.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <title>Something went wrong · The 10th ICONZ</title>

        <main className="mx-auto flex min-h-screen w-full max-w-[44rem] flex-col items-center justify-center px-6 py-20 text-center">
          <p className="font-sans text-xs font-semibold tracking-[0.16em] text-brand uppercase">
            Error
          </p>

          <h1 className="mt-3 font-display text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-ink">
            Something went wrong
          </h1>
          <p
            lang="id"
            className="mt-2.5 font-display text-[clamp(1.125rem,2.4vw,1.625rem)] leading-tight font-bold tracking-[-0.02em] text-muted"
          >
            Terjadi kesalahan
          </p>

          <p className="mt-7 max-w-lg font-sans text-[0.9375rem] leading-relaxed text-body">
            The site could not finish loading this page. Trying again often
            clears it.
          </p>
          <p
            lang="id"
            className="mt-2 max-w-lg font-sans text-[0.9375rem] leading-relaxed text-muted"
          >
            Situs gagal menyelesaikan pemuatan halaman ini. Biasanya cukup
            dicoba lagi.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => retry()}
              className={ctaClasses({ size: "lg" })}
            >
              Try again · Coba lagi
            </button>

            {/* eslint-disable-next-line @next/next/no-html-link-for-pages --
                the router is exactly what has just failed here, so this leaves
                by reloading rather than by asking it to navigate. */}
            <a
              href="/en"
              className={ctaClasses({ variant: "outline", size: "lg" })}
            >
              Home · Beranda
            </a>
          </div>

          {error.digest ? (
            <p className="mt-12 font-sans text-xs tracking-wide text-faint">
              Reference · Kode rujukan{" "}
              <span className="font-mono">{error.digest}</span>
            </p>
          ) : null}
        </main>
      </body>
    </html>
  );
}
