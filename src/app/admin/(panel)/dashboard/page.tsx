import type { Metadata } from "next";
import Link from "next/link";
import { Card, PageHead, Stat } from "@/components/admin/ui";
import { ADMIN_PAGES, ADMIN_SYSTEM, fieldsFor } from "@/lib/admin";
import { DEMO_LOG } from "@/lib/admin-demo";
import {
  EDITIONS,
  getSpeakers,
  JOURNALS,
  ORGANIZERS,
  SUBTHEMES,
  SUB_EVENTS,
  SUPPORTERS,
} from "@/lib/content";

export const metadata: Metadata = { title: "Dasbor" };

export default function DashboardPage() {
  const lines = ADMIN_PAGES.reduce(
    (total, page) => total + fieldsFor(page).length,
    0,
  );

  const stats = [
    { value: ADMIN_PAGES.length, label: "Halaman situs" },
    { value: lines, label: "Baris teks (× 2 bahasa)" },
    { value: getSpeakers("en").length, label: "Pembicara" },
    { value: EDITIONS.length, label: "Edisi terarsip" },
    { value: ORGANIZERS.length + SUPPORTERS.length, label: "Lembaga" },
    { value: SUBTHEMES.length, label: "Sub-tema" },
    { value: SUB_EVENTS.length, label: "Sub-acara" },
    { value: JOURNALS.length, label: "Jurnal prosiding" },
  ];

  return (
    <>
      <PageHead
        title="Dasbor"
        blurb="Ringkasan isi situs konferensi dan pintu ke tiap halaman yang bisa diatur."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Stat key={stat.label} value={stat.value} label={stat.label} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <Card title="Halaman situs" note="Pilih satu untuk mengatur isinya.">
          <ul className="divide-y divide-ink/8">
            {ADMIN_PAGES.map((page) => (
              <li key={page.slug}>
                <Link
                  href={`/admin/pages/${page.slug}`}
                  className="group flex items-start gap-4 px-5 py-4 no-underline transition-colors hover:bg-sage sm:px-6"
                >
                  <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-brand/10 font-display text-[0.75rem] font-bold text-brand">
                    {fieldsFor(page).length}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[0.9375rem] font-bold text-ink">
                      {page.label}
                    </span>
                    <span className="mt-1 block font-sans text-[0.75rem] leading-relaxed text-muted">
                      {page.blurb}
                    </span>
                  </span>

                  <span
                    aria-hidden
                    className="mt-1 flex-none font-sans text-[1rem] text-pale transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex flex-col gap-6">
          <Card title="Sistem">
            <ul className="divide-y divide-ink/8">
              {ADMIN_SYSTEM.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block px-5 py-4 no-underline transition-colors hover:bg-sage sm:px-6"
                  >
                    <span className="block font-display text-[0.9375rem] font-bold text-ink">
                      {item.label}
                    </span>
                    <span className="mt-1 block font-sans text-[0.75rem] text-muted">
                      {item.blurb}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          <Card
            title="Aktivitas terakhir"
            note="Contoh data."
            action={
              <Link
                href="/admin/log"
                className="font-sans text-[0.75rem] font-semibold text-brand no-underline hover:underline"
              >
                Lihat semua
              </Link>
            }
          >
            <ul className="divide-y divide-ink/8">
              {DEMO_LOG.slice(0, 4).map((entry) => (
                <li key={entry.at} className="px-5 py-3.5 sm:px-6">
                  <p className="font-sans text-[0.8125rem] leading-snug text-body">
                    <span className="font-semibold text-ink">{entry.who}</span>{" "}
                    {entry.did.toLowerCase()}
                  </p>
                  <p className="mt-1 font-sans text-[0.6875rem] text-faint">
                    {entry.at}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
