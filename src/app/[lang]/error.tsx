"use client";

import { useEffect } from "react";
import {
  Container,
  ctaClasses,
  Cta,
  Eyebrow,
  PageTitle,
} from "@/components/ui";
import { getDictionary } from "@/lib/i18n";
import { localizedHref } from "@/lib/nav";
import { useRouteLang } from "@/lib/use-route-lang";

/**
 * A page that threw while rendering. Sits inside the layout, so the bar and
 * the footer survive the failure and there is always a way onward.
 *
 * A failure in the layout itself cannot be caught here — the boundary wraps
 * what is below it, not the layout beside it — and falls to
 * `global-error.tsx`, which builds its own document.
 */
export default function RouteError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const lang = useRouteLang();
  const t = getDictionary(lang);

  useEffect(() => {
    // The browser console is the only reporter this site has; the digest below
    // is what ties this to the server log for the same failure.
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center sm:py-32">
      <Eyebrow>{t.errorCode}</Eyebrow>
      <PageTitle className="max-w-2xl text-ink">{t.errorTitle}</PageTitle>

      <p className="mt-5 max-w-xl font-sans text-[0.9375rem] leading-relaxed text-body">
        {t.errorText}
      </p>

      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className={ctaClasses({ size: "lg" })}
        >
          {t.errorRetry}
        </button>

        <Cta href={localizedHref(lang, "")} variant="outline" size="lg">
          {t.errorHome}
        </Cta>
      </div>

      {/* Only ever a hash, never the message: a server error's own words are
          withheld from the browser precisely so they cannot leak. */}
      {error.digest ? (
        <p className="mt-12 font-sans text-xs tracking-wide text-faint">
          {t.errorRef} <span className="font-mono">{error.digest}</span>
        </p>
      ) : null}
    </Container>
  );
}
