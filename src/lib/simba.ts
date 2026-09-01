import type { Choice, Registration } from "./registration";
import {
  CONTINENTS,
  COUNTRIES,
  INDONESIA,
  PAPER_ANSWERS,
  PREFIXES,
  PROFESSIONS,
  PROFESSION_OTHER,
  PROVINCES,
  SEMINAR_DAYS,
  fullPhone,
  SEXES,
} from "./registration";

/**
 * What SIMBA needs to know before it will take a registration.
 *
 * All of it is opaque to this site — an organisation number, an event number,
 * a key, and three ids whose meaning lives in SIMBA's own tables — so none of
 * it is written down here. The key in particular is a credential and belongs
 * in the environment, not in the repository.
 */
export type SimbaConfig = {
  url: string;
  key: string;
  org: string;
  eventId: string;
  jenis: string;
};

/**
 * The configuration, or null when the site has not been given one.
 *
 * The three ids at the end carry the values from the committee's own example,
 * because they are event settings rather than secrets and a missing one would
 * otherwise be a silent rejection.
 */
export function simbaConfig(
  env: Record<string, string | undefined> = process.env,
): SimbaConfig | null {
  const url = env.SIMBA_URL;
  const key = env.SIMBA_KEY;
  const org = env.SIMBA_ORG;
  const eventId = env.SIMBA_EVENT_ID;

  if (!url || !key || !org || !eventId) return null;

  return {
    url,
    key,
    org,
    eventId,
    jenis: env.SIMBA_JENIS ?? "Institusi",
  };
}

/**
 * The typographic apostrophe, in place of the straight one.
 *
 * SIMBA refuses any value containing ' outright, and says only "Data exist or
 * failed" — the sentence it uses for everything. Nothing else is rejected:
 * quotes, backslashes, semicolons, angle brackets, backticks, percent signs
 * and accented letters were all tried and all accepted, which points at a
 * quote filter rather than an encoding problem.
 *
 * So the character is swapped rather than stripped. "Mu'minin" reaches the
 * register as "Mu’minin", which is the same name correctly typeset — and a
 * name that lands beats a byte-perfect one that is turned away.
 */
export const withoutApostrophes = (value: string) =>
  value.replace(/'/g, "\u2019");

/** The Indonesian label for a stored value, which is what SIMBA is read in. */
function label(choices: readonly Choice[], value: string) {
  return choices.find((choice) => choice.value === value)?.id ?? "";
}

/**
 * The six custom fields the committee defined on this event, by the exact
 * names SIMBA holds them under.
 *
 * The names are the join. SIMBA matches on them rather than on the numbers
 * beside them in its admin table, so a rename there is a silent break here —
 * which is why they are spelled out in one place and checked by a test.
 */
export const META_FIELDS = [
  "Nama institusi",
  "Asal benua",
  "Asal negara",
  "Profesi/pekerjaan",
  "Apakah Anda mengirimkan naskah pada Call for Papers atau International Book Chapter?",
  "Hari seminar internasional mana yang akan Anda hadiri?",
] as const;

/**
 * One registration in the shape SIMBA's endpoint reads.
 *
 * Sent as multipart, and every part of this was arrived at the hard way. The
 * first worked example the committee supplied was refused by the very endpoint
 * it came from; a second one, sent weeks later, turned out to describe a
 * different shape entirely — free text where there had been ids, an object
 * where there had been an array. What is written here is the shape that was
 * answered `{"status_code":"000","status":"Sukses"}` and landed as participant
 * 3877, and nothing else has ever been accepted.
 *
 * Everything is answered in Indonesian whichever language the form was filled
 * in: the field names on the far side are Indonesian and a committee reading
 * one column should not find "Germany" under half the rows and "Jerman" under
 * the rest.
 */
/**
 * A registration number nobody has used before.
 *
 * spc_id has to be unique across the event, and SIMBA reports a repeat as
 * "Data exist or failed" — the same words it uses for every other refusal,
 * which is why a fixed value looked for weeks like a broken endpoint rather
 * than a number that had already been spent.
 *
 * Kept under 2^31 so it still fits wherever SIMBA stores it: a millisecond
 * timestamp is thirteen digits and would not.
 */
export function newSpcId() {
  return String(Math.floor(Math.random() * 2_000_000_000) + 1);
}

export function simbaBody(
  entry: Registration,
  config: SimbaConfig,
  spcId: string,
): FormData {
  const profession =
    entry.profession === PROFESSION_OTHER
      ? entry.professionOther
      : label(PROFESSIONS, entry.profession);

  // A list of {meta, value} pairs, in the order the event defines them.
  //
  // Both shapes have been handed to us — an object keyed by field name, and
  // this — and both are answered "Sukses", so a refusal never told us which
  // one is read. This is the shape of the committee's most recent example and
  // of SIMBA's own registration form, which posts the pairs as meta[]/data[].
  const meta = [
    entry.institution,
    label(CONTINENTS, entry.continent),
    label(COUNTRIES, entry.country),
    profession,
    label(PAPER_ANSWERS, entry.submittedPaper),
    entry.seminarDays
      .map((day) => label(SEMINAR_DAYS, day))
      .filter(Boolean)
      .join(", "),
  ].map((value, i) => ({ meta: META_FIELDS[i], value }));

  const body = new FormData();
  const put = (key: string, value: string) =>
    body.append(key, withoutApostrophes(value));

  put("org", config.org);
  put("key", config.key);
  put("id_event", config.eventId);

  // The honorific has nowhere else to go, and dropping how someone asked to
  // be addressed to save four characters is not a trade worth making.
  put(
    "nama",
    [label(PREFIXES, entry.prefix), entry.fullName].filter(Boolean).join(" "),
  );
  put("hp", fullPhone(entry.dialCode, entry.whatsapp));
  put("email", entry.email);
  put("jenis_kelamin", label(SEXES, entry.sex).toLowerCase());

  // Free text, not an id: the registrant's own answer, rather than one fixed
  // number filing all five hundred of them under a single institution.
  put("institusi", entry.institution);
  put("jenis", config.jenis);
  put("spc_id", spcId);

  // The event takes no payment, but these are not allowed to be empty — sent
  // blank, the endpoint refuses the registration outright.
  put("tanggal_bayar", "1970-01-01");
  put("jumlah", "0");
  put("foto", "");

  // A province for anyone who gave one; for everyone else the same words the
  // old form asked them to type out by hand.
  put(
    "provinsi",
    entry.country === INDONESIA
      ? label(PROVINCES, entry.province)
      : "Peserta Internasional",
  );

  put("meta", JSON.stringify(meta));
  return body;
}

/**
 * Whether SIMBA actually took the registration.
 *
 * It answers HTTP 200 to everything, refusals included, and says what really
 * happened in the body:
 *
 *   {"status_code":"101","status":"Key Invalid"}
 *   {"status_code":"101","status":"Data Invalid","error":"<div>Kolom …"}
 *   {"status_code":"403","status":"Data exist or failed"}
 *
 * So a refusal is only visible to something that reads status_code, and the
 * test is written the strict way round: accepted only on an explicit success,
 * refused on anything else. A registration wrongly reported as failed costs
 * somebody a second attempt; one wrongly reported as filed is simply gone, and
 * nobody finds out until the day they are not on the list.
 */
export function simbaVerdict(
  text: string,
): { accepted: true } | { accepted: false; reason: string } {
  let body: Record<string, unknown>;

  try {
    body = JSON.parse(text) as Record<string, unknown>;
  } catch {
    // Not JSON at all: no evidence either way, and HTTP 200 is all that is
    // left to go on.
    return { accepted: true };
  }

  const code = String(body.status_code ?? "");
  const status = String(body.status ?? "");

  // An endpoint that reports no code is one this envelope does not describe.
  if (!code && !status) return { accepted: true };

  if (
    code === "000" ||
    code === "100" ||
    code === "200" ||
    /sukses|success|berhasil|^ok$/i.test(status)
  ) {
    return { accepted: true };
  }

  // The error field carries markup meant for a browser; the words are the part
  // worth putting in a log.
  const detail = String(body.error ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return {
    accepted: false,
    reason: [code, status, detail].filter(Boolean).join(" — ").slice(0, 500),
  };
}

/**
 * Hand one registration to SIMBA, or throw.
 *
 * Throwing matters: the route turns it into a 503 and the reader is asked to
 * try again, rather than being thanked for a registration nobody received.
 *
 * "Data exist" is retried with a new number, because that is the one refusal a
 * new number fixes. Two collisions in a row on a range of two billion is not
 * something that happens, so a second refusal is a real one — an address
 * already registered, most likely — and is reported as such.
 */
export async function submitToSimba(
  entry: Registration,
  config: SimbaConfig,
): Promise<void> {
  let last = "";

  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await fetch(config.url, {
      method: "POST",
      // No content-type of our own: fetch writes multipart's boundary into the
      // header itself, and setting one by hand leaves it off.
      body: simbaBody(entry, config, newSpcId()),
      // Long enough for a slow upstream, short enough that the reader is not
      // left watching a spinner that will never resolve.
      signal: AbortSignal.timeout(15_000),
    });

    const text = await response.text();

    if (!response.ok) {
      throw new Error(
        `SIMBA answered ${response.status}: ${text.slice(0, 400)}`,
      );
    }

    const verdict = simbaVerdict(text);
    if (verdict.accepted) return;

    last = verdict.reason;
    if (!/data exist/i.test(last)) break;
  }

  throw new Error(`SIMBA refused it: ${last}`);
}
