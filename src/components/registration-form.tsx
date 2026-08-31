"use client";

import { useId, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import type { Dict, Lang } from "@/lib/i18n";
import type {
  Choice,
  ErrorCode,
  Errors,
  Field,
  Registration,
} from "@/lib/registration";
import {
  CONTINENTS,
  EMPTY,
  INDONESIA,
  cascade,
  normalisePhone,
  countriesIn,
  MAX_FIELD,
  PAPER_ANSWERS,
  PREFIXES,
  PROFESSION_OTHER,
  PROFESSIONS,
  PROVINCES,
  SEMINAR_DAYS,
  SEXES,
  labelOf,
  validateRegistration,
} from "@/lib/registration";

/** Which sentence a rejection is told in. The codes themselves carry no language. */
const MESSAGE: Record<ErrorCode, keyof Dict> = {
  required: "regErrRequired",
  email: "regErrEmail",
  whatsapp: "regErrWhatsapp",
  long: "regErrLong",
};

const CONTROL =
  "w-full rounded-xl border bg-paper px-4 py-3 font-sans text-[0.9375rem] text-ink transition-colors outline-none placeholder:text-faint focus:border-brand focus:ring-2 focus:ring-brand/20";

const QUIET = "border-ink/15";
const WRONG = "border-step-amber ring-1 ring-step-amber/30";

/**
 * Everything a field needs to draw and answer for itself, handed down in one
 * prop.
 *
 * The pieces below live at module scope rather than inside the form, which
 * matters more than it looks: a component declared inside another is a new
 * type on every render, so React tears the old input down and builds a fresh
 * one — and the cursor leaves the box after every single character typed.
 */
type Ctl = {
  t: Dict;
  lang: Lang;
  values: Registration;
  errors: Errors;
  tried: boolean;
  idOf: (field: Field) => string;
  set: (field: Field, value: string | string[]) => void;
};

const wrongAt = (ctl: Ctl, field: Field) =>
  ctl.tried && Boolean(ctl.errors[field]);

/** Everything a control needs to announce its own state to a screen reader. */
function wire(ctl: Ctl, field: Field) {
  const bad = wrongAt(ctl, field);

  return {
    id: ctl.idOf(field),
    "aria-invalid": bad || undefined,
    "aria-describedby": bad ? `${ctl.idOf(field)}-error` : undefined,
    className: `${CONTROL} ${bad ? WRONG : QUIET}`,
  };
}

/** A labelled row: the question, its aside, the control, and what went wrong. */
function Row({
  ctl,
  field,
  label,
  help,
  group = false,
  className = "",
  children,
}: {
  ctl: Ctl;
  field: Field;
  label: string;
  help?: string;
  /** True where the control is a set of radios or checkboxes, which a single
   *  `label` cannot point at — those get a labelled group instead. */
  group?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const code = ctl.tried ? ctl.errors[field] : undefined;
  const labelId = `${ctl.idOf(field)}-label`;

  const head = (
    <>
      <span
        id={labelId}
        className="block font-sans text-[0.8125rem] font-semibold text-ink"
      >
        {label}
      </span>
      {help ? (
        <span className="mt-1 block font-sans text-[0.75rem] leading-[1.5] text-muted">
          {help}
        </span>
      ) : null}
      <span className="mt-2 block">{children}</span>
      {code ? (
        <span
          id={`${ctl.idOf(field)}-error`}
          className="mt-1.5 block font-sans text-[0.75rem] text-step-amber"
        >
          {ctl.t[MESSAGE[code]]}
        </span>
      ) : null}
    </>
  );

  if (group) {
    return (
      <div
        role="group"
        aria-labelledby={labelId}
        className={`block ${className}`}
      >
        {head}
      </div>
    );
  }

  return (
    <label htmlFor={ctl.idOf(field)} className={`block ${className}`}>
      {head}
    </label>
  );
}

function Text({
  ctl,
  field,
  type = "text",
  autoComplete,
  inputMode,
  clean,
}: {
  ctl: Ctl;
  field: Field;
  type?: string;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "email";
  /** Rewrites what was typed before it is kept, for a field that takes only
   *  one kind of character. */
  clean?: (raw: string) => string;
}) {
  return (
    <input
      {...wire(ctl, field)}
      type={type}
      autoComplete={autoComplete}
      inputMode={inputMode}
      maxLength={MAX_FIELD}
      value={ctl.values[field] as string}
      onChange={(event) =>
        ctl.set(field, clean ? clean(event.target.value) : event.target.value)
      }
    />
  );
}

function Select({
  ctl,
  field,
  choices,
  placeholder,
  disabled = false,
}: {
  ctl: Ctl;
  field: Field;
  choices: readonly Choice[];
  placeholder?: string;
  disabled?: boolean;
}) {
  const wired = wire(ctl, field);

  return (
    <select
      {...wired}
      disabled={disabled}
      className={`${wired.className} disabled:cursor-not-allowed disabled:bg-cream disabled:text-faint`}
      value={ctl.values[field] as string}
      onChange={(event) => ctl.set(field, event.target.value)}
    >
      <option value="">{placeholder ?? ctl.t.regChoose}</option>
      {choices.map((choice) => (
        <option key={choice.value} value={choice.value}>
          {labelOf(choice, ctl.lang)}
        </option>
      ))}
    </select>
  );
}

/**
 * Radios and checkboxes differ only in how a click lands, so they share the
 * pill: an outlined chip that fills brand green once chosen. The real control
 * stays in the markup, only visually hidden, so the keyboard and screen
 * readers get the standard behaviour rather than an imitation of it.
 */
function Pills({
  ctl,
  field,
  choices,
  multiple = false,
}: {
  ctl: Ctl;
  field: Field;
  choices: Choice[];
  multiple?: boolean;
}) {
  const current = ctl.values[field];
  const chosen = Array.isArray(current) ? current : [current];
  const bad = wrongAt(ctl, field);

  return (
    <span className="flex flex-wrap gap-2">
      {choices.map((choice, index) => {
        const on = chosen.includes(choice.value);

        return (
          <label
            key={choice.value}
            className={`cursor-pointer rounded-full border px-4 py-2.5 font-sans text-[0.875rem] transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand ${
              on
                ? "border-brand bg-brand font-semibold text-white"
                : `${bad ? "border-step-amber" : "border-ink/15"} bg-paper text-body hover:border-brand hover:text-brand`
            }`}
          >
            <input
              type={multiple ? "checkbox" : "radio"}
              // The group answers to one id, so only the first pill carries it —
              // that is what a jump to the first unanswered question lands on.
              id={index === 0 ? ctl.idOf(field) : undefined}
              name={`${ctl.idOf(field)}-choice`}
              value={choice.value}
              checked={on}
              aria-invalid={bad || undefined}
              aria-describedby={bad ? `${ctl.idOf(field)}-error` : undefined}
              onChange={() => {
                if (!multiple) return ctl.set(field, choice.value);

                const now = Array.isArray(current) ? current : [];
                ctl.set(
                  field,
                  on
                    ? now.filter((one) => one !== choice.value)
                    : [...now, choice.value],
                );
              }}
              className="sr-only"
            />
            {labelOf(choice, ctl.lang)}
          </label>
        );
      })}
    </span>
  );
}

const blank = (): Registration => ({ ...EMPTY, seminarDays: [] });

export function RegistrationForm({ lang, t }: { lang: Lang; t: Dict }) {
  const uid = useId();
  const [values, setValues] = useState<Registration>(blank);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "failed">(
    "idle",
  );

  // Nothing is marked wrong until the reader has tried once. Complaining about
  // an empty box the moment it is stepped out of is how a form reads as hostile.
  const [tried, setTried] = useState(false);

  const trap = useRef<HTMLInputElement>(null);

  const idOf = (field: Field) => `${uid}-${field}`;

  const set = (field: Field, value: string | string[]) => {
    const next = cascade({ ...values, [field]: value } as Registration, field);
    setValues(next);

    // Once the form has complained, it takes the correction back straight
    // away rather than making the reader submit again to find out.
    if (tried) {
      const check = validateRegistration(next);
      setErrors(check.ok ? {} : check.errors);
    }
  };

  const ctl: Ctl = { t, lang, values, errors, tried, idOf, set };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTried(true);

    const check = validateRegistration(values);
    if (!check.ok) {
      setErrors(check.errors);
      setStatus("idle");

      // Send the reader to the first thing that needs them, rather than
      // leaving them to hunt for it down a form this long.
      const first = Object.keys(check.errors)[0] as Field | undefined;
      if (first) {
        requestAnimationFrame(() => {
          const el = document.getElementById(idOf(first));
          el?.focus({ preventScroll: true });
          el?.scrollIntoView({ block: "center", behavior: "smooth" });
        });
      }
      return;
    }

    setErrors({});
    setStatus("sending");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...check.value,
          website: trap.current?.value ?? "",
        }),
      });

      if (!response.ok) throw new Error(String(response.status));
      setStatus("done");
    } catch {
      setStatus("failed");
    }
  }

  if (status === "done") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-brand/25 bg-sage px-6 py-10 text-center sm:px-10"
      >
        <div
          aria-hidden
          className="mx-auto grid size-12 place-items-center rounded-full bg-brand text-2xl text-white"
        >
          ✓
        </div>
        <h2 className="mt-5 font-display text-[1.375rem] leading-tight font-bold">
          {t.regDoneTitle}
        </h2>
        <p className="mx-auto mt-3 max-w-[42ch] font-sans text-[0.9375rem] leading-[1.65] text-pretty text-muted">
          {t.regDoneText}
        </p>
        <button
          type="button"
          onClick={() => {
            setValues(blank());
            setErrors({});
            setTried(false);
            setStatus("idle");
          }}
          className="mt-7 rounded-full border border-ink/20 px-[1.375rem] py-[0.8125rem] font-display text-sm font-bold text-ink transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {t.regDoneAgain}
        </button>
      </div>
    );
  }

  const other = values.profession === PROFESSION_OTHER;

  return (
    <form noValidate onSubmit={submit} className="grid gap-5">
      <p className="font-sans text-[0.8125rem] text-muted">{t.regFormNote}</p>

      <Row ctl={ctl} field="email" label={t.regEmail}>
        <Text
          ctl={ctl}
          field="email"
          type="email"
          autoComplete="email"
          inputMode="email"
        />
      </Row>

      <div className="grid gap-5 sm:grid-cols-[minmax(0,8rem)_minmax(0,1fr)]">
        <Row ctl={ctl} field="prefix" label={t.regPrefix}>
          <Select ctl={ctl} field="prefix" choices={PREFIXES} />
        </Row>
        <Row ctl={ctl} field="fullName" label={t.regFullName}>
          <Text ctl={ctl} field="fullName" autoComplete="name" />
        </Row>
      </div>

      <Row ctl={ctl} field="sex" label={t.regSex} group>
        <Pills ctl={ctl} field="sex" choices={SEXES} />
      </Row>

      <div className="grid gap-5 sm:grid-cols-2">
        <Row
          ctl={ctl}
          field="whatsapp"
          label={t.regWhatsapp}
          help={t.regWhatsappHelp}
        >
          {/* Digits only, and the one leading plus that means "country code".
              Anything else is dropped as it is typed or pasted, so the field
              cannot hold a number that is not one.

              Deliberately not type="number": that would offer spinners, drop
              the plus, and eat the leading zero off 0818… */}
          <Text
            ctl={ctl}
            field="whatsapp"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            clean={normalisePhone}
          />
        </Row>
        <Row ctl={ctl} field="institution" label={t.regInstitution}>
          <Text ctl={ctl} field="institution" autoComplete="organization" />
        </Row>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Row ctl={ctl} field="continent" label={t.regContinent}>
          <Select ctl={ctl} field="continent" choices={CONTINENTS} />
        </Row>
        {/* Only ever the countries of the continent above, so the two answers
            cannot contradict each other. Shut until that one is given. */}
        <Row ctl={ctl} field="country" label={t.regCountry}>
          <Select
            ctl={ctl}
            field="country"
            choices={countriesIn(values.continent)}
            placeholder={values.continent ? t.regChoose : t.regContinentFirst}
            disabled={!values.continent}
          />
        </Row>
      </div>

      {/* Indonesian questions, asked only where they have an answer. For
          everyone else the province files itself as International Participant
          and the city is never asked, which is what the old form spelled out
          in two lines of small print under each field. */}
      {values.country === INDONESIA ? (
        <div className="grid gap-5 sm:grid-cols-2">
          <Row ctl={ctl} field="province" label={t.regProvince}>
            <Select ctl={ctl} field="province" choices={PROVINCES} />
          </Row>
          <Row ctl={ctl} field="city" label={t.regCity}>
            <Text ctl={ctl} field="city" autoComplete="address-level2" />
          </Row>
        </div>
      ) : null}

      <div className={`grid gap-5 ${other ? "sm:grid-cols-2" : ""}`}>
        <Row ctl={ctl} field="profession" label={t.regProfession}>
          <Select ctl={ctl} field="profession" choices={PROFESSIONS} />
        </Row>
        {other ? (
          <Row ctl={ctl} field="professionOther" label={t.regProfessionOther}>
            <Text ctl={ctl} field="professionOther" />
          </Row>
        ) : null}
      </div>

      <Row ctl={ctl} field="submittedPaper" label={t.regPaper} group>
        <Pills ctl={ctl} field="submittedPaper" choices={PAPER_ANSWERS} />
      </Row>

      <Row
        ctl={ctl}
        field="seminarDays"
        label={t.regDays}
        help={t.regDaysHelp}
        group
      >
        <Pills ctl={ctl} field="seminarDays" choices={SEMINAR_DAYS} multiple />
      </Row>

      {/* Left uncontrolled for a script to find and fill, and read straight off
          the node on the way out. No person ever sees it. */}
      <input
        ref={trap}
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        defaultValue=""
        className="sr-only"
      />

      <div className="mt-1 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-brand px-[1.625rem] py-[0.9375rem] font-display text-[0.9375rem] font-bold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? t.regSubmitting : t.regSubmit}
        </button>

        <p role="alert" className="font-sans text-[0.8125rem] text-step-amber">
          {status === "failed"
            ? t.regErrSend
            : tried && Object.keys(errors).length
              ? t.regErrForm
              : ""}
        </p>
      </div>
    </form>
  );
}
