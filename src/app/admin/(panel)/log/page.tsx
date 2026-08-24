import type { Metadata } from "next";
import { Card, PageHead, Tag } from "@/components/admin/ui";
import { DEMO_LOG } from "@/lib/admin-demo";

export const metadata: Metadata = { title: "Log aktivitas" };

export default function LogPage() {
  return (
    <>
      <PageHead
        title="Log aktivitas"
        blurb="Apa yang diubah di situs, oleh siapa, dan kapan."
        action={<Tag tone="warn">Contoh data</Tag>}
      />

      <Card title="Riwayat" note={`${DEMO_LOG.length} entri terakhir.`}>
        <ol className="divide-y divide-ink/8">
          {DEMO_LOG.map((entry) => (
            <li
              key={`${entry.at}-${entry.target}`}
              className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-5 py-4 sm:px-6"
            >
              <span className="w-[10.5rem] flex-none font-sans text-[0.75rem] text-faint">
                {entry.at}
              </span>
              <span className="min-w-0 flex-1 font-sans text-[0.8125rem] leading-relaxed text-body">
                <span className="font-semibold text-ink">{entry.who}</span>{" "}
                {entry.did.toLowerCase()} —{" "}
                <span className="text-muted">{entry.target}</span>
              </span>
            </li>
          ))}
        </ol>
      </Card>
    </>
  );
}
