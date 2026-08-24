"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** The outlined box every field sits in, with room at the left for its icon. */
const field =
  "peer w-full rounded-xl border border-ink/18 bg-paper py-3.5 pr-4 pl-13 font-sans text-[0.9375rem] text-ink transition-colors outline-none placeholder:text-pale focus:border-brand focus:ring-[3px] focus:ring-brand/15";

/** The label rides the top border, cut into it by its own patch of ground. */
const label =
  "absolute -top-2 left-3 z-10 bg-paper px-1.5 font-sans text-[0.6875rem] font-semibold tracking-[0.04em] text-brand";

const NOT_WIRED =
  "Autentikasi belum tersambung. Halaman ini masih tampilan — belum ada akun yang bisa masuk.";

/**
 * The sign-in form.
 *
 * Everything a real one would have except the part that decides: there is no
 * account store behind this yet, so every way in reports plainly that nothing
 * is connected rather than waving anyone through. A form that appears to sign
 * people in without checking anything is worse than no form at all — it reads
 * as a door to whoever meets it next, including whoever ships it.
 */
export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bare, setBare] = useState(false);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    setNotice(null);
    setPending(true);

    // Stands in for the round trip, so the waiting state is a real thing to
    // look at rather than a branch nobody has ever seen.
    await new Promise((done) => setTimeout(done, 700));

    // TODO: this is where the real check goes. Until it exists nothing is
    // verified — the panel is a walk-through, and says so on every screen.
    router.push("/admin/dashboard");
  };

  return (
    <form onSubmit={submit} className="mt-7">
      <div className="relative">
        <label htmlFor="email" className={label}>
          Surel
        </label>
        <Slot>
          <Envelope />
        </Slot>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          placeholder="nama@baznas.go.id"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={field}
        />
      </div>

      <div className="relative mt-5">
        <label htmlFor="password" className={label}>
          Kata sandi
        </label>
        <Slot>
          <Lock />
        </Slot>
        <input
          id="password"
          name="password"
          type={bare ? "text" : "password"}
          required
          autoComplete="current-password"
          placeholder="••••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={`${field} pr-12`}
        />

        <button
          type="button"
          onClick={() => setBare(!bare)}
          aria-label={bare ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          aria-pressed={bare}
          className="absolute inset-y-0 right-0 flex w-12 cursor-pointer items-center justify-center rounded-r-xl text-muted transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <Eye bare={bare} />
        </button>
      </div>

      <div className="mt-3 text-right">
        <button
          type="button"
          onClick={() => setNotice(NOT_WIRED)}
          className="cursor-pointer font-sans text-[0.75rem] text-muted underline-offset-4 transition-colors hover:text-brand hover:underline"
        >
          Lupa kata sandi?
        </button>
      </div>

      {/* Announced rather than merely drawn: someone on a screen reader has no
          other way to know the button did anything. */}
      <div role="status" aria-live="polite">
        {notice ? (
          <p className="mt-5 rounded-xl border border-ink/12 bg-sage px-4 py-3 font-sans text-[0.8125rem] leading-relaxed text-body">
            {notice}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-7 block w-full cursor-pointer rounded-lg bg-brand px-8 py-3.5 font-display text-[0.8125rem] font-bold tracking-[0.12em] text-white uppercase transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "Memeriksa…" : "Masuk"}
      </button>

      <div className="mt-7 flex items-center gap-4">
        <span aria-hidden className="h-px flex-1 bg-ink/12" />
        <span className="font-sans text-[0.6875rem] font-semibold tracking-[0.16em] text-faint uppercase">
          atau
        </span>
        <span aria-hidden className="h-px flex-1 bg-ink/12" />
      </div>

      <button
        type="button"
        onClick={() => setNotice(NOT_WIRED)}
        className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-lg border border-ink/15 bg-paper px-5 py-3 font-sans text-[0.8125rem] font-semibold text-nav transition-colors hover:border-brand/40 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <Google />
        Masuk dengan Google
      </button>

      <p className="mt-7 text-center font-sans text-[0.8125rem] text-muted">
        Belum punya akses?{" "}
        <span className="font-semibold text-brand">Hubungi panitia ICONZ</span>
      </p>
    </form>
  );
}

/** The tinted square a field's icon sits in, at the left of the box. */
function Slot({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute top-1/2 left-2.5 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-brand/8 text-brand peer-focus:bg-brand/14"
    >
      {children}
    </span>
  );
}

function Envelope() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <rect x="2.5" y="4.5" width="15" height="11" rx="2" />
      <path d="m3 6 7 4.5L17 6" />
    </svg>
  );
}

function Lock() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <rect x="4" y="8.5" width="12" height="8" rx="2" />
      <path d="M6.75 8.5V6.4a3.25 3.25 0 0 1 6.5 0v2.1" />
    </svg>
  );
}

function Eye({ bare }: { bare: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden
      className="h-[1.125rem] w-[1.125rem]"
    >
      <path d="M1.8 10S5 4.5 10 4.5 18.2 10 18.2 10 15 15.5 10 15.5 1.8 10 1.8 10Z" />
      <circle cx="10" cy="10" r="2.6" />
      {bare ? <path d="M3.5 3.5 16.5 16.5" /> : null}
    </svg>
  );
}

/** Google's mark in its own four colours; it is not ours to recolour. */
function Google() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden className="h-4 w-4">
      <path
        fill="#4285f4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34a853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#fbbc05"
        d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z"
      />
      <path
        fill="#ea4335"
        d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}
