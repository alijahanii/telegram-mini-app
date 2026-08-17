import { listAllDiscountsAdmin } from "@/lib/admin-queries";
import { DiscountsAdminClient } from "./DiscountsAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminDiscountsPage() {
  const discounts = await listAllDiscountsAdmin();
  const serialized = discounts.map((d) => ({
    ...d,
    expiresAt: d.expiresAt ? d.expiresAt.toISOString() : null,
    createdAt: d.createdAt.toISOString(),
  }));

  return (
    <div>
      <h1 className="mb-1 text-xl font-extrabold text-white">مدیریت تخفیف‌ها</h1>
      <p className="mb-6 text-sm text-slate-400">افزودن و مدیریت کدهای تخفیف فروشگاه</p>
      <DiscountsAdminClient discounts={serialized as never} />
    </div>
  );
}
