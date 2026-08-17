import { ReactNode } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { getCurrentAdmin } from "@/lib/current-user";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await getCurrentAdmin();
  return <AdminShell adminName={admin?.firstName ?? "مدیر"}>{children}</AdminShell>;
}
