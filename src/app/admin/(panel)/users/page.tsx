import type { Metadata } from "next";
import { Card, PageHead, Tag } from "@/components/admin/ui";
import { DEMO_USERS } from "@/lib/admin-demo";

export const metadata: Metadata = { title: "Manajemen pengguna" };

export default function UsersPage() {
  return (
    <>
      <PageHead
        title="Manajemen pengguna"
        blurb="Siapa yang boleh masuk ke panel, dan sejauh apa jangkauannya."
        action={<Tag tone="warn">Contoh data</Tag>}
      />

      <Card title="Pengguna panel" note={`${DEMO_USERS.length} akun.`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-ink/8 bg-sage/60">
                <th className="px-5 py-3 font-sans text-[0.6875rem] font-semibold tracking-[0.1em] text-muted uppercase sm:px-6">
                  Nama
                </th>
                <th className="px-5 py-3 font-sans text-[0.6875rem] font-semibold tracking-[0.1em] text-muted uppercase sm:px-6">
                  Peran
                </th>
                <th className="px-5 py-3 font-sans text-[0.6875rem] font-semibold tracking-[0.1em] text-muted uppercase sm:px-6">
                  Jangkauan
                </th>
                <th className="px-5 py-3 font-sans text-[0.6875rem] font-semibold tracking-[0.1em] text-muted uppercase sm:px-6">
                  Terakhir aktif
                </th>
              </tr>
            </thead>
            <tbody>
              {DEMO_USERS.map((user) => (
                <tr key={user.email} className="border-b border-ink/6">
                  <td className="px-5 py-4 sm:px-6">
                    <span className="block font-display text-[0.875rem] font-bold text-ink">
                      {user.name}
                    </span>
                    <span className="mt-0.5 block font-sans text-[0.75rem] text-faint">
                      {user.email}
                    </span>
                  </td>
                  <td className="px-5 py-4 sm:px-6">
                    <Tag tone={user.active ? "brand" : "muted"}>{user.role}</Tag>
                  </td>
                  <td className="px-5 py-4 font-sans text-[0.8125rem] text-body sm:px-6">
                    {user.scope}
                  </td>
                  <td className="px-5 py-4 font-sans text-[0.8125rem] text-muted sm:px-6">
                    {user.seen}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
