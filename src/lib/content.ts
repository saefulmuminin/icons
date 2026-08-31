import type { Lang } from "./i18n";

export const CONFERENCE = {
  startsAt: "2026-11-24T08:00:00+07:00",
  endsAt: "2026-11-26T17:00:00+07:00",
  dateRange: "24 – 26 November 2026",
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
 * The committee's own line, for the questions a form cannot answer.
 *
 * `wa` is the number again with everything but the digits stripped, which is
 * the only shape wa.me accepts.
 */
export const CONTACT = {
  name: "Adibah",
  phone: "+62 818-0652-9744",
  wa: "https://wa.me/6281806529744",
  photo: "/image/dibah.png",
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

const SPEAKERS: Record<Lang, [role: string, name: string][]> = {
  en: [
    ["Chairman of BAZNAS", "Dr. Ir. H. Sodik Mudjahid, M.Sc."],
    ["Minister of Religious Affairs", "Prof. Dr. KH. Nasaruddin Umar, M.A."],
    ["Head of Danantara", "Rosan Perkasa Roeslani"],
    [
      "Coordinating Minister for Community Empowerment",
      "Drs. (HC) H.A. Muhaimin Iskandar, M.Si",
    ],
    [
      "Minister of National Development Planning (Bappenas)",
      "Prof. Dr. Ir. Rachmat Pambudy, M.S.",
    ],
    ["Chair of DPR Commission VIII", "H. Marwan Dasopang, M.Si."],
    [
      "Speaker of the People's Consultative Assembly of the Republic of Indonesia",
      "Ahmad Muzani",
    ],
    [
      "Deputy Speaker of the House of Representatives of the Republic of Indonesia",
      "Prof. Dr. Ir. H. Sufmi Dasco Ahmad, S.H., M.H.",
    ],
    [
      "General Secretary of the World Zakat and Waqf Forum (WZWF)",
      "H.E. Datuk Dr. Mohd Ghazali Md. Noor",
    ],
  ],
  id: [
    ["Ketua BAZNAS", "Dr. Ir. H. Sodik Mudjahid, M.Sc."],
    ["Menteri Agama", "Prof. Dr. KH. Nasaruddin Umar, M.A."],
    ["Kepala Danantara", "Rosan Perkasa Roeslani"],
    [
      "Menteri Koordinator Pemberdayaan Masyarakat",
      "Drs. (HC) H.A. Muhaimin Iskandar, M.Si",
    ],
    ["Menteri Bappenas", "Prof. Dr. Ir. Rachmat Pambudy, M.S."],
    ["Ketua Komisi VIII DPR", "H. Marwan Dasopang, M.Si."],
    ["Ketua Majelis Permusyawaratan Rakyat RI", "Ahmad Muzani"],
    [
      "Wakil Ketua Dewan Perwakilan Rakyat RI",
      "Prof. Dr. Ir. H. Sufmi Dasco Ahmad, S.H., M.H.",
    ],
    [
      "Sekretaris Jenderal World Zakat and Waqf Forum (WZWF)",
      "H.E. Datuk Dr. Mohd Ghazali Md. Noor",
    ],
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
    ["Conference & chapter presentation", "24–26 November 2026"],
  ],
  id: [
    ["Pengiriman bab lengkap", "1 November 2026"],
    ["Pemberitahuan penerimaan", "17 November 2026"],
    ["Konferensi & presentasi bab", "24–26 November 2026"],
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
  "Ministry of Religious Affairs",
  "IPB University",
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
  { value: "300", key: "factParticipants" },
  { value: String(SUB_EVENTS.length), key: "factSubevents" },
  { value: String(CONFERENCE_DAYS), key: "factDays" },
  { value: String(JOURNALS.length), key: "factJournals" },
] as const;

const CFP_DATES: Record<Lang, [label: string, date: string][]> = {
  en: [
    ["Full paper submission deadline", "1 November 2026"],
    ["Full paper acceptance notification", "10 November 2026"],
    ["Technical meeting for paper presentation", "23 November 2026"],
    ["Paper presentation", "24 November 2026"],
  ],
  id: [
    ["Batas waktu pengiriman full paper", "1 November 2026"],
    ["Pemberitahuan penerimaan full paper", "10 November 2026"],
    ["Technical meeting presentasi paper", "23 November 2026"],
    ["Presentasi paper", "24 November 2026"],
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
 * Speaker profiles, keyed by the name that appears in SPEAKERS. Group titles
 * are keys so both dictionaries can label them; the entries themselves are
 * proper nouns and stay as written.
 */
export type ProfileGroupKey =
  | "education"
  | "work"
  | "entrepreneur"
  | "community"
  | "politics"
  | "dakwah"
  | "schooling";

export type ProfileEntry = { label: string; note?: string };
export type ProfileGroup = { key: ProfileGroupKey; entries: ProfileEntry[] };

const PROFILES: Record<string, ProfileGroup[]> = {
  "Prof. Dr. KH. Nasaruddin Umar, M.A.": [
    {
      key: "education",
      entries: [
        { label: "Pesantren As'adiyah Sengkang" },
        { label: "UIN Alauddin Makassar", note: "S1 — Fakultas Syariah" },
        {
          label: "UIN Syarif Hidayatullah Jakarta",
          note: "S2 dan S3 — doktor, 1999",
        },
        {
          label: "McGill University, Montreal",
          note: "Program doktoral, 1993–1994",
        },
        { label: "Universiteit Leiden", note: "Program doktoral, 1994–1995" },
        { label: "Paris University", note: "Sandwich program" },
      ],
    },
    {
      key: "politics",
      entries: [
        { label: "Menteri Agama Republik Indonesia", note: "2024–2029" },
        { label: "Wakil Menteri Agama", note: "2011–2014" },
        {
          label: "Direktur Jenderal Bimbingan Masyarakat Islam",
          note: "2006–2012",
        },
      ],
    },
    {
      key: "dakwah",
      entries: [
        { label: "Imam Besar Masjid Istiqlal", note: "Sejak 2016" },
        { label: "Rais Pengurus Besar Nahdlatul Ulama", note: "2022–2027" },
        { label: "Pendiri Masyarakat Dialog Antarumat Beragama" },
      ],
    },
  ],
  "Rosan Perkasa Roeslani": [
    {
      key: "education",
      entries: [
        {
          label: "Oklahoma State University, Amerika Serikat",
          note: "S1 — Keuangan, 1988–1992",
        },
        {
          label: "Antwerp European University, Belgia",
          note: "Master of Business Administration, 1996",
        },
      ],
    },
    {
      key: "politics",
      entries: [
        {
          label: "Menteri Investasi & Hilirisasi / Kepala BKPM",
          note: "Sejak 2024",
        },
        {
          label: "Kepala Badan Pengelola Investasi Danantara",
          note: "Sejak Februari 2025",
        },
        { label: "Wakil Menteri BUMN", note: "2023–2024" },
        {
          label: "Duta Besar RI untuk Amerika Serikat",
          note: "2021–2023",
        },
      ],
    },
    {
      key: "entrepreneur",
      entries: [
        {
          label: "PT Recapital Advisors",
          note: "Pendiri, semula PT Republik Indonesia Funding",
        },
        { label: "Ketua Umum Kadin Indonesia", note: "2015–2021" },
        { label: "Wakil Bendahara Umum HIPMI", note: "2005–2008" },
      ],
    },
  ],
  "Drs. (HC) H.A. Muhaimin Iskandar, M.Si": [
    {
      key: "education",
      entries: [
        { label: "SD Mamba'ul Ma'arif Denanyar, Jombang", note: "1979" },
        { label: "MTsN Denanyar", note: "1982" },
        { label: "MAN Yogyakarta", note: "1985" },
        {
          label: "Universitas Gadjah Mada",
          note: "S1 — Ilmu Sosial dan Ilmu Politik",
        },
        { label: "Universitas Indonesia", note: "S2 — Komunikasi, 1998" },
        {
          label: "Universitas Airlangga",
          note: "Doktor Honoris Causa, 2018",
        },
      ],
    },
    {
      key: "politics",
      entries: [
        {
          label: "Menteri Koordinator Bidang Pemberdayaan Masyarakat",
          note: "2024–2029",
        },
        { label: "Wakil Ketua DPR RI", note: "2019–2024" },
        {
          label: "Menteri Tenaga Kerja dan Transmigrasi",
          note: "2009–2014",
        },
        { label: "Ketua Umum Partai Kebangkitan Bangsa", note: "2005–2024" },
        { label: "Sekretaris Jenderal PKB", note: "1998" },
      ],
    },
  ],
  "Prof. Dr. Ir. Rachmat Pambudy, M.S.": [
    {
      key: "education",
      entries: [
        { label: "IPB University", note: "S1 — Fakultas Peternakan" },
        { label: "IPB University", note: "S2 — Komunikasi Pembangunan" },
        {
          label: "IPB University",
          note: "S3 — Penyuluhan Pembangunan, 1999",
        },
      ],
    },
    {
      key: "work",
      entries: [
        {
          label: "Guru Besar Kewirausahaan IPB University",
          note: "Sejak 2022",
        },
        {
          label: "Staf Ahli Menteri Pertanian Bidang Hubungan Antar Lembaga",
          note: "Hingga 2004",
        },
        {
          label: "Tenaga Ahli Menteri Pertanian Bidang Pengembangan Agribisnis",
          note: "Sejak 2000",
        },
      ],
    },
    {
      key: "politics",
      entries: [
        {
          label: "Menteri PPN / Kepala Bappenas",
          note: "2024–2029",
        },
      ],
    },
    {
      key: "community",
      entries: [
        {
          label: "Komite Pengawas dan Pemantau Pertanian Indonesia (KP3I)",
          note: "Pendiri dan Dewan Pakar, sejak 2016",
        },
      ],
    },
  ],
  "H. Marwan Dasopang, M.Si.": [
    {
      key: "education",
      entries: [
        {
          label: "MAN Pondok Pesantren Portibi, Padang Lawas Utara",
          note: "1983",
        },
        {
          label: "IAIN Sumatera Utara, Medan",
          note: "S1 — Hukum Islam, 1990",
        },
        {
          label: "Universitas Krisnadwipayana",
          note: "S2 — Manajemen, 2016",
        },
      ],
    },
    {
      key: "politics",
      entries: [
        { label: "Ketua Komisi VIII DPR RI", note: "2024–2029" },
        { label: "Wakil Ketua Komisi VIII DPR RI", note: "2019–2024" },
        { label: "Anggota Komisi IX DPR RI", note: "2014–2019" },
      ],
    },
    {
      key: "community",
      entries: [
        { label: "Ketua PMII Cabang Medan", note: "1988–1989" },
        {
          label: "Sekretaris PW GP Ansor Sumatera Utara",
          note: "1990–1995",
        },
      ],
    },
  ],
  "Ahmad Muzani": [
    {
      key: "education",
      entries: [
        { label: "Madrasah Ibtidaiyah Islamiyah", note: "1975–1981" },
        { label: "SMP Ikhsaniyah", note: "1981–1984" },
        { label: "SMEA Negeri Tegal", note: "1987" },
        {
          label: "Universitas Ibnu Khaldun",
          note: "S1 — Ilmu Komunikasi",
        },
      ],
    },
    {
      key: "work",
      entries: [
        { label: "Wartawan Majalah Amanah" },
        { label: "Penyiar dan redaktur Radio Ramako" },
        { label: "Guru SMA Muhammadiyah 13 Jakarta" },
      ],
    },
    {
      key: "politics",
      entries: [
        { label: "Ketua MPR RI", note: "2024–2029" },
        { label: "Wakil Ketua MPR RI", note: "2019–2024" },
        {
          label: "Sekretaris Jenderal Partai Gerindra",
          note: "2015–2020",
        },
        {
          label: "Ketua Fraksi Partai Gerindra DPR RI",
          note: "Sejak 2012",
        },
        {
          label: "Ketua Badan Akuntabilitas Keuangan Negara DPR RI",
          note: "2009–2012",
        },
      ],
    },
  ],
  "Prof. Dr. Ir. H. Sufmi Dasco Ahmad, S.H., M.H.": [
    {
      key: "education",
      entries: [
        {
          label: "Universitas Pancasila",
          note: "S1 — Teknik Elektro, 1985–1993",
        },
        {
          label: "Universitas Jakarta",
          note: "S1 — Fakultas Hukum, 2005–2009",
        },
        {
          label: "Universitas Islam Jakarta",
          note: "S2 — Hukum, 2009–2012",
        },
        {
          label: "Universitas Islam Bandung",
          note: "S3 — Hukum, 2012–2015",
        },
      ],
    },
    {
      key: "work",
      entries: [{ label: "Guru Besar Ilmu Hukum Universitas Pakuan" }],
    },
    {
      key: "politics",
      entries: [
        { label: "Pimpinan DPR RI", note: "Sejak 2019" },
        {
          label: "Anggota DPR RI, Daerah Pemilihan Banten III",
          note: "Sejak 2014",
        },
        {
          label: "Wakil Ketua Mahkamah Kehormatan Dewan",
          note: "2014",
        },
        { label: "Ketua Harian DPP Partai Gerindra" },
      ],
    },
  ],
  "H.E. Datuk Dr. Mohd Ghazali Md. Noor": [
    {
      key: "education",
      entries: [
        { label: "Sekolah Rendah Melayu Dato Kramat, Pulau Pinang" },
        { label: "Sekolah Rendah Francis Light, Pulau Pinang" },
      ],
    },
    {
      key: "work",
      entries: [
        {
          label: "Islamic Development Bank (IDB) Group",
          note: "Direktur Pertama Perencanaan Strategis",
        },
        {
          label: "Sekretariat Komisi Visi 1440H IDB",
          note: "Kepala Sekretariat",
        },
        { label: "Tindakan Strategi Sendirian Berhad", note: "Senior Adjunct" },
      ],
    },
    {
      key: "community",
      entries: [
        {
          label: "Sekretaris Jenderal World Zakat and Waqf Forum",
          note: "Periode 2023–2026",
        },
        { label: "Presiden International Waqf Action Council (iWAQF)" },
        { label: "Ketua Sementara IDB Alumni Malaysia" },
        { label: "Presiden USC Alumni Malaysia" },
      ],
    },
    {
      key: "schooling",
      entries: [
        {
          label: "Al-Hamra International School",
          note: "Ketua Board of Governors",
        },
      ],
    },
  ],
  "Dr. Ir. H. Sodik Mudjahid, M.Sc.": [
    {
      key: "education",
      entries: [
        {
          label: "Universitas Padjadjaran (UNPAD)",
          note: "S1 — Sosial Ekonomi Pertanian",
        },
        {
          label: "Universitas Padjadjaran (UNPAD)",
          note: "S2 — Manajemen Bisnis Pertanian",
        },
        {
          label: "Universitas Pendidikan Indonesia (UPI)",
          note: "S3 — Manajemen Pendidikan, Quality Control Lembaga Pendidikan",
        },
      ],
    },
    {
      key: "work",
      entries: [
        { label: "PT Tricon Jaya International Consulting" },
        { label: "Universitas Telkom Bandung" },
        { label: "Institut Manajemen Koperasi Indonesia (IKOPIN)" },
      ],
    },
    {
      key: "entrepreneur",
      entries: [
        { label: "PT Qiblat Tour", note: "Pendiri — Pariwisata & Religi" },
        {
          label: "PT Bandung Geriatric Care",
          note: "Pendiri — Kesehatan & Lansia",
        },
        {
          label: "PT SAS Aero Sishan",
          note: "Pendiri — Pertahanan & Keamanan",
        },
        {
          label: "PT Total Edukasi Indonesia",
          note: "Pendiri — Pendidikan Merdeka",
        },
      ],
    },
    {
      key: "community",
      entries: [
        { label: "Ketua BAZNAS RI" },
        { label: "Pembina LAZ Darul Hikam" },
        { label: "Pembina Disabilitas" },
      ],
    },
    {
      key: "politics",
      entries: [
        {
          label: "Pimpinan MPR RI",
          note: "Wakil Ketua Fraksi MPR Gerindra",
        },
        { label: "Wakil Ketua Komisi VIII DPR RI" },
        { label: "Anggota Komisi X DPR RI" },
        { label: "Anggota Komisi II DPR RI" },
        {
          label: "Anggota Badan Kajian & Sosialisasi",
          note: "Badan Strategis MPR RI",
        },
      ],
    },
    {
      key: "dakwah",
      entries: [
        { label: "Ketua I MUI Jawa Barat" },
        { label: "Wakil Direktur Pusat Da'wah Islam (PUSDAI)" },
        { label: "Ketua Dewan Pertimbangan ICMI" },
        { label: "Wakil Ketua Dewan Masjid Indonesia" },
      ],
    },
    {
      key: "schooling",
      entries: [
        { label: "Ketua Yayasan Darul Hikam" },
        { label: "Ketua Badan Musyawarah Perguruan Swasta" },
        { label: "Pembina PAUD" },
      ],
    },
  ],
};

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

export function getSpeakers(lang: Lang) {
  return SPEAKERS[lang].map(([role, name]) => ({
    role,
    name,
    profile: PROFILES[name] ?? null,
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
      date: CONFERENCE.dateRange,
    },
  ];
}
