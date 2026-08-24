import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, PageHead, Tag } from "@/components/admin/ui";
import { ADMIN_PAGES, fieldsFor, findPage } from "@/lib/admin";

export function generateStaticParams() {
  return ADMIN_PAGES.map((page) => ({ slug: page.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: findPage(slug)?.label ?? "Halaman" };
}

export default async function AdminPagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = findPage(slug);
  if (!page) notFound();

  const fields = fieldsFor(page);

  return (
    <>
      <PageHead
        title={page.label}
        blurb={page.blurb}
        action={
          <a
            href={page.live}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full border border-ink/15 px-4 py-2 font-sans text-[0.75rem] font-semibold text-nav no-underline transition-colors hover:border-brand hover:text-brand"
          >
            Lihat halaman ↗
          </a>
        }
      />

      <Card
        title="Teks halaman"
        note={`${fields.length} baris, masing-masing dalam dua bahasa.`}
        action={<Tag tone="warn">Belum bisa disunting</Tag>}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[46rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-ink/8 bg-sage/60">
                <Th className="w-[14rem]">Kunci</Th>
                <Th>English</Th>
                <Th>Bahasa Indonesia</Th>
              </tr>
            </thead>
            <tbody>
              {fields.map((row) => (
                <tr key={row.key} className="border-b border-ink/6 align-top">
                  <Td>
                    <code className="font-mono text-[0.75rem] text-brand">
                      {row.key}
                    </code>
                  </Td>
                  <Td>{row.en}</Td>
                  <Td>{row.id}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-5 py-3 font-sans text-[0.6875rem] font-semibold tracking-[0.1em] text-muted uppercase sm:px-6 ${className}`}
    >
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td className="px-5 py-3.5 font-sans text-[0.8125rem] leading-relaxed text-body sm:px-6">
      {children}
    </td>
  );
}
