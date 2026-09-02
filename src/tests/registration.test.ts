import { describe, expect, it } from "vitest";
import { CONFERENCE } from "@/lib/content";
import type { Choice, Registration } from "@/lib/registration";
import {
  CONTINENTS,
  COUNTRIES,
  INDONESIA,
  INTERNATIONAL,
  DIAL_CODES,
  INSTITUTION_KINDS,
  cascade,
  countriesIn,
  dialOf,
  kindOf,
  fullPhone,
  MAX_FIELD,
  PAPER_ANSWERS,
  PREFIXES,
  PROFESSIONS,
  PROVINCES,
  SEMINAR_DAYS,
  SEXES,
  conferenceDate,
  validateRegistration,
} from "@/lib/registration";

const LISTS: [string, Choice[]][] = [
  ["prefixes", PREFIXES],
  ["sexes", SEXES],
  ["continents", CONTINENTS],
  ["provinces", PROVINCES],
  ["professions", PROFESSIONS],
  ["paper answers", PAPER_ANSWERS],
  ["seminar days", SEMINAR_DAYS],
];

/** One submission with nothing wrong with it, to vary a field at a time from. */
const good: Registration = {
  email: "adibah@example.org",
  prefix: "ms",
  fullName: "Siti Adibah",
  sex: "female",
  dialCode: "+62",
  whatsapp: "8180652974",
  institution: "IPB University",
  continent: "asia",
  country: "ID",
  province: "jawa-barat",
  city: "Bogor",
  profession: "researcher",
  professionOther: "",
  submittedPaper: "yes",
  seminarDays: ["day-2", "day-3"],
};

const accepts = (patch: Partial<Registration>) =>
  validateRegistration({ ...good, ...patch }).ok;

/** The code a field was rejected with, or undefined if it passed. */
function why(patch: Partial<Registration>, field: keyof Registration) {
  const result = validateRegistration({ ...good, ...patch });
  return result.ok ? undefined : result.errors[field];
}

describe("every list of choices", () => {
  it.each(LISTS)("gives %s a value of its own", (_name, choices) => {
    const values = choices.map((choice) => choice.value);
    expect(new Set(values).size).toBe(values.length);
  });

  it.each(LISTS)("names %s in both languages", (_name, choices) => {
    for (const choice of choices) {
      expect(choice.en.trim()).not.toBe("");
      expect(choice.id.trim()).not.toBe("");
      expect(choice.value).toMatch(/^[a-z0-9-]+$/);
    }
  });
});

describe("the provinces", () => {
  it("lists the thirty-four, and nothing that is not one", () => {
    expect(PROVINCES).toHaveLength(34);
    expect(PROVINCES.map((one) => one.value)).not.toContain(INTERNATIONAL);
  });
});

describe("the countries", () => {
  it("each sit on exactly one continent the form offers", () => {
    const continents = new Set(CONTINENTS.map((one) => one.value));
    for (const country of COUNTRIES) {
      expect(continents.has(country.continent)).toBe(true);
    }
  });

  it("are named in both languages, and only once each", () => {
    const codes = COUNTRIES.map((one) => one.value);
    expect(new Set(codes).size).toBe(codes.length);

    for (const country of COUNTRIES) {
      expect(country.en.trim()).not.toBe("");
      expect(country.id.trim()).not.toBe("");
    }
  });

  it("leave no continent with an empty list", () => {
    for (const continent of CONTINENTS) {
      expect(countriesIn(continent.value).length).toBeGreaterThan(0);
    }
  });

  /** The whole cascade hangs off this one row being findable. */
  it("include Indonesia, under Asia", () => {
    const home = COUNTRIES.find((one) => one.value === INDONESIA);
    expect(home?.continent).toBe("asia");
    expect(countriesIn("asia")).toContain(home);
  });
});

describe("a country that does not sit on the continent given", () => {
  it("is refused, however real the country itself is", () => {
    expect(why({ continent: "europe", country: "ID" }, "country")).toBe(
      "required",
    );
    expect(why({ continent: "asia", country: "DE" }, "country")).toBe(
      "required",
    );
    expect(accepts({ continent: "europe", country: "DE" })).toBe(true);
  });

  it("is refused when the country is not a country at all", () => {
    expect(why({ country: "Indonesia" }, "country")).toBe("required");
    expect(why({ country: "" }, "country")).toBe("required");
  });
});

/**
 * The old form asked every foreign registrant to answer "International
 * Participant" twice by hand. Now the country settles it, and the two fields
 * are never put to them at all.
 */
describe("a registrant living outside Indonesia", () => {
  const abroad = { continent: "europe", country: "DE" } as const;

  it("is accepted without a province or a city", () => {
    expect(accepts({ ...abroad, province: "", city: "" })).toBe(true);
  });

  it("is filed as an international participant either way", () => {
    const result = validateRegistration({
      ...good,
      ...abroad,
      province: "jawa-barat",
      city: "Bogor",
    });

    expect(result.ok && result.value.province).toBe(INTERNATIONAL);
    expect(result.ok && result.value.city).toBe("");
  });
});

describe("a registrant living in Indonesia", () => {
  it("is asked for a province and a city", () => {
    expect(why({ province: "", city: "" }, "province")).toBe("required");
    expect(why({ province: "", city: "" }, "city")).toBe("required");
  });

  it("cannot file International Participant as their province", () => {
    expect(why({ province: INTERNATIONAL }, "province")).toBe("required");
  });
});

/**
 * Without this the form keeps an answer that is no longer on offer: pick Asia
 * and Indonesia, change to Europe, and Indonesia is still sitting in a field
 * whose menu no longer contains it.
 */
describe("changing an answer higher up", () => {
  it("clears the country and everything under it", () => {
    expect(cascade(good, "continent")).toMatchObject({
      country: "",
      province: "",
      city: "",
    });
  });

  it("clears the province and city when the country changes", () => {
    const after = cascade(good, "country");
    expect(after.province).toBe("");
    expect(after.city).toBe("");
    expect(after.country).toBe(good.country);
  });

  it("leaves the rest of the form alone", () => {
    expect(cascade(good, "fullName")).toEqual(good);
    expect(cascade(good, "continent").fullName).toBe(good.fullName);
  });
});

/**
 * The seminar days are counted off the conference's opening date rather than
 * typed out, so a change of dates cannot leave the form offering days the
 * countdown disagrees with.
 */
describe("the seminar days", () => {
  it("are the second and third day of the conference", () => {
    expect(SEMINAR_DAYS.map((day) => day.value)).toEqual(["day-2", "day-3"]);
    expect(SEMINAR_DAYS[0].en).toContain(conferenceDate(2, "en"));
    expect(SEMINAR_DAYS[1].en).toContain(conferenceDate(3, "en"));
  });

  it("name days the conference actually runs", () => {
    for (const day of [1, 2, 3]) {
      const named = new Date(`${conferenceDate(day, "en")} UTC`).getTime();
      expect(named).toBeGreaterThanOrEqual(
        Date.parse(CONFERENCE.startsAt.slice(0, 10)),
      );
      expect(named).toBeLessThanOrEqual(
        Date.parse(CONFERENCE.endsAt.slice(0, 10)),
      );
    }
  });
});

describe("a complete registration", () => {
  it("is accepted", () => {
    const result = validateRegistration(good);
    expect(result.ok).toBe(true);
  });

  it("comes back tidied", () => {
    const result = validateRegistration({
      ...good,
      email: "  Adibah@Example.ORG ",
      fullName: "  Siti   Adibah  ",
    });

    expect(result.ok && result.value.email).toBe("adibah@example.org");
    expect(result.ok && result.value.fullName).toBe("Siti Adibah");
  });
});

describe("an empty form", () => {
  it("is refused, and says so of every question at once", () => {
    const result = validateRegistration({});
    expect(result.ok).toBe(false);

    if (!result.ok) {
      // Everything but the follow-up that only "Other" opens.
      expect(Object.keys(result.errors).sort()).toEqual([
        "continent",
        "country",
        "email",
        "fullName",
        "institution",
        "prefix",
        "profession",
        "seminarDays",
        "sex",
        "submittedPaper",
        "whatsapp",
      ]);
    }
  });

  it("survives being handed something that is not an object at all", () => {
    for (const junk of [null, undefined, "", 42, []]) {
      expect(validateRegistration(junk).ok).toBe(false);
    }
  });
});

describe("the email address", () => {
  it("takes the shapes people actually hold", () => {
    for (const email of [
      "a@b.co",
      "first.last+tag@sub.domain.ac.id",
      "someone@example.museum",
    ]) {
      expect(accepts({ email })).toBe(true);
    }
  });

  it("turns away what cannot be one", () => {
    for (const email of ["adibah", "adibah@", "@example.org", "a b@c.d"]) {
      expect(why({ email }, "email")).toBeDefined();
    }
  });
});

describe("the WhatsApp number", () => {
  it("takes the number however it is punctuated", () => {
    for (const whatsapp of ["818-0652-9744", "818 0652 9744", "8180652974"]) {
      expect(accepts({ whatsapp })).toBe(true);
    }
  });

  /** Three spellings of one number should not read as three when the
   *  committee sorts the column. */
  it("is filed as digits, whatever it was typed with", () => {
    for (const typed of ["818-0652-9744", "(818) 0652.9744", "818 0652 9744"]) {
      const result = validateRegistration({ ...good, whatsapp: typed });
      expect(result.ok && result.value.whatsapp).toBe("81806529744");
    }
  });

  /** Tidying before checking would turn this into a plausible twelve digits. */
  it("is checked before it is tidied, so letters cannot slip through", () => {
    expect(why({ whatsapp: "818-callme-9744" }, "whatsapp")).toBe("whatsapp");
  });

  it("turns away what nobody could call", () => {
    for (const whatsapp of ["", "1234", "not a number"]) {
      expect(why({ whatsapp }, "whatsapp")).toBeDefined();
    }
  });

  /** The code is half of the same question, so it complains in the same place
   *  rather than opening a second one. */
  it("needs a dialling code, and says so on the number", () => {
    expect(why({ dialCode: "" }, "whatsapp")).toBe("required");
    expect(why({ dialCode: "+999999" }, "whatsapp")).toBe("required");
  });
});

describe("a dialling code and a local number", () => {
  /**
   * The leading zero is the domestic trunk prefix — the 0 in 0812 means
   * "another number inside this country" — and +62 already says which country.
   * Left on, it dials a number that does not exist.
   */
  it("are joined without the trunk zero", () => {
    expect(fullPhone("+62", "081806529744")).toBe("+6281806529744");
    expect(fullPhone("+62", "81806529744")).toBe("+6281806529744");
    expect(fullPhone("+49", "030 12345678")).toBe("+493012345678");
  });

  it("come to nothing when there is no number", () => {
    expect(fullPhone("+62", "")).toBe("");
    expect(fullPhone("+62", "000")).toBe("");
  });
});

describe("the dialling codes", () => {
  it("offer each code once, in numeric order", () => {
    expect(new Set(DIAL_CODES).size).toBe(DIAL_CODES.length);

    const numbers = DIAL_CODES.map((code) => Number(code.slice(1)));
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
  });

  it("are all a plus and digits", () => {
    for (const code of DIAL_CODES) expect(code).toMatch(/^\+\d{1,4}$/);
  });

  /** Every country has to be reachable, or somebody cannot register at all. */
  it("cover every country the form offers", () => {
    for (const country of COUNTRIES) {
      expect(DIAL_CODES).toContain(country.dial);
    }
  });

  it("know the ones the committee will look for first", () => {
    expect(dialOf("ID")).toBe("+62");
    expect(dialOf("MY")).toBe("+60");
    expect(dialOf("SA")).toBe("+966");
    expect(dialOf("nowhere")).toBe("");
  });
});

describe("a choice that was never offered", () => {
  it("is refused rather than stored", () => {
    expect(why({ prefix: "dr" }, "prefix")).toBe("required");
    expect(why({ province: "atlantis" }, "province")).toBe("required");
    expect(why({ continent: "atlantis" }, "continent")).toBe("required");
    expect(why({ profession: "pirate" }, "profession")).toBe("required");
    expect(why({ submittedPaper: "maybe" }, "submittedPaper")).toBe("required");
  });

  it("is dropped from the days rather than taken along", () => {
    const result = validateRegistration({
      ...good,
      seminarDays: ["day-2", "day-9", "; drop table"],
    });

    expect(result.ok && result.value.seminarDays).toEqual(["day-2"]);
  });
});

describe("the seminar day question", () => {
  it("needs at least one day", () => {
    expect(why({ seminarDays: [] }, "seminarDays")).toBe("required");
    expect(why({ seminarDays: ["nonsense"] }, "seminarDays")).toBe("required");
  });

  it("takes one day or both", () => {
    expect(accepts({ seminarDays: ["day-2"] })).toBe(true);
    expect(accepts({ seminarDays: ["day-2", "day-3"] })).toBe(true);
  });
});

describe("the profession", () => {
  it("asks what Other means before accepting it", () => {
    expect(
      why({ profession: "other", professionOther: "" }, "professionOther"),
    ).toBe("required");
    expect(
      accepts({ profession: "other", professionOther: "Journalist" }),
    ).toBe(true);
  });

  /** Otherwise a reader who picks Other, types, then changes their mind files
   *  a researcher who is also a journalist. */
  it("forgets what Other meant once it is no longer Other", () => {
    const result = validateRegistration({
      ...good,
      profession: "student",
      professionOther: "Journalist",
    });

    expect(result.ok && result.value.professionOther).toBe("");
  });
});

describe("an answer longer than the form takes", () => {
  it("is refused, and the boundary itself is not", () => {
    expect(accepts({ fullName: "a".repeat(MAX_FIELD) })).toBe(true);
    expect(why({ fullName: "a".repeat(MAX_FIELD + 1) }, "fullName")).toBe(
      "long",
    );
  });
});

/**
 * SIMBA accepts anything non-empty here — "GADO-GADO XYZ 123" was taken — so
 * nothing on the far side will turn five spellings of one office into one
 * category. The list is what does that, and the guess is what stops it being
 * another question people have to think about.
 */
describe("the kind of institution", () => {
  it("offers each kind once, named in both languages", () => {
    const values = INSTITUTION_KINDS.map((one) => one.value);
    expect(new Set(values).size).toBe(values.length);

    for (const kind of INSTITUTION_KINDS) {
      expect(kind.en.trim()).not.toBe("");
      expect(kind.id.trim()).not.toBe("");
    }
  });

  it("reads a BAZNAS office down to its level", () => {
    expect(kindOf("BAZNAS Provinsi Jawa Barat")).toBe("baznas-provinsi");
    expect(kindOf("BAZNAS Kabupaten Bogor")).toBe("baznas-kabkota");
    expect(kindOf("BAZNAS Kota Bandung")).toBe("baznas-kabkota");
    expect(kindOf("BAZNAS RI")).toBe("baznas-ri");
    expect(kindOf("baznas")).toBe("baznas-ri");
  });

  it("reads a campus, however it is written", () => {
    for (const name of [
      "IPB University",
      "Universitas Indonesia",
      "UIN Syarif Hidayatullah",
      "Institut Teknologi Bandung",
      "Politeknik Negeri Jakarta",
    ]) {
      expect(kindOf(name)).toBe("kampus");
    }
  });

  it("reads a ministry and a zakat institution", () => {
    expect(kindOf("Kementerian Agama")).toBe("pemerintah");
    expect(kindOf("LAZ Al-Azhar")).toBe("laz");
  });

  /** Anything it cannot read lands where it would have gone anyway. */
  it("falls to Institusi rather than guessing cleverly", () => {
    expect(kindOf("PT Sejahtera Abadi")).toBe("institusi");
    expect(kindOf("")).toBe("institusi");
  });

  it("is a kind the form actually offers", () => {
    const values = INSTITUTION_KINDS.map((one) => one.value);
    for (const name of ["BAZNAS RI", "IPB", "Kemenag", "apa saja", ""]) {
      expect(values).toContain(kindOf(name));
    }
  });
});

/**
 * Nobody is asked this. It is worked out from the institution and sent on the
 * registrant's behalf, so the guess is the whole of the answer — there is no
 * dropdown behind it to catch what it gets wrong.
 */
describe("the kind that is never asked for", () => {
  it("has an answer for any name at all", () => {
    const values = INSTITUTION_KINDS.map((one) => one.value);
    for (const name of ["BAZNAS RI", "IPB", "Kemenag", "apa saja", ""]) {
      expect(values).toContain(kindOf(name));
    }
  });

  it("is not a question the form can fail on", () => {
    const result = validateRegistration(good);
    expect(result.ok).toBe(true);
    expect(Object.keys(good)).not.toContain("institutionKind");
  });
});
