import { PageContainer } from "@/components/layout/PageContainer";
import { listGifts } from "@/lib/queries";
import { GiftCard } from "@/components/GiftCard";
import { EmptyState } from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";

export default async function GiftsPage() {
  const gifts = await listGifts();
  const serialized = gifts.map((g) => ({ ...g, price: String(g.price) }));

  return (
    <PageContainer>
      <div className="mb-4">
        <h1 className="text-lg font-extrabold text-white">🎁 فروشگاه Gift</h1>
        <p className="mt-1 text-xs text-slate-400">هدایای دیجیتال کمیاب برای پروفایل و چت تلگرام شما</p>
      </div>

      {serialized.length === 0 ? (
        <EmptyState title="هدیه‌ای یافت نشد" />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {serialized.map((g) => (
            <GiftCard key={g.id} gift={g} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
