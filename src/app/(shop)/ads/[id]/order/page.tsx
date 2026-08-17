import { PageContainer } from "@/components/layout/PageContainer";
import { getChannelById, listChannels } from "@/lib/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AdOrderForm } from "./AdOrderForm";

export const dynamic = "force-dynamic";

export default async function AdOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getChannelById(Number(id));
  if (!data) notFound();
  const channels = await listChannels();

  return (
    <PageContainer noPadBottom>
      <div className="mb-4 flex items-center gap-2">
        <Link href={`/ads/${id}`} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
          <ChevronRight className="h-4 w-4 text-slate-300" />
        </Link>
        <h1 className="text-base font-bold text-white">ثبت سفارش تبلیغ</h1>
      </div>

      <AdOrderForm
        channels={channels.map((c) => ({ ...c, engagement: String(c.engagement) }))}
        initialChannelId={data.channel.id}
        initialPackages={data.packages.map((p) => ({ ...p, price: String(p.price) }))}
      />
    </PageContainer>
  );
}
