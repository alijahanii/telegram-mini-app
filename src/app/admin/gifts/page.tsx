import { listAllGiftsAdmin } from "@/lib/admin-queries";
import { GiftsAdminClient } from "./GiftsAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminGiftsPage() {
  const gifts = await listAllGiftsAdmin();
  const serialized = gifts.map((g) => ({ ...g, price: String(g.price), createdAt: g.createdAt.toISOString() }));

  return (
    <div>
      <h1 className="mb-1 text-xl font-extrabold text-white">مدیریت Giftها</h1>
      <p className="mb-6 text-sm text-slate-400">افزودن، ویرایش و مدیریت موجودی هدایای دیجیتال</p>
      <GiftsAdminClient gifts={serialized as never} />
    </div>
  );
}
