import { describe, expect, it } from "vitest";
import { dictionaries } from "@/lib/i18n";
import { localizedHref, NAV_ITEMS } from "@/lib/nav";

describe("localizedHref", () => {
  it("puts the language in front of the path", () => {
    expect(localizedHref("en", "/conference")).toBe("/en/conference");
    expect(localizedHref("id", "")).toBe("/id");
  });
});

describe("the site navigation", () => {
  it("labels every entry from the dictionary", () => {
    const missing = NAV_ITEMS.filter((item) => !dictionaries.en[item.key]);
    expect(missing).toEqual([]);
  });

  it("names each path once", () => {
    const paths = NAV_ITEMS.map((item) => item.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("starts every path with a slash, or nothing at all for home", () => {
    const wrong = NAV_ITEMS.filter(
      (item) => item.path !== "" && !item.path.startsWith("/"),
    );
    expect(wrong).toEqual([]);
  });
});
