import { describe, expect, it } from "vitest";
import type { Registration } from "@/lib/registration";
import { META_FIELDS, simbaBody, simbaConfig } from "@/lib/simba";
import type { SimbaConfig } from "@/lib/simba";

const config: SimbaConfig = {
  url: "https://example.test/api/ajax_event_register_peserta",
  key: "a-key",
  org: "3171100",
  eventId: "128",
  spcId: "5",
  jenis: "2",
  institusi: "28",
};

/** An Indonesian registrant, filled in as the form would leave it. */
const local: Registration = {
  email: "romlah@example.org",
  prefix: "mrs",
  fullName: "Saputri",
  sex: "female",
  whatsapp: "+6282303948822",
  institution: "BAZNAS Kabupaten Bogor",
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

const read = (entry: Registration) => simbaBody(entry, config);
const meta = (entry: Registration) =>
  JSON.parse(read(entry).get("meta") ?? "[]") as {
    meta: string;
    value: string;
  }[];

describe("the body SIMBA is sent", () => {
  /** Every key from the committee's own example, and nothing invented. */
  it("carries exactly the keys the endpoint expects", () => {
    expect([...read(local).keys()].sort()).toEqual(
      [
        "email",
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
        "payment",
        "payment_attachment",
        "provinsi",
        "spc_id",
        "tanggal_bayar",
      ].sort(),
    );
  });

  it("passes the event's own settings through untouched", () => {
    const body = read(local);
    expect(body.get("org")).toBe("3171100");
    expect(body.get("id_event")).toBe("128");
    expect(body.get("key")).toBe("a-key");
    expect(body.get("spc_id")).toBe("5");
    expect(body.get("jenis")).toBe("2");
    expect(body.get("institusi")).toBe("28");
  });

  it("leaves the payment fields empty, as the event takes none", () => {
    for (const key of [
      "tanggal_bayar",
      "jumlah",
      "payment_attachment",
      "payment",
    ]) {
      expect(read(local).get(key)).toBe("");
    }
  });

  it("keeps the honorific with the name", () => {
    expect(read(local).get("nama")).toBe("Mrs. Saputri");
  });

  it("writes the sex the way the example does", () => {
    expect(read(local).get("jenis_kelamin")).toBe("wanita");
    expect(read({ ...local, sex: "male" }).get("jenis_kelamin")).toBe("pria");
  });

  it("sends the number as the registrant gave it", () => {
    expect(read(local).get("hp")).toBe("+6282303948822");
  });
});

describe("the six custom fields", () => {
  it("are sent under the exact names SIMBA holds them by", () => {
    expect(meta(local).map((one) => one.meta)).toEqual([...META_FIELDS]);
  });

  it("answer in Indonesian whoever filled the form in", () => {
    const rows = meta(abroad);
    expect(rows[1].value).toBe("Eropa");
    expect(rows[2].value).toBe("Jerman");
    expect(rows[4].value).toBe("Ya");
  });

  it("carry the institution as written", () => {
    expect(meta(local)[0].value).toBe("BAZNAS Kabupaten Bogor");
  });

  it("name both seminar days when both were chosen", () => {
    const value = meta(local)[5].value;
    expect(value).toContain("Hari 2");
    expect(value).toContain("Hari 3");

    expect(meta({ ...local, seminarDays: ["day-3"] })[5].value).not.toContain(
      "Hari 2",
    );
  });

  /** Otherwise every one of them files as the word "Lainnya". */
  it("send what Other actually meant", () => {
    expect(
      meta({ ...local, profession: "other", professionOther: "Journalist" })[3]
        .value,
    ).toBe("Journalist");

    expect(meta(local)[3].value).toBe("Amil");
  });
});

describe("the province", () => {
  it("is the province itself for a registrant in Indonesia", () => {
    expect(read(local).get("provinsi")).toBe("Jawa Barat");
  });

  it("says so plainly for everyone else", () => {
    expect(read(abroad).get("provinsi")).toBe("Peserta Internasional");
  });
});

describe("the configuration", () => {
  const full = {
    SIMBA_URL: "https://example.test",
    SIMBA_KEY: "k",
    SIMBA_ORG: "1",
    SIMBA_EVENT_ID: "2",
  };

  it("is refused unless all four of the essentials are given", () => {
    expect(simbaConfig(full)).not.toBeNull();

    for (const missing of Object.keys(full)) {
      const partial = { ...full, [missing]: "" };
      expect(simbaConfig(partial)).toBeNull();
    }
  });

  it("falls back to the event settings from the committee's example", () => {
    const config = simbaConfig(full);
    expect(config?.spcId).toBe("5");
    expect(config?.jenis).toBe("2");
    expect(config?.institusi).toBe("28");
  });
});
