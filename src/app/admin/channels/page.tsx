import { listAllChannelsAdmin } from "@/lib/admin-queries";
import { ChannelsAdminClient } from "./ChannelsAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminChannelsPage() {
  const channels = await listAllChannelsAdmin();
  const serialized = channels.map((c) => ({
    ...c,
    engagement: String(c.engagement),
    createdAt: c.createdAt.toISOString(),
    packages: c.packages.map((p) => ({ ...p, price: String(p.price) })),
  }));

  return (
    <div>
      <h1 className="mb-1 text-xl font-extrabold text-white">مدیریت کانال‌ها</h1>
      <p className="mb-6 text-sm text-slate-400">افزودن، ویرایش و تعیین قیمت تبلیغات کانال‌ها</p>
      <ChannelsAdminClient channels={serialized as never} />
    </div>
  );
}
