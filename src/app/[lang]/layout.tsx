import type { Metadata } from "next";
import { Instrument_Sans, Plus_Jakarta_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { RouteLoader } from "@/components/route-loader";
import { SPLASH_GUARD, Splash } from "@/components/splash";
import { SiteHeader } from "@/components/site-header";
import { ToTop } from "@/components/to-top";
import { CONFERENCE } from "@/lib/content";
import { getDictionary, isLang, LANGS } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

const instrument = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-instrument",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isId = lang === "id";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: "The 10th International Conference on Zakat",
      template: "%s · The 10th ICONZ",
    },
    description: isId
      ? `Konferensi internasional ke-10 tentang zakat dan filantropi. ${CONFERENCE.dateRange}, IPB Dramaga Campus, Bogor, Indonesia.`
      : `The 10th international conference on zakat and philanthropy. ${CONFERENCE.dateRange}, IPB Dramaga Campus, Bogor, Indonesia.`,
    // No canonical here: each page sets its own, and a canonical set at the
    // layout would point every page at the home page.
    openGraph: {
      siteName: "The 10th ICONZ",
      title: "The 10th International Conference on Zakat",
      description: CONFERENCE.theme,
      locale: isId ? "id_ID" : "en_US",
      type: "website",
      images: [{ url: "/og.jpg", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", images: ["/og.jpg"] },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const t = getDictionary(lang);

  return (
    // `data-scroll-behavior` lets Next park the smooth scrolling below during
    // route changes, so navigating a page still lands instantly at the top.
    //
    // The splash guard below stamps `data-splash` on this element before React
    // hydrates, which is the whole point — it has to beat the first paint. That
    // makes the attribute list differ from the server's by design, so the
    // mismatch is suppressed here rather than left to warn on every load.
    <html
      lang={lang}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${instrument.variable} ${jakarta.variable}`}
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: SPLASH_GUARD }} />
        <Splash skipLabel={t.splashSkip} />
        <RouteLoader label={t.loading} />

        <noscript>
          <style>{`[data-hero], [data-reveal] { opacity: 1 }`}</style>
        </noscript>
        <div className="flex min-h-screen flex-col">
          <SiteHeader lang={lang} t={t} />
          <main className="flex-1">{children}</main>
          <SiteFooter lang={lang} t={t} />
        </div>

        <ToTop label={t.toTop} />
      </body>
    </html>
  );
}
