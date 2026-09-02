/**
 * Absolute base URL for canonical links, hreflang alternates, and OG tags.
 *
 * Written here rather than read from the environment: it changes when the
 * conference moves domain, which is a code change either way, and a build that
 * silently falls back to the wrong host is worse than one that has it wrong in
 * plain sight.
 *
 * Not to be confused with iconzbaznas.com, which is still where the
 * proceedings archive lives and is a different system entirely.
 */
export const SITE_URL = "https://iconz.baznas.go.id";
