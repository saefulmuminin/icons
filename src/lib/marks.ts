import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ART = /\.(svg|png|webp|avif|jpe?g)$/i;

/** Only letters and digits, so punctuation and spacing drift never matter. */
export const loose = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * The mark filed for an institution, found by its own name.
 *
 * Pairing names with pictures by position — one list of names, another of
 * files, lined up by index — is what this replaces. That arrangement broke
 * twice in one week: once when the organisers were reordered so the marks no
 * longer belonged to the names beside them, and once when an institution was
 * renamed and its file with it, leaving a path that pointed at nothing. Both
 * were silent. Matching by name cannot come apart that way.
 */
export function markFor(name: string) {
  const dir = join(process.cwd(), "public", "logo");
  if (!existsSync(dir)) return null;

  const target = loose(name);
  const file = readdirSync(dir).find((entry) => {
    if (!ART.test(entry)) return false;

    const key = loose(entry.replace(/\.[^.]+$/, ""));
    return key.length > 3 && (target.includes(key) || key.includes(target));
  });

  return file ? encodeURI(`/logo/${file}`) : null;
}

/** The words of a name, in order, with nothing but letters and digits left. */
const words = (value: string) =>
  value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

/**
 * Whether a filename names this person.
 *
 * Straight substring matching is not enough: a photograph filed as
 * "Rosan Roeslani" belongs to "Rosan Perkasa Roeslani", and neither string
 * contains the other. What holds is that every word of the filename appears in
 * the name, in order — which is exactly what shortening a name does to it.
 */
function names(file: string, person: string) {
  const a = words(file);
  const b = words(person);
  if (a.length < 2 || !a.length) return false;

  let at = 0;
  for (const word of a) {
    const found = b.indexOf(word, at);
    if (found < 0) return false;
    at = found + 1;
  }

  return true;
}

/**
 * A picture filed for each of the given people, in the same order. Anyone with
 * nothing on file gets null, so the page can fall back rather than break.
 */
export function portraitsIn(folder: string, people: string[]) {
  const dir = join(process.cwd(), "public", folder);
  if (!existsSync(dir)) return people.map(() => null);

  const files = readdirSync(dir)
    .filter((entry) => ART.test(entry))
    .map((entry) => ({ entry, bare: entry.replace(/\.[^.]+$/, "") }));

  return people.map((person) => {
    const target = loose(person);

    const hit =
      files.find(({ bare }) => loose(bare) === target) ??
      files.find(({ bare }) => names(bare, person)) ??
      files.find(
        ({ bare }) => loose(bare).length > 3 && target.includes(loose(bare)),
      );

    return hit ? encodeURI(`/${folder}/${hit.entry}`) : null;
  });
}
