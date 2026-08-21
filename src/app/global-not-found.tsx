import type { Metadata } from "next";
import { Instrument_Sans, Plus_Jakarta_Sans } from "next/font/google";
import { ctaClasses } from "@/components/ui";
import "./globals.css";

const instrument = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600"],
  variable: "--font-instrument",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Page not found · The 10th ICONZ",
  description: "The page you are looking for does not exist.",
};

/**
 * An address that matches no route at all — `/anything`, or a language the
 * site does not publish.
 *
 * Every route here lives under `[lang]`, which means the only layout is a
 * layout this page can never be inside: there is no language to give it. So it
 * builds its own document, carries its own styles and fonts, and speaks both
 * languages rather than guessing between them.
 *
 * Plain anchors rather than `Link`: this page is served outside the router, and
 * a full load is what puts the visitor back inside the app.
 */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${instrument.variable} ${jakarta.variable}`}>
      <body>
        <main className="mx-auto flex min-h-screen w-full max-w-[44rem] flex-col items-center justify-center px-6 py-20 text-center">
          <p className="font-sans text-xs font-semibold tracking-[0.16em] text-brand uppercase">
            Error 404
          </p>

          <h1 className="mt-3 font-display text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-ink">
            This page could not be found
          </h1>
          <p
            lang="id"
            className="mt-2.5 font-display text-[clamp(1.125rem,2.4vw,1.625rem)] leading-tight font-bold tracking-[-0.02em] text-muted"
          >
            Halaman ini tidak ditemukan
          </p>

          <p className="mt-7 max-w-lg font-sans text-[0.9375rem] leading-relaxed text-body">
            The address may have been mistyped, or the page has moved. Choose a
            language below to start again from the home page.
          </p>
          <p
            lang="id"
            className="mt-2 max-w-lg font-sans text-[0.9375rem] leading-relaxed text-muted"
          >
            Alamatnya mungkin salah ketik, atau halamannya sudah dipindahkan.
            Pilih bahasa di bawah untuk mulai lagi dari beranda.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages --
                this page is served outside the router; a full load is what
                puts the visitor back inside the app. */}
            <a href="/en" className={ctaClasses({ size: "lg" })}>
              English
            </a>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/id"
              lang="id"
              className={ctaClasses({ variant: "outline", size: "lg" })}
            >
              Bahasa Indonesia
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
