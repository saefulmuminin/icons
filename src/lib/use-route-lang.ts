"use client";

import { usePathname } from "next/navigation";
import { isLang, type Lang } from "./i18n";

/**
 * The language of the page the visitor is standing on, read from the address.
 *
 * Next hands `not-found.tsx` and `error.tsx` no params at all, so the segment
 * they sit under never reaches them — the address bar is what is left to read
 * it from. Anything unrecognised falls to English, the site's x-default.
 */
export function useRouteLang(): Lang {
  const first = usePathname().split("/")[1] ?? "";
  return isLang(first) ? first : "en";
}
