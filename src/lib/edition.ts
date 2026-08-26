/**
 * Which ICONZ this site is for.
 *
 * One conference runs at a time: when the eleventh comes round these numbers
 * are changed, the identity files under public are swapped, and the tenth
 * takes its place as a row in Previous ICONZ and an entry in the proceedings
 * archive. There is no per-edition site to keep alive.
 *
 * Everything that reads "The 10th …" anywhere on the site — titles, share
 * cards, structured data, the mark in the bar — is derived from here. It used
 * to be typed out in forty-one places across seventeen files, which meant a
 * new edition was a hunt through the code rather than an edit.
 */
export const EDITION = {
  ordinal: 10,
  /** Written out rather than worked out: 11th and 21st do not share a rule. */
  suffix: "th",
  year: "2026",
} as const;

/** "The 10th International Conference on Zakat" — the name in full. */
export const EDITION_NAME = `The ${EDITION.ordinal}${EDITION.suffix} International Conference on Zakat`;

/** "The 10th ICONZ" — the name as it is said. */
export const EDITION_SHORT = `The ${EDITION.ordinal}${EDITION.suffix} ICONZ`;

/** "ICONZ 10" — the name as a mark, no ordinal. */
export const EDITION_MARK = `ICONZ ${EDITION.ordinal}`;

/** The conference mark. Swap the file, keep the name. */
export const EDITION_LOGO = "/iconz-logo.png";
