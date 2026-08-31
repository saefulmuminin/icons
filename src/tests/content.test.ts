import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  BOOK_CHAPTER,
  CONFERENCE,
  CONTACT,
  GALLERY,
  EDITIONS,
  FACTS,
  JOURNALS,
  SUB_EVENTS,
  getSpeakers,
  LINKS,
  ORGANIZERS,
  SUPPORTERS,
} from "@/lib/content";

import { markFor, portraitsIn } from "@/lib/marks";

/** The same loose match the pages use to pair a name with a picture. */
const loose = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
const ART = /\.(svg|png|webp|avif|jpe?g)$/i;

function filed(folder: string, name: string) {
  const dir = join(process.cwd(), "public", folder);
  if (!existsSync(dir)) return false;

  const target = loose(name);
  return readdirSync(dir).some((entry) => {
    if (!ART.test(entry)) return false;

    const key = loose(entry.replace(/\.[^.]+$/, ""));
    return key.length > 3 && (target.includes(key) || key.includes(target));
  });
}

describe("the conference's own particulars", () => {
  it("ends after it starts", () => {
    expect(new Date(CONFERENCE.endsAt).getTime()).toBeGreaterThan(
      new Date(CONFERENCE.startsAt).getTime(),
    );
  });

  it("has both dates as something a calendar can read", () => {
    expect(Number.isNaN(new Date(CONFERENCE.startsAt).getTime())).toBe(false);
    expect(Number.isNaN(new Date(CONFERENCE.endsAt).getTime())).toBe(false);
  });
});

describe("every outward link", () => {
  const links = [
    ...Object.values(LINKS),
    ...Object.values(BOOK_CHAPTER.links),
    ...EDITIONS.flatMap((edition) => [
      ...edition.links.map((link) => link.href),
      edition.proceedings,
    ]).filter(Boolean),
  ] as string[];

  it("is an absolute https address", () => {
    const bad = links.filter((href) => !href.startsWith("https://"));
    expect(bad).toEqual([]);
  });

  it("parses as a URL", () => {
    for (const href of links) {
      expect(() => new URL(href)).not.toThrow();
    }
  });
});

/**
 * A portrait that moved or was renamed leaves a broken image beside the one
 * number a stuck registrant has, and nothing else in the build says a word.
 */
describe("the contact person", () => {
  it("has their portrait filed under public", () => {
    expect(existsSync(join(process.cwd(), "public", CONTACT.photo))).toBe(true);
  });

  it("is reachable on WhatsApp at the number shown", () => {
    expect(CONTACT.wa).toBe(
      `https://wa.me/${CONTACT.phone.replace(/\D/g, "")}`,
    );
  });
});

/**
 * These filenames carry spaces, so they are written percent-encoded and a
 * plain existsSync on the string would look for a file called "image%20copy".
 * Decoding first is the whole point of the check: it is exactly the mismatch
 * that would ship a carousel of five broken frames.
 */
describe("every photograph in the gallery", () => {
  it("is filed under public where the carousel looks for it", () => {
    const missing = GALLERY.filter(
      (photo) =>
        !existsSync(join(process.cwd(), "public", decodeURI(photo.src))),
    ).map((photo) => photo.src);

    expect(missing).toEqual([]);
  });

  it("carries the dimensions that reserve its frame", () => {
    for (const photo of GALLERY) {
      expect(photo.width).toBeGreaterThan(0);
      expect(photo.height).toBeGreaterThan(0);
    }
  });
});

describe("the archive of editions", () => {
  it("runs oldest first, one year each", () => {
    const years = EDITIONS.map((edition) => Number(edition.year));
    expect(years).toEqual([...years].sort((a, b) => a - b));
    expect(new Set(years).size).toBe(years.length);
  });
});

/**
 * A renamed institution silently loses its mark: the pairing is by name, so
 * "National Board of Zakat Indonesia" and "The National Board of Zakat" are
 * two different things to the matcher. It has happened once already.
 */
describe("every institution named on the site", () => {
  it("has a logo filed under public/logo", () => {
    const missing = [...ORGANIZERS, ...SUPPORTERS].filter(
      (name) => !filed("logo", name),
    );
    expect(missing).toEqual([]);
  });

  /**
   * Through the resolver the pages actually call, not a copy of it — the
   * footer used to pair names with files by position, and both a reorder and a
   * rename broke it without a sound.
   */
  it("resolves to a mark through markFor", () => {
    for (const name of ORGANIZERS) {
      expect(markFor(name)).toMatch(/^\/logo\//);
    }
  });

  it("gives each organiser a mark of its own", () => {
    const marks = ORGANIZERS.map(markFor);
    expect(new Set(marks).size).toBe(ORGANIZERS.length);
  });
});

describe("every book editor", () => {
  it("has a portrait filed under public/editor", () => {
    const missing = BOOK_CHAPTER.editors
      .filter((editor) => !filed("editor", editor.name))
      .map((editor) => editor.name);
    expect(missing).toEqual([]);
  });

  it("has a Scopus profile", () => {
    for (const editor of BOOK_CHAPTER.editors) {
      expect(editor.scopus).toMatch(/^https:\/\/www\.scopus\.com\//);
    }
  });
});

describe("every speaker", () => {
  const speakers = getSpeakers("en").map((one) => one.name);

  /**
   * Photographs arrive named the short way — "Rosan Roeslani" for
   * "Rosan Perkasa Roeslani" — which straight substring matching misses
   * entirely, and misses in silence.
   */
  it("has a portrait filed under public/pembicara", () => {
    const found = portraitsIn("pembicara", speakers);
    const missing = speakers.filter((_, i) => !found[i]);

    expect(missing).toEqual([]);
  });

  it("gets a portrait of their own", () => {
    const found = portraitsIn("pembicara", speakers);
    expect(new Set(found).size).toBe(speakers.length);
  });
});

describe("the figures under the hero", () => {
  const of = (key: string) => FACTS.find((f) => f.key === key)?.value;

  /**
   * These went stale once already: a sub-event was dropped and the band kept
   * announcing four. Counted from the lists themselves they cannot drift, and
   * this holds them to it.
   */
  it("counts the sub-events actually listed", () => {
    expect(of("factSubevents")).toBe(String(SUB_EVENTS.length));
  });

  it("counts the publication outlets actually listed", () => {
    expect(of("factJournals")).toBe(String(JOURNALS.length));
  });

  it("counts the days the conference actually runs", () => {
    const days =
      Math.round(
        (new Date(CONFERENCE.endsAt).setHours(0, 0, 0, 0) -
          new Date(CONFERENCE.startsAt).setHours(0, 0, 0, 0)) /
          86_400_000,
      ) + 1;

    expect(of("factDays")).toBe(String(days));
  });

  it("states each figure as a number", () => {
    for (const fact of FACTS) {
      expect(fact.value).toMatch(/^\d+$/);
    }
  });
});
