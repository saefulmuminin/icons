import { describe, expect, it } from "vitest";
import type { Registration } from "@/lib/registration";
import {
  META_FIELDS,
  newSpcId,
  simbaBody,
  simbaConfig,
  simbaVerdict,
  withoutApostrophes,
} from "@/lib/simba";
import type { SimbaConfig } from "@/lib/simba";

const config: SimbaConfig = {
  url: "https://example.test/api/ajax_event_register_peserta",
  key: "a-key",
  org: "3171100",
  eventId: "202",
};

/** An Indonesian registrant, filled in as the form would leave it. */
const local: Registration = {
  email: "romlah@example.org",
  prefix: "mrs",
  fullName: "Saputri",
  sex: "female",
  dialCode: "+62",
  whatsapp: "82303948822",
  institution: "BAZNAS Kabupaten Bogor",
  institutionKind: "baznas-kabkota",
  continent: "asia",
  country: "ID",
  province: "jawa-barat",
  city: "Bogor",
  profession: "amil",
  professionOther: "",
  submittedPaper: "yes",
  seminarDays: ["day-2", "day-3"],
};

const abroad: Registration = {
  ...local,
  continent: "europe",
  country: "DE",
  province: "international",
  city: "",
};

/** The multipart body, read back as plain strings. */
function read(entry: Registration) {
  const out: Record<string, string> = {};
  for (const [key, value] of simbaBody(entry, config, "12345")) {
    out[key] = typeof value === "string" ? value : "";
  }
  return out;
}

/** The custom fields, read back as {name: value} whatever shape they went in. */
const meta = (entry: Registration) => {
  const rows = JSON.parse(read(entry).meta) as {
    meta: string;
    value: string;
  }[];
  return Object.fromEntries(rows.map((row) => [row.meta, row.value]));
};

/** The pairs as sent, so their order and shape can be checked. */
const metaRows = (entry: Registration) =>
  JSON.parse(read(entry).meta) as { meta: string; value: string }[];

describe("the body SIMBA is sent", () => {
  /**
   * The exact set that was answered "Sukses". An extra key is not harmless
   * here: this endpoint has already refused one perfectly reasonable-looking
   * body for weeks.
   */
  it("carries exactly the keys the endpoint accepted", () => {
    expect(Object.keys(read(local)).sort()).toEqual(
      [
        "email",
        "foto",
        "hp",
        "id_event",
        "institusi",
        "jenis",
        "jenis_kelamin",
        "jumlah",
        "key",
        "meta",
        "nama",
        "org",
        "provinsi",
        "spc_id",
        "tanggal_bayar",
      ].sort(),
    );
  });

  it("passes the event's own settings through untouched", () => {
    const body = read(local);
    expect(body.org).toBe("3171100");
    expect(body.id_event).toBe("202");
    expect(body.key).toBe("a-key");
    expect(body.spc_id).toBe("12345");
    // Now sent from the registration itself, not from a fixed setting.
    expect(body.jenis).toBe("BAZNAS Kab/Kota");
  });

  /**
   * Sent empty, the endpoint refuses the whole registration — which is what it
   * did for weeks while these two were blank.
   */
  it("fills the payment fields even though the event is free", () => {
    expect(read(local).tanggal_bayar).toBe("1970-01-01");
    expect(read(local).jumlah).toBe("0");
  });

  /** Not a fixed id filing every registrant under one institution. */
  it("sends the institution the registrant actually typed", () => {
    expect(read(local).institusi).toBe("BAZNAS Kabupaten Bogor");
    expect(read({ ...local, institution: "IPB University" }).institusi).toBe(
      "IPB University",
    );
  });

  it("keeps the honorific with the name", () => {
    expect(read(local).nama).toBe("Mrs. Saputri");
  });

  it("writes the sex the way the endpoint does", () => {
    expect(read(local).jenis_kelamin).toBe("wanita");
    expect(read({ ...local, sex: "male" }).jenis_kelamin).toBe("pria");
  });

  it("sends the number as the registrant gave it", () => {
    expect(read(local).hp).toBe("+6282303948822");
  });
});

describe("the six custom fields", () => {
  /**
   * A list of {meta, value} pairs, which is the shape of the committee's most
   * recent example and of SIMBA's own form. The object shape it replaced was
   * also answered "Sukses", so nothing in the response distinguishes them.
   */
  it("are sent as pairs, in the order the event defines them", () => {
    expect(metaRows(local).map((row) => row.meta)).toEqual([...META_FIELDS]);

    for (const row of metaRows(local)) {
      expect(Object.keys(row).sort()).toEqual(["meta", "value"]);
    }
  });

  it("answer in Indonesian whoever filled the form in", () => {
    const rows = meta(abroad);
    expect(rows[META_FIELDS[0]]).toBe("Eropa");
    expect(rows[META_FIELDS[1]]).toBe("Jerman");
    expect(rows[META_FIELDS[3]]).toBe("Ya");
  });

  /** It goes in the field of its own, not in a custom one as well. */
  it("leave the institution to its own field", () => {
    expect(Object.keys(meta(local))).not.toContain("Nama institusi");
    expect(read(local).institusi).toBe("BAZNAS Kabupaten Bogor");
  });

  it("name both seminar days when both were chosen", () => {
    const value = meta(local)[META_FIELDS[4]];
    expect(value).toContain("Hari 2");
    expect(value).toContain("Hari 3");

    expect(
      meta({ ...local, seminarDays: ["day-3"] })[META_FIELDS[4]],
    ).not.toContain("Hari 2");
  });

  /** Otherwise every one of them files as the word "Lainnya". */
  it("send what Other actually meant", () => {
    expect(
      meta({ ...local, profession: "other", professionOther: "Journalist" })[
        META_FIELDS[2]
      ],
    ).toBe("Journalist");

    expect(meta(local)[META_FIELDS[2]]).toBe("Amil");
  });
});

describe("the province", () => {
  it("is the province itself for a registrant in Indonesia", () => {
    expect(read(local).provinsi).toBe("Jawa Barat");
  });

  it("says so plainly for everyone else", () => {
    expect(read(abroad).provinsi).toBe("Peserta Internasional");
  });
});

describe("the configuration", () => {
  /**
   * Nothing is read from the environment any more, so the only question left
   * is whether a key has been pasted in. Blank means refuse, not proceed: a
   * registration that reaches nobody must not be answered with a thank you.
   */
  it("is withheld until there is a key to use", () => {
    const config = simbaConfig();
    if (config === null) return;

    expect(config.key.trim()).not.toBe("");
    expect(config.org).toBe("3171100");
    expect(config.eventId).toBe("202");
    expect(config.url).toBe(
      "https://simba.baznas.go.id/api/ajax_event_register_peserta",
    );
  });

  it("names the production host and event, key or no key", () => {
    const body = read(local);
    expect(body.id_event).toBe("202");
    expect(body.org).toBe("3171100");
  });
});

/**
 * Every string here was captured from the live endpoint. SIMBA answers HTTP
 * 200 to all of them, refusals included, which is exactly why the form once
 * thanked people for registrations that were never filed.
 */
describe("reading what SIMBA answered", () => {
  const refusals = [
    ['{"status_code":"101","status":"Key Invalid"}', "Key Invalid"],
    [
      '{"status_code":"101","status":"Data Invalid","error":"<div><br>Kolom <span class=\\"field\\" >Nama peserta</span> harus diisi<br></div>"}',
      "Nama peserta",
    ],
    ['{"status_code":"403","status":"Data exist or failed"}', "Data exist"],
  ] as const;

  it("treats every refusal as one", () => {
    for (const [body, expected] of refusals) {
      const verdict = simbaVerdict(body);
      expect(verdict.accepted).toBe(false);
      if (!verdict.accepted) expect(verdict.reason).toContain(expected);
    }
  });

  it("keeps the words out of the markup SIMBA wraps them in", () => {
    const verdict = simbaVerdict(refusals[1][0]);
    if (!verdict.accepted) {
      expect(verdict.reason).not.toContain("<");
      expect(verdict.reason).toContain("harus diisi");
    }
  });

  /** The one SIMBA actually answers on success — not 100, not 200. */
  it("takes the success it really sends", () => {
    expect(
      simbaVerdict('{"status_code":"000","status":"Sukses"}').accepted,
    ).toBe(true);
    expect(simbaVerdict('{"status_code":"100","status":"OK"}').accepted).toBe(
      true,
    );
  });

  /** An envelope this does not describe is not evidence of a refusal. */
  it("does not invent a refusal out of a body it cannot read", () => {
    expect(simbaVerdict("").accepted).toBe(true);
    expect(simbaVerdict("<html>oops</html>").accepted).toBe(true);
    expect(simbaVerdict('{"id":91}').accepted).toBe(true);
  });
});

/**
 * The one that hid the whole problem. A repeated spc_id is refused as "Data
 * exist or failed" — the same words SIMBA uses for every other refusal — so a
 * fixed value worked twice and then looked like a broken endpoint for weeks.
 */
describe("the registration number", () => {
  it("is different every time", () => {
    const seen = new Set(Array.from({ length: 500 }, newSpcId));
    expect(seen.size).toBe(500);
  });

  it("stays inside what SIMBA can store", () => {
    for (let i = 0; i < 500; i++) {
      const n = Number(newSpcId());
      expect(Number.isInteger(n)).toBe(true);
      expect(n).toBeGreaterThan(0);
      // A millisecond timestamp is thirteen digits and would not fit.
      expect(n).toBeLessThan(2_147_483_647);
    }
  });

  it("reaches the body SIMBA is sent", () => {
    const of = (spc: string) => {
      for (const [key, value] of simbaBody(local, config, spc)) {
        if (key === "spc_id") return value;
      }
    };

    expect(of("777")).toBe("777");
    expect(of("888")).toBe("888");
  });
});

/**
 * A straight apostrophe is the one character SIMBA will not take, and it says
 * so with the same three words it uses for every other refusal. Quotes,
 * backslashes, semicolons, angle brackets, backticks, percent signs and
 * accented letters were all tried against the live endpoint and all accepted.
 */
describe("the one character SIMBA refuses", () => {
  it("is swapped for the typographic one, not stripped", () => {
    expect(withoutApostrophes("Saeful Mu'minin")).toBe("Saeful Mu\u2019minin");
    expect(withoutApostrophes("Ma'had Al-Jami'ah")).toBe(
      "Ma\u2019had Al-Jami\u2019ah",
    );
  });

  it("leaves everything else exactly as it was", () => {
    const untouched =
      'Dr. A & B, M.Si. "x" \\ ; <y> ` 100% / (z) Müller — 2026';
    expect(withoutApostrophes(untouched)).toBe(untouched);
  });

  it("reaches every field of the body, name and institution alike", () => {
    const body = simbaBody(
      { ...local, fullName: "Saeful Mu'minin", institution: "Ma'had" },
      config,
      "1",
    );

    const parts: Record<string, string> = {};
    for (const [key, value] of body) {
      if (typeof value === "string") parts[key] = value;
    }

    expect(parts.nama).toBe("Mrs. Saeful Mu\u2019minin");
    expect(parts.institusi).toBe("Ma\u2019had");

    // The custom fields carry free text of their own — a profession typed
    // under "Other" reaches SIMBA through here.
    expect(parts.meta).not.toContain("'");
  });
});
