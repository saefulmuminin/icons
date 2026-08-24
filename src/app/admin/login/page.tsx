import type { Metadata } from "next";
import Image from "next/image";
import { ConferenceName } from "@/components/ui";
import { CONFERENCE } from "@/lib/content";
import { LoginForm } from "./login-form";
import logo from "@/../public/iconz10-logo.png";

export const metadata: Metadata = { title: "Masuk" };

/**
 * The way in to the panel that will manage the site's content.
 *
 * A card floated on brand green rather than a form on a bare page: the plate on
 * the left is the only thing here that says which conference this belongs to,
 * so it is worth the half. Below `lg` it steps aside entirely — a photograph
 * that pushes the fields off a phone screen is decoration charging rent.
 */
export default function LoginPage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-brand-deep px-4 py-10 sm:px-6">
      {/* The three houses the conference is run out of, laid behind everything
          and taken well down in brand green: this is ground for a card to sit
          on, not a picture anyone is meant to study. */}
      <Image
        src="/bglogin.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(150deg,rgba(11,46,31,0.94)_0%,rgba(17,64,44,0.87)_45%,rgba(14,76,41,0.92)_100%)]"
      />

      <div className="relative grid w-full max-w-[62rem] overflow-hidden rounded-3xl bg-paper shadow-[0_40px_90px_-40px_rgba(4,20,13,0.55)] lg:grid-cols-2">
        {/* The plate. Three speakers stacked one above the other, which is a
            shape this tall half can actually hold — a wide picture here would
            lose all but its middle. */}
        <div className="relative hidden min-h-[34rem] overflow-hidden lg:block">
          <Image
            src="/logincard.png"
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 31rem, 0px"
            className="object-cover"
          />

          {/* No tint and no pattern over the picture — only a neutral shade
              banked at the two edges the words actually sit on. The photograph
              runs bright through the middle, and white type laid straight onto
              a green screen or a pale suit cannot be read at all. Everything
              between the two edges is the picture untouched. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.08)_18%,rgba(0,0,0,0.05)_54%,rgba(0,0,0,0.5)_74%,rgba(0,0,0,0.88)_100%)]"
          />

          <div className="relative flex h-full flex-col justify-between p-10">
            {/* `self-start` is what keeps the mark its own shape: as a plain
                child of a column the cross-axis stretch pulls it full width and
                `w-auto` never gets a say. */}
            <Image
              src={logo}
              alt=""
              className="h-9 w-auto self-start brightness-0 invert"
            />

            {/* Held to a measure and set small: at full width the name ran two
                long lines across the picture and took a third of the plate with
                it. A caption is what this is. */}
            <div className="max-w-[23rem]">
              <p className="font-display text-[1.4375rem] leading-[1.2] font-extrabold tracking-[-0.02em] text-white">
                <ConferenceName />
              </p>
              <p
                lang="en"
                className="mt-3 max-w-[30ch] font-display text-[0.8125rem] leading-[1.5] font-normal text-pretty text-mint-pale"
              >
                “{CONFERENCE.theme}”
              </p>
              <p className="mt-4 font-sans text-[0.6875rem] font-semibold tracking-[0.16em] text-mint-dim uppercase">
                {CONFERENCE.dateRange}
              </p>
            </div>
          </div>
        </div>

        {/* The door */}
        <div className="px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
          <div className="mx-auto w-full max-w-[22rem]">
            {/* The mark rides above the form only where the plate is not
                showing it, so it is never said twice. */}
            <Image
              src={logo}
              alt="The 10th ICONZ"
              priority
              className="mx-auto h-8 w-auto lg:hidden"
            />

            <h1 className="mt-7 text-center font-display text-[2.25rem] leading-none font-extrabold tracking-[-0.03em] text-brand lg:mt-0">
              Selamat datang
            </h1>
            <p className="mt-2.5 text-center font-sans text-[0.8125rem] text-muted">
              Masuk dengan surel panitia
            </p>

            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
