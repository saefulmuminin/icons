import { AdminShell } from "@/components/admin/shell";

/**
 * Everything in the panel proper. `/admin/login` sits outside this group on
 * purpose — a door does not need a rail down the side of it.
 */
export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
