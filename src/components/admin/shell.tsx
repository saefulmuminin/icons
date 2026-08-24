"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ADMIN_PAGES, ADMIN_SYSTEM } from "@/lib/admin";
import logo from "@/../public/iconz10-logo.png";

const YEAR = 2026;

/**
 * The panel's furniture: a rail down the left, a bar across the top, a footer
 * under everything, and the page itself in between.
 *
 * A client component because the rail marks where you are and the drawer opens
 * and shuts; the pages it wraps stay server components, handed through as
 * `children`.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Landing anywhere new shuts the drawer, adjusted while rendering so it is
  // already shut in the first frame of the new page.
  const [seen, setSeen] = useState(pathname);
  if (seen !== pathname) {
    setSeen(pathname);
    setOpen(false);
  }

  const here =
    [...ADMIN_PAGES.map((page) => ({
      href: `/admin/pages/${page.slug}`,
      label: page.label,
    })),
    ...ADMIN_SYSTEM,
    { href: "/admin/dashboard", label: "Dasbor" }].find(
      (item) => item.href === pathname,
    ) ?? { href: "", label: "Dasbor" };

  return (
    <div className="min-h-dvh bg-cream">
      {/* The drawer's backdrop, and the only way to shut it by hand. */}
      {open ? (
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 cursor-default bg-brand-deep/50 backdrop-blur-[2px] lg:hidden"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-ink/10 bg-paper transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 flex-none items-center border-b border-ink/8 px-5">
          <Link href="/admin/dashboard" className="flex items-center">
            <Image src={logo} alt="Panel ICONZ" className="h-7 w-auto" />
          </Link>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
          <Rail
            href="/admin/dashboard"
            label="Dasbor"
            active={pathname === "/admin/dashboard"}
          />

          <Group label="Halaman situs" />
          {ADMIN_PAGES.map((page) => (
            <Rail
              key={page.slug}
              href={`/admin/pages/${page.slug}`}
              label={page.label}
              active={pathname === `/admin/pages/${page.slug}`}
            />
          ))}

          <Group label="Sistem" />
          {ADMIN_SYSTEM.map((item) => (
            <Rail
              key={item.href}
              href={item.href}
              label={item.label}
              active={pathname === item.href}
            />
          ))}
        </nav>

        <div className="flex-none border-t border-ink/8 p-3">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand/12 font-display text-[0.75rem] font-bold text-brand">
              AU
            </span>
            <span className="min-w-0">
              <span className="block truncate font-sans text-[0.8125rem] font-semibold text-ink">
                Admin Utama
              </span>
              <span className="block truncate font-sans text-[0.6875rem] text-faint">
                admin@iconzbaznas.com
              </span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => router.push("/admin/login")}
            className="mt-1 w-full cursor-pointer rounded-xl px-3 py-2.5 text-left font-sans text-[0.8125rem] font-semibold text-muted transition-colors hover:bg-sage hover:text-brand"
          >
            Keluar
          </button>
        </div>
      </aside>

      <div className="flex min-h-dvh flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 flex-none items-center gap-3 border-b border-ink/10 bg-cream/90 px-4 backdrop-blur-md sm:px-7">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Buka menu"
            aria-expanded={open}
            className="flex h-9 w-9 flex-none cursor-pointer flex-col items-center justify-center gap-[5px] rounded-lg border border-ink/15 transition-colors hover:border-brand lg:hidden"
          >
            <span className="block h-px w-4 bg-ink" />
            <span className="block h-px w-4 bg-ink" />
            <span className="block h-px w-4 bg-ink" />
          </button>

          <h1 className="min-w-0 truncate font-display text-[1.0625rem] font-bold tracking-[-0.01em] text-ink">
            {here.label}
          </h1>

          <a
            href="/en"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex-none rounded-full border border-ink/15 px-3.5 py-2 font-sans text-[0.75rem] font-semibold text-nav transition-colors hover:border-brand hover:text-brand"
          >
            Lihat situs
          </a>
        </header>

        {/* Said once, at the top of everything: nothing here is connected. */}
        <p className="flex-none border-b border-[#e0c46a]/50 bg-[#fdf6e0] px-4 py-2.5 text-center font-sans text-[0.75rem] leading-relaxed text-[#6b5410] sm:px-7">
          <strong className="font-semibold">Mode demo.</strong> Belum ada
          autentikasi maupun basis data — isian di panel ini contoh, dan tidak
          ada perubahan yang tersimpan.
        </p>

        <main className="min-w-0 flex-1 px-4 py-8 sm:px-7 sm:py-10">
          {children}
        </main>

        <footer className="flex-none border-t border-ink/10 px-4 py-6 sm:px-7">
          <div className="flex flex-wrap items-center justify-between gap-3 font-sans text-[0.75rem] text-faint">
            <span>Panel ICONZ · The 10th International Conference on Zakat</span>
            <span>© {YEAR} BAZNAS RI</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Group({ label }: { label: string }) {
  return (
    <p className="mt-6 mb-1.5 px-3 font-sans text-[0.625rem] font-semibold tracking-[0.16em] text-faint uppercase">
      {label}
    </p>
  );
}

function Rail({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`relative block rounded-xl px-3 py-2.5 font-sans text-[0.8125rem] font-semibold no-underline transition-colors ${
        active
          ? "bg-brand/10 text-brand-dark"
          : "text-nav hover:bg-sage hover:text-brand-dark"
      }`}
    >
      {/* A mark down the left edge for the page you are on. */}
      <span
        aria-hidden
        className={`absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-brand transition-opacity ${
          active ? "opacity-100" : "opacity-0"
        }`}
      />
      {label}
    </Link>
  );
}
