import type { Metadata } from "next";
import { Instrument_Sans, Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";

const instrument = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-instrument",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Panel ICONZ", template: "%s · Panel ICONZ" },
  // Nothing behind this door belongs in a search result, and the disallow in
  // robots.txt only asks politely — this is the part crawlers act on.
  robots: { index: false, follow: false, nocache: true },
};

/**
 * The second root of the app.
 *
 * The public site lives under `[lang]` and carries its own document; this one
 * carries its own too, which is what keeps the panel clear of the site bar, the
 * footer, the splash and the language switch. It is one language on purpose:
 * the people who sign in here are the committee, not the audience.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${instrument.variable} ${jakarta.variable}`}>
      <body>{children}</body>
    </html>
  );
}
