import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarGlyph, PinGlyph } from "@/components/glyphs";
import { PhotoCarousel } from "@/components/photo-carousel";
import { PlateViewer } from "@/components/plate-viewer";
import { RegistrationForm } from "@/components/registration-form";
import { Container, Eyebrow, PageTitle } from "@/components/ui";
import { CONFERENCE, CONTACT, GALLERY } from "@/lib/content";
import { getDictionary, isLang } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

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

/** The WhatsApp glyph, so the number reads as a tap-through rather than a
 *  string of digits to copy out by hand. */
function WhatsAppMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className="size-4 flex-none"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.465 3.488" />
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
            {t.regFormTitle}
          </h2>
          <div className="mt-6">
            <RegistrationForm lang={lang} t={t} />
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
                value: CONFERENCE.dateRange,
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

          {/* The number the form used to carry in its own preamble, kept where
              a reader stuck on a question can still find it — and a face to
              put to it, so writing to a stranger feels less like one. */}
          <div className="mt-3 rounded-xl border border-ink/8 bg-cream px-4 py-4">
            <div className="font-sans text-[0.6875rem] font-semibold tracking-[0.16em] text-muted uppercase">
              {t.regContact}
            </div>
            <div className="mt-3 flex items-center gap-3">
              {/* The portrait is a cut-out on white, so the circle it sits in
                  is white too rather than the card's cream. */}
              <Image
                src={CONTACT.photo}
                alt=""
                width={200}
                height={200}
                className="size-12 flex-none rounded-full bg-paper object-cover ring-1 ring-ink/10"
              />
              <div className="min-w-0">
                <div className="font-display text-[0.9375rem] leading-tight font-semibold">
                  {CONTACT.name}
                </div>
                <a
                  href={CONTACT.wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1.5 font-sans text-[0.8125rem] font-medium text-brand no-underline transition-colors hover:text-brand-dark"
                >
                  <WhatsAppMark />
                  {/* The glyph carries the meaning for anyone who can see it;
                      this is the same word for anyone who cannot. */}
                  <span className="sr-only">WhatsApp</span>
                  {CONTACT.phone}
                </a>
              </div>
            </div>
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
