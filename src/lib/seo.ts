import type { Metadata } from "next";
import { CONFERENCE, LINKS, ORGANIZERS } from "./content";
import type { Lang } from "./i18n";
import { LANGS } from "./i18n";
import { SITE_URL } from "./site";

const SITE_NAME = "The 10th ICONZ";

/** The share card. Repeated on every page: a page that sets its own
 *  `openGraph` replaces the layout's outright, images included. */
const CARD = { url: "/og.jpg", width: 1200, height: 630, alt: SITE_NAME };

/**
 * Canonical, hreflang and social tags for one page in one language.
 *
 * Every page needs its own canonical: without one it inherits the layout's,
 * and each page then declares the home page as its canonical — which invites
 * search engines to drop the rest of the site from the index.
 */
export function pageMetadata({
  lang,
  path = "",
  title,
  description,
}: {
  lang: Lang;
  path?: string;
  title: string;
  description: string;
}): Metadata {
  const url = `${SITE_URL}/${lang}${path}`;
  const full = path === "" ? title : `${title} · ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(
          LANGS.map((other) => [other, `${SITE_URL}/${other}${path}`]),
        ),
        "x-default": `${SITE_URL}/en${path}`,
      },
    },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title: full,
      description,
      locale: lang === "id" ? "id_ID" : "en_US",
      alternateLocale: lang === "id" ? "en_US" : "id_ID",
      images: [CARD],
    },
    twitter: {
      card: "summary_large_image",
      title: full,
      description,
      images: [CARD.url],
    },
  };
}

/**
 * The conference as an Event, for search engines that surface dates, venue
 * and organisers directly in results. Built from the same data the pages
 * render, so it can never drift from what a reader sees.
 */
export function eventJsonLd(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "The 10th International Conference on Zakat",
    alternateName: "The 10th ICONZ",
    description: CONFERENCE.theme,
    startDate: CONFERENCE.startsAt,
    endDate: CONFERENCE.endsAt,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    inLanguage: lang,
    image: `${SITE_URL}/og.jpg`,
    url: `${SITE_URL}/${lang}`,
    location: {
      "@type": "Place",
      name: CONFERENCE.venueShort,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Jl. Agatis, IPB Dramaga Campus",
        addressLocality: "Bogor",
        postalCode: "16680",
        addressRegion: "West Java",
        addressCountry: "ID",
      },
    },
    organizer: ORGANIZERS.map((name) => ({ "@type": "Organization", name })),
    offers: {
      "@type": "Offer",
      url: LINKS.register,
      availability: "https://schema.org/InStock",
    },
  };
}
