import type { Dict, Lang } from "./i18n";

export type NavItem = { path: string; key: keyof Dict };

export const NAV_ITEMS: NavItem[] = [
  { path: "", key: "navHome" },
  { path: "/conference", key: "navConference" },
  { path: "/submission", key: "navSubmission" },
  { path: "/previous", key: "navPrevious" },
  { path: "/proceedings", key: "navProceedings" },
];

/** Build a language-prefixed href, e.g. ("en", "/conference") -> "/en/conference". */
export function localizedHref(lang: Lang, path: string) {
  return `/${lang}${path}`;
}
