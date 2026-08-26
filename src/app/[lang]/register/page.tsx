import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container, Eyebrow, PageTitle } from "@/components/ui";
import { CONFERENCE, LINKS } from "@/lib/content";
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

      <Container className="relative grid gap-10 pt-12 pb-20 sm:pt-16 sm:pb-24 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:gap-14">
        <div>
          <Eyebrow>{t.register}</Eyebrow>
          <PageTitle className="max-w-[18ch]">{t.regTitle}</PageTitle>
          <p className="mt-5 max-w-[38ch] font-sans text-[1.0625rem] leading-[1.7] text-pretty text-muted">
            {t.regText}
          </p>

          <dl className="mt-7 grid gap-3 sm:grid-cols-2">
            {[
              { label: t.dateOnly, value: CONFERENCE.dateRange },
              { label: t.venueLabel, value: CONFERENCE.venueShort },
            ].map((fact) => (
              <div
                key={fact.label}
                className="rounded-xl border border-ink/8 bg-cream px-4 py-4"
              >
                <dt className="font-sans text-[0.6875rem] font-semibold tracking-[0.16em] text-muted uppercase">
                  {fact.label}
                </dt>
                <dd className="mt-2 font-display text-[0.9375rem] leading-[1.45] font-semibold text-pretty">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>

          {/* A photograph, so it brings its own ground — the tinted shape the
              cut-out used to stand on would only show at the corners. */}
          <div className="relative mt-8">
            <Image
              src="/image/pendaftaran.jpg"
              alt=""
              priority
              width={1600}
              height={1069}
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="h-auto w-full rounded-2xl ring-1 ring-ink/10"
            />
          </div>
        </div>

        <div>
          <div className="overflow-hidden rounded-2xl border border-ink/10 bg-paper">
            <iframe
              src={LINKS.registerEmbed}
              title={t.regTitle}
              loading="lazy"
              className="h-[46rem] w-full"
            />
          </div>

          {/* Some browsers refuse embedded forms outright; this is the way
              through when that happens. */}
          <p className="mt-4 font-sans text-[0.8125rem] text-muted">
            <a
              href={LINKS.register}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand no-underline transition-colors hover:text-brand-dark"
            >
              {t.registerNewTab} →
            </a>
          </p>
        </div>
      </Container>
    </section>
  );
}
