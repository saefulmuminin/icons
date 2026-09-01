import type { Lang } from "./i18n";
import { INVITED_SPEAKERS } from "./speakers";

export const CONFERENCE = {
  startsAt: "2026-12-01T08:00:00+07:00",
  endsAt: "2026-12-03T17:00:00+07:00",
  venue:
    "Faculty of Economics and Management (FEM), Jl. Agatis, IPB Dramaga Campus, Bogor 16680, West Java, Indonesia",
  venueShort:
    "Faculty of Economics and Management (FEM), IPB Dramaga Campus, Bogor",
  theme:
    "From Local Impact to Global Solidarity: The Future of Zakat and Philanthropy",
  /** The search string that lands Google Maps on the venue. */
  mapQuery:
    "Fakultas Ekonomi dan Manajemen IPB University, Jalan Agatis, Dramaga, Bogor",
} as const;

/** A date at midnight UTC, from the date part alone.
 *
 * Read with `new Date` instead, the timestamp resolves against the machine's
 * clock, and any server west of Jakarta names the day before. */
const dayOf = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

/**
 * The run of dates, written out in one language or the other.
 *
 * Spelled from startsAt and endsAt rather than typed beside them: the two had
 * already drifted apart once, and a poster reading November while the register
 * says December is the kind of mistake nobody catches until someone books a
 * flight.
 */
export function conferenceRange(lang: Lang) {
  const locale = lang === "id" ? "id-ID" : "en-GB";
  const from = dayOf(CONFERENCE.startsAt);
  const to = dayOf(CONFERENCE.endsAt);
  const on = (d: Date, opts: Intl.DateTimeFormatOptions) =>
    d.toLocaleDateString(locale, { ...opts, timeZone: "UTC" });

  // Within one month the month is said once, at the end.
  return from.getUTCMonth() === to.getUTCMonth() &&
    from.getUTCFullYear() === to.getUTCFullYear()
    ? `${from.getUTCDate()} – ${to.getUTCDate()} ${on(to, { month: "long", year: "numeric" })}`
    : `${on(from, { day: "numeric", month: "long" })} – ${on(to, { day: "numeric", month: "long", year: "numeric" })}`;
}

/** When registration opens, unless the environment says otherwise. */
const OPENS_BY_DEFAULT = "2026-10-01T08:00:00+07:00";

/**
 * When the registration form opens, or null if it is open now.
 *
 * REGISTRATION_OPENS overrides the date above, which is what lets staging take
 * test submissions while production stays shut. Set it to "open" there and the
 * form is live; leave it unset everywhere else and the date in code applies.
 *
 * A value that is neither falls back to that date rather than opening the
 * form. A typo should not start taking real registrations three months early,
 * and it says so in the log on the way past.
 */
export function registrationOpensAt(
  env: Record<string, string | undefined> = process.env,
): string | null {
  const raw = env.REGISTRATION_OPENS?.trim();

  if (!raw) return OPENS_BY_DEFAULT;
  if (/^(open|now)$/i.test(raw)) return null;

  // Shape first, then parse. Date.parse is lenient enough to read "22 sept" as
  // a real date in the past — which would open the form rather than hold it.
  const ISO =
    /^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2})?(\.\d+)?(Z|[+-]\d{2}:?\d{2})?)?$/;

  if (!ISO.test(raw) || Number.isNaN(Date.parse(raw))) {
    console.error(
      "[registration] REGISTRATION_OPENS is not a date: %o — holding to %s",
      raw,
      OPENS_BY_DEFAULT,
    );
    return OPENS_BY_DEFAULT;
  }

  return raw;
}

/** That date, written out in the reader's own language. */
export function registrationOpensOn(opensAt: string | null, lang: Lang) {
  if (!opensAt) return "";

  return dayOf(opensAt).toLocaleDateString(lang === "id" ? "id-ID" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** How many days the conference runs, counted from its own two dates. */
const CONFERENCE_DAYS =
  Math.round(
    (new Date(CONFERENCE.endsAt).setHours(0, 0, 0, 0) -
      new Date(CONFERENCE.startsAt).setHours(0, 0, 0, 0)) /
      86_400_000,
  ) + 1;

/** Google's compact UTC stamp, e.g. 20261124T010000Z. */
const stamp = (iso: string) =>
  new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "");

/** One-click handoffs to the reader's calendar and map. */
export const CONFERENCE_LINKS = {
  calendar: `https://calendar.google.com/calendar/render?${new URLSearchParams({
    action: "TEMPLATE",
    text: "The 10th International Conference on Zakat",
    dates: `${stamp(CONFERENCE.startsAt)}/${stamp(CONFERENCE.endsAt)}`,
    details: `“${CONFERENCE.theme}”`,
    location: CONFERENCE.venue,
  })}`,
  map: `https://www.google.com/maps/search/?${new URLSearchParams({
    api: "1",
    query: CONFERENCE.mapQuery,
  })}`,
  /** The same place, ready to drop into an iframe — no API key needed. */
  mapEmbed: `https://www.google.com/maps?${new URLSearchParams({
    q: CONFERENCE.mapQuery,
    output: "embed",
  })}`,
} as const;

/** ICONZ 9 recap reel (BAZNAS TV), used as the landing page backdrop. */
export const HERO_VIDEO = {
  id: "ZOGw2F9v_lU",
  title: "International Conference on Zakat 2025 — ICONZ 9 recap",
} as const;

/**
 * Photographs from the previous conference, shown as a carousel beside the
 * registration form. Dimensions are carried with each one so the frame is
 * reserved before the picture lands and the column does not jump.
 */
export const GALLERY = [
  { src: "/documentasi/image.png", width: 2000, height: 1333 },
  { src: "/documentasi/image%20copy.png", width: 1200, height: 800 },
  { src: "/documentasi/image%20copy%202.png", width: 750, height: 500 },
  { src: "/documentasi/image%20copy%203.png", width: 1600, height: 1200 },
  { src: "/documentasi/image%20copy%204.png", width: 1600, height: 1200 },
] as const;

/**
 * Where a question about the conference goes.
 *
 * Two doors the committee actually watches, rather than one person's phone:
 * whoever is on the desk that week answers either. `instagram` is the handle
 * as it is written and read; the URL is the same name without the @, which is
 * the only shape the address bar takes.
 */
export const CONTACT = {
  email: "iconz@baznas.go.id",
  instagram: "@puskasbaznas",
  instagramUrl: "https://www.instagram.com/puskasbaznas",
} as const;

export const LINKS = {
  /** Where an author actually files a paper. */
  submission: "https://bazn.as/ICONZ10FullPaperSubmission",
  /** The back issues, which is a different door to the one above. */
  archive:
    "https://iconzbaznas.com/submission/index.php/proceedings/issue/archive",
  template: "https://bazn.as/TemplateCallForPaperICONZ",
} as const;

const OBJECTIVES: Record<Lang, string[]> = {
  en: [
    "To serve as an international forum discussing the transformation of zakat and philanthropy's role from local impact toward global solidarity in responding to transnational poverty, inequality, and humanitarian crises.",
    "To encourage knowledge exchange through the dissemination of the latest research findings, case studies, and proven impactful zakat and philanthropy management practices from various countries.",
    "To strengthen global collaboration among zakat institutions, philanthropic organizations, academics, governments, and related sectors in building an interconnected and sustainable zakat and philanthropy ecosystem.",
    "To identify strategic challenges, barriers, and opportunities in zakat and philanthropy management to expand social impact from the community level to a global scale.",
    "To formulate policy recommendations and strategic frameworks for policymakers and zakat managers to enhance the effectiveness of zakat and philanthropy in supporting human development and collective welfare.",
    "To stimulate scientific work and strategic publications that enrich global literature on zakat and philanthropy, while reinforcing the positioning of zakat as an international social development instrument.",
  ],
  id: [
    "Menjadi forum internasional yang membahas transformasi peran zakat dan filantropi dari dampak lokal menuju solidaritas global dalam merespons kemiskinan transnasional, ketimpangan, dan krisis kemanusiaan.",
    "Mendorong pertukaran pengetahuan melalui diseminasi hasil riset terbaru, studi kasus, dan praktik pengelolaan zakat serta filantropi yang terbukti berdampak dari berbagai negara.",
    "Memperkuat kolaborasi global antara lembaga zakat, organisasi filantropi, akademisi, pemerintah, dan sektor terkait dalam membangun ekosistem zakat dan filantropi yang terhubung dan berkelanjutan.",
    "Mengidentifikasi tantangan strategis, hambatan, dan peluang dalam pengelolaan zakat dan filantropi untuk memperluas dampak sosial dari tingkat komunitas ke skala global.",
    "Merumuskan rekomendasi kebijakan dan kerangka strategis bagi pembuat kebijakan dan pengelola zakat untuk meningkatkan efektivitas zakat dan filantropi dalam mendukung pembangunan manusia dan kesejahteraan bersama.",
    "Mendorong karya ilmiah dan publikasi strategis yang memperkaya literatur global tentang zakat dan filantropi, sekaligus memperkuat posisi zakat sebagai instrumen pembangunan sosial internasional.",
  ],
};

const PARTICIPANTS: Record<Lang, string[]> = {
  en: [
    "Practitioners from Zakat Management Agencies, including BAZNAS, LAZ, and International Zakat Institutions",
    "Academics (lecturers and students) and researchers",
    "Officials and staff from relevant government agencies",
    "Stakeholders from non-governmental organizations (NGOs)",
    "Other zakat stakeholders",
    "The general public",
  ],
  id: [
    "Praktisi lembaga pengelola zakat, termasuk BAZNAS, LAZ, dan lembaga zakat internasional",
    "Akademisi (dosen dan mahasiswa) serta peneliti",
    "Pejabat dan staf instansi pemerintah terkait",
    "Pemangku kepentingan organisasi non-pemerintah (NGO)",
    "Pemangku kepentingan zakat lainnya",
    "Masyarakat umum",
  ],
};

/**
 * The second call: a chapter for the edited volume, which runs alongside the
 * call for papers rather than instead of it.
 */
export const BOOK_CHAPTER = {
  theme: "Zakat and Well-being",
  editors: [
    {
      name: "Prof. Dr. Abdul Ghafar Ismail",
      at: "Universiti Kebangsaan Malaysia (UKM)",
      scopus: "https://www.scopus.com/authid/detail.uri?authorId=36987804600",
    },
    {
      name: "Dr. Muhammad Hasbi Zaenal",
      at: "Badan Amil Zakat Nasional · UIN Syarif Hidayatullah Jakarta",
      scopus: "https://www.scopus.com/authid/detail.uri?authorId=57896475700",
    },
    {
      name: "Prof. Dr. Irfan Syauqi Beik",
      at: "IPB University, Indonesia",
      scopus: "https://www.scopus.com/authid/detail.uri?authorId=57191277172",
    },
    {
      name: "Assoc. Prof. Dr. Salman Ahmed Shaikh",
      at: "International Islamic University of Malaysia (IIUM)",
      scopus: "https://www.scopus.com/authid/detail.uri?authorId=57193154814",
    },
  ],
  publishers: ["Springer", "Palgrave Macmillan", "Emerald"],
  links: {
    submission: "https://bazn.as/ICONZ10CFBSubmission",
    guidelines: "https://bazn.as/AuthorGuidelinesCFBICONZ10",
    template: "https://bazn.as/TemplateCallforBookChapter",
  },
} as const;

const BOOK_DATES: Record<Lang, [label: string, date: string][]> = {
  en: [
    ["Full book chapter submission", "1 November 2026"],
    ["Notification of acceptance", "17 November 2026"],
    ["Conference & chapter presentation", "1–3 December 2026"],
  ],
  id: [
    ["Pengiriman bab lengkap", "1 November 2026"],
    ["Pemberitahuan penerimaan", "17 November 2026"],
    ["Konferensi & presentasi bab", "1–3 Desember 2026"],
  ],
};

export function getBookDates(lang: Lang) {
  return BOOK_DATES[lang].map(([label, date]) => ({ label, date }));
}

export const SUBTHEMES: string[] = [
  "From Local Zakat Programs to Global Solidarity Pathways of Cross Country Collaboration",
  "Zakat and Philanthropy for Global Poverty Reduction and Shared Prosperity",
  "Governance and Institutional Models of Zakat and Philanthropy in a Global Context",
  "Zakat, Philanthropy, and Humanitarian Response in Cross Border Crises",
  "Integrating Zakat and Philanthropy into Global Social Protection and Welfare Systems",
  "Zakat and Philanthropy for Inclusive Economic Empowerment and MSME Development",
  "Evidence Based Impact Measurement of Zakat and Philanthropy from Local to Global Scale",
  "Zakat, Philanthropy, and Sustainable Development Linking Social Justice and Environmental Responsibility",
  "Strengthening Global Zakat and Philanthropy Ecosystems through Multi Stakeholder Collaboration",
  "Other topics related to zakat",
];

export const JOURNALS: string[] = [
  "International Journal of Zakat, Badan Amil Zakat Nasional, Indonesia (Sinta 3)",
  "Al-Muzara’ah Journal of Islamic Economics, IPB University",
  "International Journal of Islamic Khazanah, Universitas Islam Negeri Sunan Gunung Djati Bandung, Indonesia (Scopus)",
  "Al-Muamalat: Jurnal Ekonomi Syariah, Universitas Islam Negeri Sunan Gunung Djati Bandung, Indonesia (Scopus)",
  "Economica: Jurnal Ekonomi Islam, Universitas Negeri Islam Walisongo Semarang, Indonesia (Sinta 2)",
  "Journal of Muslim Philanthropy and Civil Society, Indiana University, USA (Scopus)",
  "The International Journal of Islamic Economics and Finance Studies (IJISEF), Sakarya University, Turkiye",
  "Muslim Humanitarianism Review (Indiana University Press), Indiana University, USA",
  "International Proceedings of the 10th ICONZ BAZNAS 2025 (Google Scholar etc)",
];

/**
 * The order is the order the marks stand in: the ministry on the left, IPB in
 * the middle, BAZNAS on the right, as markom asks.
 */
export const ORGANIZERS: string[] = [
  "IPB University",
  "Ministry of Religious Affairs",
  "The National Board of Zakat",
];

export const SUPPORTERS: string[] = [
  "Ministry of National Development Planning of the Republic of Indonesia",
  "Central Bureau of Statistics",
  "National Sharia Economy and Finance Committee (KNEKS)",
  "Indiana University, US",
  "Sakarya University, Turkiye",
  "Commission on Asian Philanthropy (CAP), Hongkong",
  "Sultan Sharif Ali Islamic University, Brunei",
  "Universiti Kebangsaan Malaysia (UKM), Malaysia",
  "Albukhary International University (AIU), Malaysia",
  "Masyarakat Ekonomi Syariah (MES)",
  "Indonesian Association of Islamic Economists (IAEI)",
];

export const SUB_EVENTS: string[] = [
  "International Conference",
  "Paper and Book Chapter Presentation",
  "Book Launching",
];

/**
 * The four figures under the hero.
 *
 * Two of them are counted rather than typed. A sub-event was dropped and the
 * band went on announcing four of them, because the number lived nowhere near
 * the list it was describing — the only way that stays true is for it to be
 * the same fact stated once.
 */
export const FACTS = [
  { value: "500", key: "factParticipants" },
  { value: String(SUB_EVENTS.length), key: "factSubevents" },
  { value: String(CONFERENCE_DAYS), key: "factDays" },
  { value: String(JOURNALS.length), key: "factJournals" },
] as const;

const CFP_DATES: Record<Lang, [label: string, date: string][]> = {
  en: [
    ["Full paper submission deadline", "1 November 2026"],
    ["Full paper acceptance notification", "10 November 2026"],
    ["Technical meeting for paper presentation", "30 November 2026"],
    ["Paper presentation", "1 December 2026"],
  ],
  id: [
    ["Batas waktu pengiriman full paper", "1 November 2026"],
    ["Pemberitahuan penerimaan full paper", "10 November 2026"],
    ["Technical meeting presentasi paper", "30 November 2026"],
    ["Presentasi paper", "1 Desember 2026"],
  ],
};

export type Edition = {
  year: string;
  title: string;
  /** Only where an edition's theme is on record. */
  theme?: string;
  links: { label: string; href: string }[];
  /**
   * That year's proceedings on the OJS site. Fill one in and the proceedings
   * page links straight to it; leave it out and the page says so plainly
   * rather than sending the reader to the wrong issue.
   */
  proceedings?: string;
};

export const EDITIONS: Edition[] = [
  {
    year: "2016",
    title: "National Seminar on Zakat 2016",
    theme: "Reflection of National Zakat Management",
    links: [],
  },
  {
    year: "2018",
    proceedings:
      "https://iconzbaznas.com/submission/index.php/proceedings/issue/view/8",
    title: "The 2nd International Conference of Zakat",
    links: [],
  },
  {
    year: "2019",
    proceedings:
      "https://iconzbaznas.com/submission/index.php/proceedings/issue/view/9",
    title: "The 3rd International Conference of Zakat",
    links: [],
  },
  {
    year: "2020",
    proceedings:
      "https://iconzbaznas.com/submission/index.php/proceedings/issue/view/11",
    title: "The 4th International Conference of Zakat",
    links: [
      { label: "YouTube", href: "https://www.youtube.com/live/OGgR2azEfxQ" },
    ],
  },
  {
    year: "2021",
    proceedings:
      "https://iconzbaznas.com/submission/index.php/proceedings/issue/view/12",
    title: "The 5th International Conference of Zakat",
    links: [
      { label: "YouTube", href: "https://www.youtube.com/live/spgDc-EDkxI" },
    ],
  },
  {
    year: "2022",
    proceedings:
      "https://iconzbaznas.com/submission/index.php/proceedings/issue/view/13",
    title: "The 6th International Conference of Zakat",
    links: [
      { label: "YouTube", href: "https://www.youtube.com/live/GyOHcvnKy20" },
    ],
  },
  {
    year: "2023",
    proceedings:
      "https://iconzbaznas.com/submission/index.php/proceedings/issue/view/14",
    title: "The 7th International Conference of Zakat",
    links: [
      { label: "Day 1", href: "https://www.youtube.com/live/KUnqHPzooKc" },
      { label: "Day 2", href: "https://www.youtube.com/live/YU8ef7HyYeo" },
    ],
  },
  {
    year: "2024",
    proceedings:
      "https://iconzbaznas.com/submission/index.php/proceedings/issue/view/16",
    title: "The 8th International Conference of Zakat",
    links: [
      { label: "Day 1", href: "https://www.youtube.com/live/TInhck4A_68" },
      { label: "Day 2", href: "https://www.youtube.com/live/yexaK_4WHmE" },
    ],
  },
  {
    year: "2025",
    proceedings:
      "https://iconzbaznas.com/submission/index.php/proceedings/issue/view/17",
    title: "The 9th International Conference of Zakat",
    links: [
      { label: "Opening", href: "https://www.youtube.com/live/qqb54M6cuDs" },
      { label: "After movie", href: "https://youtu.be/ZOGw2F9v_lU" },
    ],
  },
];

const ordinal = (n: number) => String(n).padStart(2, "0");

export function getObjectives(lang: Lang) {
  return OBJECTIVES[lang].map((text, i) => ({ n: ordinal(i + 1), text }));
}

export function getParticipants(lang: Lang) {
  return PARTICIPANTS[lang];
}

/**
 * The shape of a speaker's panel. Group titles are keys so both dictionaries
 * can label them; the entries themselves are proper nouns and stay as written.
 */
export type ProfileGroupKey = "expertise" | "highlights";

export type ProfileEntry = { label: string; note?: string };
export type ProfileGroup = { key: ProfileGroupKey; entries: ProfileEntry[] };

/** A speaker's panel: a paragraph about them, then the grouped lists. */
export type SpeakerProfile = { bio: string | null; groups: ProfileGroup[] };

/** Phrases the background passages turn on, per language and passage. */
const BACKGROUND_MARKS: Record<Lang, string[][]> = {
  en: [
    [
      "significant progress at the local level",
      "increasing the income of mustahik",
    ],
    ["increasingly global", "instruments of global solidarity"],
    ["a collaborative force on a global scale"],
    ["global solidarity rooted in the values of justice and humanity"],
  ],
  id: [
    [
      "kemajuan signifikan di tingkat lokal",
      "meningkatkan pendapatan mustahik",
    ],
    ["semakin bersifat global", "instrumen solidaritas global"],
    ["kekuatan kolaboratif berskala global"],
    ["solidaritas global yang berakar pada nilai keadilan dan kemanusiaan"],
  ],
};

export function getBackgroundMarks(lang: Lang) {
  return BACKGROUND_MARKS[lang];
}

/** Everyone speaking, in the order the committee lists them. */
export function getSpeakers(lang: Lang) {
  return INVITED_SPEAKERS.map((speaker) => ({
    role: speaker.role[lang],
    name: speaker.name,
    profile: {
      bio: speaker.bio,
      groups: [
        {
          key: "expertise" as const,
          entries: speaker.expertise.map((label) => ({ label })),
        },
        {
          key: "highlights" as const,
          entries: speaker.highlights.map((label) => ({ label })),
        },
      ],
    } satisfies SpeakerProfile,
  }));
}

export function getSubthemes() {
  return SUBTHEMES.map((text, i) => ({ n: ordinal(i + 1), text }));
}

export function getJournals() {
  return JOURNALS.map((text, i) => ({ n: `${i + 1}.`, text }));
}

export function getCfpDates(lang: Lang) {
  return CFP_DATES[lang].map(([label, date]) => ({ label, date }));
}

/** Call-for-paper milestones plus the conference itself, for the home page. */
export function getKeyDates(lang: Lang) {
  return [
    ...getCfpDates(lang),
    {
      label: lang === "id" ? "Konferensi ICONZ ke-10" : "The 10th ICONZ",
      date: conferenceRange(lang),
    },
  ];
}
