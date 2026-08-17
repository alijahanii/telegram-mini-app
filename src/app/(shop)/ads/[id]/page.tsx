import { PageContainer } from "@/components/layout/PageContainer";
import { getChannelById } from "@/lib/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Users, Eye, TrendingUp } from "lucide-react";
import { formatCompactNumber, formatToman, toPersianDigits } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function ChannelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getChannelById(Number(id));
  if (!data) notFound();
  const { channel, packages } = data;

  return (
    <PageContainer noPadBottom>
      <div className="mb-4 flex items-center gap-2">
        <Link href="/ads" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
          <ChevronRight className="h-4 w-4 text-slate-300" />
        </Link>
        <h1 className="text-base font-bold text-white">جزئیات کانال</h1>
      </div>

      <div className="pb-[calc(96px+env(safe-area-inset-bottom))]">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3 rounded-[20px] border border-white/[0.06] bg-white/[0.04] p-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2AABEE]/30 to-[#5B6FEE]/30 text-3xl">
            📢
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-extrabold text-white">{channel.name}</p>
            <p className="truncate text-sm text-slate-400">{channel.username}</p>
            <Badge tone="blue" className="mt-1.5">{channel.category}</Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-4 grid grid-cols-3 gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3 text-center">
          <div>
            <Users className="mx-auto mb-1 h-4 w-4 text-slate-400" />
            <p className="text-sm font-bold text-white">{formatCompactNumber(channel.membersCount)}</p>
            <p className="text-[10px] text-slate-500">عضو</p>
          </div>
          <div className="border-x border-white/[0.06]">
            <Eye className="mx-auto mb-1 h-4 w-4 text-slate-400" />
            <p className="text-sm font-bold text-white">{formatCompactNumber(channel.avgViews)}</p>
            <p className="text-[10px] text-slate-500">میانگین بازدید</p>
          </div>
          <div>
            <TrendingUp className="mx-auto mb-1 h-4 w-4 text-emerald-400" />
            <p className="text-sm font-bold text-emerald-400">{toPersianDigits(channel.engagement)}٪</p>
            <p className="text-[10px] text-slate-500">نرخ تعامل</p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-5 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
          <p className="mb-2 text-xs font-semibold text-slate-300">درباره کانال</p>
          <p className="text-sm leading-6 text-slate-400">{channel.description}</p>
        </div>

        {/* Packages */}
        <div>
          <p className="mb-3 text-sm font-bold text-white">بسته‌های تبلیغاتی</p>
          <div className="flex flex-col gap-2.5">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3.5"
              >
                <div>
                  <p className="text-sm font-semibold text-white">{pkg.label}</p>
                </div>
                <p className="text-sm font-extrabold text-sky-400">{formatToman(pkg.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#0a0e14]/95 p-4 backdrop-blur-xl pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-lg">
          <Link href={`/ads/${channel.id}/order`}>
            <Button size="lg" fullWidth>ثبت سفارش تبلیغ</Button>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
