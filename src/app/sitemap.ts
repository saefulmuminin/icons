import type { MetadataRoute } from "next";
import { LANGS } from "@/lib/i18n";
import { NAV_ITEMS } from "@/lib/nav";
import { SITE_URL } from "@/lib/site";

/** The nav routes plus registration, which is reached from the call to
 *  action rather than the menu. */
const ROUTES = [...NAV_ITEMS.map((item) => item.path), "/register"];

export default function sitemap(): MetadataRoute.Sitemap {
  return LANGS.flatMap((lang) =>
    ROUTES.map((path) => ({
      url: `${SITE_URL}/${lang}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          LANGS.map((other) => [other, `${SITE_URL}/${other}${path}`]),
        ),
      },
    })),
  );
}
