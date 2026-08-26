import { describe, expect, it } from "vitest";
import type { Dict } from "@/lib/i18n";
import { dictionaries, getDictionary, isLang, LANGS } from "@/lib/i18n";

describe("isLang", () => {
  it("accepts the languages the site publishes", () => {
    expect(LANGS.every(isLang)).toBe(true);
  });

  it("turns away anything else", () => {
    expect(isLang("fr")).toBe(false);
    expect(isLang("")).toBe(false);
    expect(isLang("EN")).toBe(false);
  });
});

describe("the two dictionaries", () => {
  /**
   * The one that matters most: a key added to English and forgotten in
   * Indonesian renders as `undefined` on a live page, and nothing else in the
   * build catches it.
   */
  it("carry exactly the same keys", () => {
    const en = Object.keys(dictionaries.en).sort();
    const id = Object.keys(dictionaries.id).sort();

    expect(id).toEqual(en);
  });

  it("leave no line empty", () => {
    for (const lang of LANGS) {
      const blank = Object.entries(getDictionary(lang))
        .filter(([, value]) => !value.trim())
        .map(([key]) => key);

      expect(blank).toEqual([]);
    }
  });

  /**
   * A long line word-for-word identical in both dictionaries is almost always
   * an untranslated paste. Short ones — "Menu", a proper name, a URL — are
   * fine, and a few long ones are meant to stand in English either way.
   */
  it("leave no line still in the other language's words", () => {
    const bilingual = ["footOrg", "bookTitle", "pickPapers", "pickBook"];

    const same = (Object.keys(dictionaries.en) as (keyof Dict)[]).filter(
      (key) =>
        !bilingual.includes(key) &&
        dictionaries.en[key] === dictionaries.id[key] &&
        dictionaries.en[key].length > 40,
    );

    expect(same).toEqual([]);
  });
});
