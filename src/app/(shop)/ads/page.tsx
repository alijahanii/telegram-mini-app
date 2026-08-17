import { PageContainer } from "@/components/layout/PageContainer";
import { listChannels } from "@/lib/queries";
import { ChannelCard } from "@/components/ChannelCard";
import { EmptyState } from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";

export default async function AdsPage() {
  const channels = await listChannels();
  const serialized = channels.map((c) => ({ ...c, engagement: String(c.engagement) }));

  return (
    <PageContainer>
      <div className="mb-4">
        <h1 className="text-lg font-extrabold text-white">تبلیغات کانال‌ها</h1>
        <p className="mt-1 text-xs text-slate-400">تبلیغ کسب‌وکار خود در معتبرترین کانال‌های تلگرام</p>
      </div>

      {serialized.length === 0 ? (
        <EmptyState title="کانالی یافت نشد" />
      ) : (
        <div className="flex flex-col gap-3">
          {serialized.map((c) => (
            <ChannelCard key={c.id} channel={c} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
