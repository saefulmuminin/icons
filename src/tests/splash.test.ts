import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { SPLASH_SEEN } from "@/lib/splash-key";

/**
 * The guard runs as a plain file, ahead of any bundle, so it cannot import the
 * key it reads. Nothing but this test holds the two together — and if they
 * drift, the splash simply shows again on every visit, quietly.
 */
describe("the splash guard", () => {
  const guard = readFileSync(
    join(process.cwd(), "public", "splash-guard.js"),
    "utf8",
  );

  it("reads the same key the splash writes", () => {
    expect(guard).toContain(`"${SPLASH_SEEN}"`);
  });

  it("stamps the root element the stylesheet watches", () => {
    expect(guard).toContain("document.documentElement.dataset.splash");
    expect(guard).toContain('"seen"');
  });

  it("survives storage being unavailable", () => {
    expect(guard).toContain("try");
    expect(guard).toContain("catch");
  });
});
