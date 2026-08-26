import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  BOOK_CHAPTER,
  CONFERENCE,
  EDITIONS,
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
