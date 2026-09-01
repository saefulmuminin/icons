import { CONFERENCE } from "./content";
import { COUNTRY_ROWS } from "./countries";
import type { Lang } from "./i18n";

/**
 * One choice in a select, carrying its own label in both languages.
 *
 * `value` is what gets stored and is deliberately language-free: a reader who
 * fills the form in Indonesian and one who fills it in English have to land in
 * the same column of the same spreadsheet, so the label is a presentation
 * detail and never the record.
 */
export type Choice = { value: string; en: string; id: string };

export const labelOf = (choice: Choice, lang: Lang) => choice[lang];

/**
 * Honorifics stay untranslated. They are what the previous form asked for and
 * they read the same to an Indonesian registrant; "Nona" for Ms. would be the
 * only word on the page nobody uses out loud.
 */
export const PREFIXES: Choice[] = [
  { value: "mr", en: "Mr.", id: "Mr." },
  { value: "mrs", en: "Mrs.", id: "Mrs." },
  { value: "ms", en: "Ms.", id: "Ms." },
];

export const SEXES: Choice[] = [
  { value: "male", en: "Male", id: "Pria" },
  { value: "female", en: "Female", id: "Wanita" },
];

export const CONTINENTS: Choice[] = [
  { value: "asia", en: "Asia", id: "Asia" },
  { value: "africa", en: "Africa", id: "Afrika" },
  { value: "europe", en: "Europe", id: "Eropa" },
  { value: "north-america", en: "North America", id: "Amerika Utara" },
  { value: "south-america", en: "South America", id: "Amerika Selatan" },
  { value: "oceania", en: "Australia/Oceania", id: "Australia/Oseania" },
];

/** A country, and the continent whose list it appears under. */
export type Country = Choice & { continent: string };

export const COUNTRIES: readonly Country[] = COUNTRY_ROWS.map(
  ([value, continent, en, id]) => ({ value, continent, en, id }),
);

/** The one country the provinces below belong to. */
export const INDONESIA = "ID";

/** Stored in place of a province for everyone who lives outside Indonesia. */
export const INTERNATIONAL = "international";

/** Only the countries on the continent already chosen. */
export function countriesIn(continent: string) {
  return COUNTRIES.filter((country) => country.continent === continent);
}

/**
 * The provinces, in the order the previous form listed them — grouped by
 * island rather than alphabetically, which is how the committee reads them
 * back. Province names are proper nouns, so they are not translated.
 *
 * The list holds provinces and nothing else. Where the old form made every
 * foreign registrant scroll past thirty-four Indonesian provinces to pick
 * "International Participant" out of the same menu, that answer is now
 * settled by the country above and never asked.
 */
export const PROVINCES: Choice[] = [
  ...[
    "Aceh",
    "Sumatera Utara",
    "Sumatera Barat",
    "Sumatera Selatan",
    "Jambi",
    "Bengkulu",
    "Kepulauan Bangka Belitung",
    "Riau",
    "Kepulauan Riau",
    "Lampung",
    "DKI Jakarta",
    "Jawa Barat",
    "Jawa Tengah",
    "Jawa Timur",
    "Banten",
    "DI Yogyakarta",
    "Kalimantan Utara",
    "Kalimantan Selatan",
    "Kalimantan Barat",
    "Kalimantan Tengah",
    "Kalimantan Timur",
    "Sulawesi Tengah",
    "Sulawesi Utara",
    "Sulawesi Selatan",
    "Sulawesi Barat",
    "Gorontalo",
    "Sulawesi Tenggara",
    "Nusa Tenggara Timur",
    "Nusa Tenggara Barat",
    "Bali",
    "Maluku",
    "Maluku Utara",
    "Papua",
    "Papua Barat",
  ].map((name) => ({
    value: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    en: name,
    id: name,
  })),
];

export const PROFESSIONS: Choice[] = [
  { value: "researcher", en: "Researcher", id: "Peneliti" },
  { value: "lecturer", en: "Lecturer", id: "Dosen Pengajar" },
  { value: "student", en: "Student", id: "Mahasiswa" },
  { value: "amil", en: "Amil", id: "Amil" },
  { value: "entrepreneur", en: "Entrepreneur", id: "Pengusaha" },
  { value: "private-sector", en: "Private Sector", id: "Pegawai Swasta" },
  { value: "state-sector", en: "State Sector", id: "Pegawai BUMN" },
  { value: "civil-servant", en: "Civil Servant", id: "Pegawai Negeri Sipil" },
  {
    value: "non-profit",
    en: "Non-Profit Practitioner",
    id: "Karyawan Lembaga Non-Profit",
  },
  { value: "other", en: "Other", id: "Lainnya" },
];

/** The one profession that opens a text box beside it. */
export const PROFESSION_OTHER = "other";

export const PAPER_ANSWERS: Choice[] = [
  { value: "yes", en: "Yes", id: "Ya" },
  { value: "no", en: "No", id: "Tidak" },
];

/**
 * The conference's own days, counted off its opening date rather than typed
 * out again. The date lives in one place already, and a form offering days the
 * countdown disagrees with is worse than one that says nothing.
 *
 * Parsed as plain numbers and rebuilt in UTC: reading the timestamp with
 * `new Date` would resolve it against the machine's clock, and any server west
 * of Jakarta would name the day before.
 */
const [OPEN_Y, OPEN_M, OPEN_D] = CONFERENCE.startsAt
  .slice(0, 10)
  .split("-")
  .map(Number);

export function conferenceDate(day: number, lang: Lang) {
  return new Date(
    Date.UTC(OPEN_Y, OPEN_M - 1, OPEN_D + day - 1),
  ).toLocaleDateString(lang === "id" ? "id-ID" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * A seminar day, carrying its number as well as its label.
 *
 * The label is one string because that is how it is filed — SIMBA gets "Hari 2
 * — 25 November 2026" in a single cell. The number is here so the form can set
 * the day and the date on separate lines without picking the label apart again.
 */
export type SeminarDay = Choice & { n: number };

/** Day 1 is the call-for-papers day; the seminar proper runs on days 2 and 3. */
export const SEMINAR_DAYS: SeminarDay[] = [2, 3].map((n) => ({
  n,
  value: `day-${n}`,
  en: `Day ${n} — ${conferenceDate(n, "en")}`,
  id: `Hari ${n} — ${conferenceDate(n, "id")}`,
}));

/** The day the papers are presented, which the paper question is asking about. */
export const PAPER_DAY = 1;

export type Registration = {
  email: string;
  prefix: string;
  fullName: string;
  sex: string;
  whatsapp: string;
  institution: string;
  continent: string;
  country: string;
  province: string;
  city: string;
  profession: string;
  professionOther: string;
  submittedPaper: string;
  seminarDays: string[];
};

export type Field = keyof Registration;

export const EMPTY: Registration = {
  email: "",
  prefix: "",
  fullName: "",
  sex: "",
  whatsapp: "",
  institution: "",
  continent: "",
  country: "",
  province: "",
  city: "",
  profession: "",
  professionOther: "",
  submittedPaper: "",
  seminarDays: [],
};

/**
 * Why a field was rejected, as a code rather than a sentence: the API route
 * has no language to answer in, and the form has two.
 */
export type ErrorCode = "required" | "email" | "whatsapp" | "long";

export type Errors = Partial<Record<Field, ErrorCode>>;

/** Long enough for any real answer, short enough to bound what a bot can post. */
export const MAX_FIELD = 160;

/**
 * Deliberately permissive. Anything stricter starts rejecting the addresses
 * people actually hold, and the address is confirmed by mailing it either way.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Digits with the punctuation people type between them; counted separately. */
const PHONE_SHAPE = /^[+()\d\s.-]+$/;

/**
 * One shape for every number, whatever it was typed with. "+62 818-0652-9744",
 * "(62) 818 0652 9744" and "+6281806529744" are one number written three ways,
 * and a committee sorting a spreadsheet by it should not see three.
 *
 * The leading plus is the one piece of punctuation that carries meaning, so it
 * is the one piece kept.
 */
export function normalisePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return raw.trimStart().startsWith("+") ? `+${digits}` : digits;
}

const valueOf = (choices: Choice[]) => choices.map((choice) => choice.value);

/**
 * The days that were both offered and chosen, in the order they are offered.
 * Anything else in the list is dropped rather than argued with — it can only
 * have come from something other than the form.
 */
function days(raw: unknown) {
  const chosen: unknown[] = Array.isArray(raw) ? raw : [];
  return valueOf(SEMINAR_DAYS).filter((day) => chosen.includes(day));
}

function text(raw: unknown) {
  return typeof raw === "string" ? raw.trim().replace(/\s+/g, " ") : "";
}

function checkText(value: string): ErrorCode | undefined {
  if (!value) return "required";
  if (value.length > MAX_FIELD) return "long";
}

function checkChoice(value: string, choices: Choice[]): ErrorCode | undefined {
  return valueOf(choices).includes(value) ? undefined : "required";
}

/**
 * What a change higher up the chain invalidates below it.
 *
 * Choosing a new continent leaves the country from the old one still sitting
 * in the field, and it is no longer on offer; choosing a new country leaves a
 * province that may not belong to it. Both are cleared rather than left to be
 * submitted and rejected.
 */
export function cascade(value: Registration, changed: Field): Registration {
  if (changed === "continent") {
    return { ...value, country: "", province: "", city: "" };
  }
  if (changed === "country") return { ...value, province: "", city: "" };
  return value;
}

/**
 * The single gate every submission passes, run on the client for the reader's
 * sake and again in the route for everyone else's — a form that only checks
 * itself in the browser checks nothing at all.
 */
export function validateRegistration(
  raw: unknown,
): { ok: true; value: Registration } | { ok: false; errors: Errors } {
  const input = (raw ?? {}) as Record<string, unknown>;

  const value: Registration = {
    email: text(input.email).toLowerCase(),
    prefix: text(input.prefix),
    fullName: text(input.fullName),
    sex: text(input.sex),
    whatsapp: text(input.whatsapp),
    institution: text(input.institution),
    continent: text(input.continent),
    country: text(input.country),
    province: text(input.province),
    city: text(input.city),
    profession: text(input.profession),
    professionOther: text(input.professionOther),
    submittedPaper: text(input.submittedPaper),
    seminarDays: days(input.seminarDays),
  };

  const errors: Errors = {};
  const set = (field: Field, code: ErrorCode | undefined) => {
    if (code) errors[field] = code;
  };

  set(
    "email",
    checkText(value.email) ?? (EMAIL.test(value.email) ? undefined : "email"),
  );
  set("prefix", checkChoice(value.prefix, PREFIXES));
  set("fullName", checkText(value.fullName));
  set("sex", checkChoice(value.sex, SEXES));
  set("institution", checkText(value.institution));
  set("continent", checkChoice(value.continent, CONTINENTS));

  // A country is only an answer if it sits on the continent already named.
  // The select never offers a mismatched pair, so anything that reaches here
  // came from something other than the form.
  const country = COUNTRIES.find((one) => one.value === value.country);
  set(
    "country",
    country && country.continent === value.continent ? undefined : "required",
  );

  // Province and city are Indonesian questions. Asked of an Indonesian
  // registrant, settled without asking for everyone else — the old form made
  // them pick "International Participant" twice, once from a menu of
  // thirty-five and once by typing it out.
  if (value.country === INDONESIA) {
    set("province", checkChoice(value.province, PROVINCES));
    set("city", checkText(value.city));
  } else {
    value.province = INTERNATIONAL;
    value.city = "";
  }
  set("profession", checkChoice(value.profession, PROFESSIONS));
  set("submittedPaper", checkChoice(value.submittedPaper, PAPER_ANSWERS));

  // Counted on the digits alone: "+62 818-0652-9744" and "6281806529744" are
  // the same number written two ways, and only one of them is 13 characters.
  //
  // The shape is tested before the number is tidied, not after. Stripping
  // first would turn "+62-818-call-me-9744" into a plausible twelve digits and
  // wave it through.
  const digits = value.whatsapp.replace(/\D/g, "");
  const badPhone =
    !PHONE_SHAPE.test(value.whatsapp) ||
    digits.length < 8 ||
    digits.length > 16;

  set(
    "whatsapp",
    checkText(value.whatsapp) ?? (badPhone ? "whatsapp" : undefined),
  );
  if (!badPhone) value.whatsapp = normalisePhone(value.whatsapp);

  // Only asked for when "Other" is the answer, and then it is the answer.
  if (value.profession === PROFESSION_OTHER) {
    set("professionOther", checkText(value.professionOther));
  } else {
    value.professionOther = "";
  }

  if (value.seminarDays.length === 0) errors.seminarDays = "required";

  return Object.keys(errors).length
    ? { ok: false, errors }
    : { ok: true, value };
}
