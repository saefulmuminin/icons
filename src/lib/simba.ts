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
  spcId: string;
  jenis: string;
  institusi: string;
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
    spcId: env.SIMBA_SPC_ID ?? "5",
    jenis: env.SIMBA_JENIS ?? "2",
    institusi: env.SIMBA_INSTITUSI ?? "28",
  };
}

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
 * Everything is answered in Indonesian whichever language the form was filled
 * in: the field names on the far side are Indonesian and a committee reading
 * one column should not find "Germany" under half the rows and "Jerman" under
 * the rest.
 */
export function simbaBody(
  entry: Registration,
  config: SimbaConfig,
): URLSearchParams {
  const profession =
    entry.profession === PROFESSION_OTHER
      ? entry.professionOther
      : label(PROFESSIONS, entry.profession);

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

  return new URLSearchParams({
    org: config.org,
    key: config.key,
    id_event: config.eventId,

    // The honorific has nowhere else to go, and dropping how someone asked to
    // be addressed to save four characters is not a trade worth making.
    nama: [label(PREFIXES, entry.prefix), entry.fullName]
      .filter(Boolean)
      .join(" "),
    hp: entry.whatsapp,
    email: entry.email,
    jenis_kelamin: label(SEXES, entry.sex).toLowerCase(),

    spc_id: config.spcId,
    institusi: config.institusi,
    jenis: config.jenis,

    // A province for anyone who gave one; for everyone else the same words the
    // old form asked them to type by hand.
    provinsi:
      entry.country === INDONESIA
        ? label(PROVINCES, entry.province)
        : "Peserta Internasional",

    meta: JSON.stringify(meta),

    // Sent empty, as in the committee's own example: this event takes no
    // payment, and SIMBA expects the keys to be present regardless.
    tanggal_bayar: "",
    jumlah: "",
    payment_attachment: "",
    payment: "",
  });
}

/**
 * Hand one registration to SIMBA, or throw.
 *
 * Throwing matters: the route turns it into a 503 and the reader is asked to
 * try again, rather than being thanked for a registration nobody received.
 */
export async function submitToSimba(
  entry: Registration,
  config: SimbaConfig,
): Promise<void> {
  const response = await fetch(config.url, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: simbaBody(entry, config).toString(),
    // Long enough for a slow upstream, short enough that the reader is not
    // left watching a spinner that will never resolve.
    signal: AbortSignal.timeout(15_000),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`SIMBA answered ${response.status}: ${text.slice(0, 400)}`);
  }

  // A 200 is not yet a yes. SIMBA reports a refusal in the body, so anything
  // that parses and says so is treated as the failure it is.
  try {
    const body = JSON.parse(text) as Record<string, unknown>;
    const ok =
      body.status ?? body.success ?? body.result ?? body.error ?? undefined;

    if (ok === false || ok === "false" || ok === 0) {
      throw new Error(`SIMBA refused it: ${text.slice(0, 400)}`);
    }
  } catch (cause) {
    // Only a refusal is rethrown. A body that is not JSON at all is not
    // evidence of anything, and a 200 is the best signal left.
    if (cause instanceof Error && cause.message.startsWith("SIMBA refused")) {
      throw cause;
    }
  }
}
