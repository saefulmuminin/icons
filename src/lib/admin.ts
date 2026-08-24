import { dictionaries, type Dict } from "./i18n";

/** A page of the public site, and the slice of content that belongs to it. */
export type AdminPage = {
  slug: string;
  label: string;
  /** The page this one governs, for the "look at it live" link. */
  live: string;
  blurb: string;
  /**
   * The dictionary keys this page owns, named by their prefix. Grouping by
   * prefix rather than listing two hundred keys by hand is what keeps this
   * honest: a key added to the dictionary tomorrow turns up here by itself.
   */
  prefixes: string[];
};

export const ADMIN_PAGES: AdminPage[] = [
  {
    slug: "home",
    label: "Home",
    live: "/en",
    blurb: "Sampul, hitung mundur, latar belakang, tujuan, pembicara, tanggal penting, penyelenggara dan pendukung.",
    prefixes: [
      "hero",
      "date",
      "venue",
      "calendar",
      "map",
      "theme",
      "countdown",
      "cd",
      "fact",
      "bg",
      "obj",
      "speaker",
      "speakers",
      "profile",
      "dates",
      "org",
      "sup",
    ],
  },
  {
    slug: "conference",
    label: "Conference",
    live: "/en/conference",
    blurb: "Gambaran konferensi, peserta yang dituju, sub-acara, dan ajakan mendaftar.",
    prefixes: ["conf", "part", "events", "reg"],
  },
  {
    slug: "submission",
    label: "Submission",
    live: "/en/submission",
    blurb: "Dua panggilan: makalah untuk prosiding, dan bab untuk buku suntingan internasional.",
    prefixes: ["submit", "pick", "book", "cfp", "subthemes", "timeline"],
  },
  {
    slug: "previous",
    label: "Previous ICONZ",
    live: "/en/previous",
    blurb: "Arsip sembilan penyelenggaraan sebelumnya beserta rekamannya.",
    prefixes: ["prev", "no"],
  },
  {
    slug: "proceedings",
    label: "Proceedings",
    live: "/en/proceedings",
    blurb: "Prosiding dan jurnal tempat makalah yang diterima diterbitkan.",
    prefixes: ["proc", "pub"],
  },
];

/** Everything that is not a page of the public site. */
export const ADMIN_SYSTEM = [
  {
    href: "/admin/users",
    label: "Manajemen pengguna",
    blurb: "Siapa yang boleh masuk, dan sejauh apa.",
  },
  {
    href: "/admin/log",
    label: "Log aktivitas",
    blurb: "Apa yang diubah, oleh siapa, kapan.",
  },
];

export function findPage(slug: string) {
  return ADMIN_PAGES.find((page) => page.slug === slug);
}

export type Field = { key: keyof Dict; en: string; id: string };

/**
 * A prefix owns a key only when what follows it starts a new word — so `sub`
 * takes `subTitle` and leaves `subthemesTitle` to `subthemes`, and `reg` takes
 * `regCta` without swallowing `registerClose`.
 */
function owns(key: string, prefix: string) {
  if (!key.startsWith(prefix)) return false;

  const next = key[prefix.length];
  return next === undefined || next === next.toUpperCase();
}

/** Every editable line of text on a page, in both languages, side by side. */
export function fieldsFor(page: AdminPage): Field[] {
  const en = dictionaries.en;
  const id = dictionaries.id;

  return (Object.keys(en) as (keyof Dict)[])
    .filter((key) => page.prefixes.some((prefix) => owns(key, prefix)))
    .map((key) => ({ key, en: en[key], id: id[key] }));
}
