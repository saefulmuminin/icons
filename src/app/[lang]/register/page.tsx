import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarGlyph, PinGlyph } from "@/components/glyphs";
import { PhotoCarousel } from "@/components/photo-carousel";
import { PlateViewer } from "@/components/plate-viewer";
import { RegistrationGate } from "@/components/registration-gate";
import { Container, Eyebrow, PageTitle } from "@/components/ui";
import {
  conferenceRange,
  CONFERENCE,
  CONTACT,
  GALLERY,
  registrationOpensAt,
  registrationOpensOn,
} from "@/lib/content";
import { getDictionary, isLang } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

/**
 * Rendered per request, so REGISTRATION_OPENS is read when somebody opens the
 * page rather than when the site was built.
 *
 * Prerendered, the date would be baked in at build time and changing the
 * variable would appear to do nothing until the next deploy — which is exactly
 * the surprise an environment variable is supposed to spare you.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const safe = isLang(lang) ? lang : "en";
  const t = getDictionary(safe);

  return pageMetadata({
    lang: safe,
    path: "/register",
    title: t.regTitle,
    description: t.regText,
  });
}

/** An envelope, for the address the committee reads. */
function MailGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <rect
        x="1.6"
        y="3.2"
        width="12.8"
        height="9.6"
        rx="1.8"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="m2.4 4.6 5.6 4 5.6-4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** The Instagram mark: a rounded square, a lens and the corner light. */
function InstagramGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <rect
        x="2"
        y="2"
        width="12"
        height="12"
        rx="3.6"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle cx="8" cy="8" r="2.9" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="11.5" cy="4.5" r="0.85" fill="currentColor" />
    </svg>
  );
}

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const t = getDictionary(lang);

  // Read here, on the server, so the date never has to reach the browser as
  // anything but a prop.
  const opensAt = registrationOpensAt();

  return (
    <section className="relative overflow-hidden bg-paper/70">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(52rem_34rem_at_6%_-4%,rgba(30,122,69,0.1),transparent_62%),radial-gradient(44rem_30rem_at_98%_92%,rgba(214,178,58,0.16),transparent_64%)]"
      />

      {/*
        One column on a phone, in the order a reader wants it: what this page
        is, then the form itself, then the particulars underneath. On a wide
        screen the last two swap back — grid placement puts the form in its own
        column beside the pair, which the flat DOM order alone cannot express.
      */}
      <Container className="relative flex flex-col gap-8 pt-12 pb-20 sm:gap-10 sm:pt-16 sm:pb-24 lg:grid lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:gap-y-8">
        <div className="lg:col-start-1 lg:row-start-1">
          <Eyebrow>{t.register}</Eyebrow>
          <PageTitle className="max-w-[18ch]">{t.regTitle}</PageTitle>
          <p className="mt-5 max-w-[38ch] font-sans text-[1.0625rem] leading-[1.7] text-pretty text-muted">
            {t.regText}
          </p>
        </div>

        {/*
          Edge to edge on a phone: the negative margin gives back exactly the
          padding the Container took, so the panel spans the screen and the
          questions get the full width instead of a card's worth of it. The
          card returns, borders and corners and all, at the first breakpoint.
        */}
        <div className="-mx-5 border-y border-ink/10 bg-paper px-5 py-7 sm:mx-0 sm:rounded-2xl sm:border sm:p-8 lg:col-start-2 lg:row-start-1 lg:row-span-2">
          <h2 className="font-display text-[1.375rem] leading-tight font-bold">
            {opensAt ? t.regClosedTitle : t.regFormTitle}
          </h2>
          <div className="mt-6">
            <RegistrationGate
              lang={lang}
              t={t}
              opensAt={opensAt}
              opensOn={registrationOpensOn(opensAt, lang)}
            />
          </div>
        </div>

        {/* The form beside it runs long, so the particulars stay in view rather
            than scrolling away at the first question. */}
        <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
          {/* The two calls that close before the conference opens, as the
              posters themselves. A reader with a paper in a drawer is exactly
              who is on this page, and the column beside the form is where
              they will actually see them. Too small to read at this size, so
              each one opens full height on a tap. */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { src: "/image16.png", name: t.pickPapers },
              { src: "/image5.png", name: t.pickBook },
            ].map((poster) => (
              <figure key={poster.src} className="m-0">
                <PlateViewer
                  src={poster.src}
                  ratio="1080 / 1350"
                  sizes="(min-width: 1024px) 18vw, 45vw"
                  zoomLabel={t.imageZoom}
                  closeLabel={t.imageClose}
                  className="aspect-[1080/1350] w-full rounded-xl ring-1 ring-ink/10"
                />
                <figcaption className="mt-2 font-sans text-[0.6875rem] leading-[1.4] text-balance text-muted">
                  {poster.name}
                </figcaption>
              </figure>
            ))}
          </div>

          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              {
                label: t.dateOnly,
                value: conferenceRange(lang),
                Glyph: CalendarGlyph,
              },
              {
                label: t.venueLabel,
                value: CONFERENCE.venueShort,
                Glyph: PinGlyph,
              },
            ].map((fact) => (
              <div
                key={fact.label}
                className="rounded-xl border border-ink/8 bg-cream px-4 py-4"
              >
                <dt className="flex items-center gap-2 font-sans text-[0.6875rem] font-semibold tracking-[0.16em] text-muted uppercase">
                  <fact.Glyph className="size-4 text-brand" />
                  {fact.label}
                </dt>
                <dd className="mt-2 font-display text-[0.9375rem] leading-[1.45] font-semibold text-pretty">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>

          {/* Two doors the committee watches, in place of the one person's
              number this card used to carry. */}
          <div className="mt-3 rounded-xl border border-ink/8 bg-cream px-4 py-4">
            <div className="font-sans text-[0.6875rem] font-semibold tracking-[0.16em] text-muted uppercase">
              {t.regMoreInfo}
            </div>
            <ul className="mt-3 grid gap-2">
              {[
                {
                  href: `mailto:${CONTACT.email}`,
                  label: CONTACT.email,
                  Glyph: MailGlyph,
                  external: false,
                },
                {
                  href: CONTACT.instagramUrl,
                  label: CONTACT.instagram,
                  Glyph: InstagramGlyph,
                  external: true,
                },
              ].map((line) => (
                <li key={line.href}>
                  <a
                    href={line.href}
                    {...(line.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="inline-flex items-center gap-2 font-sans text-[0.875rem] font-medium text-brand no-underline transition-colors hover:text-brand-dark"
                  >
                    <line.Glyph className="size-4 flex-none" />
                    {line.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* The conference as it actually looked, which is a better argument
              for filling in the form than an illustration of one. */}
          <PhotoCarousel
            photos={GALLERY}
            prevLabel={t.galleryPrev}
            nextLabel={t.galleryNext}
            goLabel={t.galleryGo}
            className="mt-8 hidden lg:block"
          />
        </div>
      </Container>
    </section>
  );
}
