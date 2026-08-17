import { PageContainer } from "@/components/layout/PageContainer";
import { getOrderDetail } from "@/lib/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { formatDateTime, formatToman, toPersianDigits } from "@/lib/format";
import { ORDER_STATUS_META, OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<string, string> = {
  service: "خرید از فروشگاه",
  gift: "خرید Gift",
  ad: "تبلیغ کانال",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getOrderDetail(Number(id));
  if (!data) notFound();
  const { order, items } = data;
  const status = ORDER_STATUS_META[order.status as OrderStatus] ?? ORDER_STATUS_META.pending;

  return (
    <PageContainer>
      <div className="mb-4 flex items-center gap-2">
        <Link href="/orders" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
          <ChevronRight className="h-4 w-4 text-slate-300" />
        </Link>
        <h1 className="text-base font-bold text-white">جزئیات سفارش #{toPersianDigits(order.id)}</h1>
      </div>

      <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
        <div>
          <p className="mb-1 text-xs text-slate-400">{TYPE_LABEL[order.type] ?? order.type}</p>
          <p className="text-xs text-slate-500">{formatDateTime(order.createdAt)}</p>
        </div>
        <span className={`rounded-full border px-3 py-1.5 text-xs font-bold ${status.className}`}>
          {status.label}
        </span>
      </div>

      <div className="mb-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
        <p className="mb-3 text-sm font-bold text-white">اقلام سفارش</p>
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-xl">
                {item.icon ?? "🛍"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-white">{item.title}</p>
                <p className="text-[11px] text-slate-500">تعداد: {toPersianDigits(item.quantity)}</p>
              </div>
              <p className="text-sm font-bold text-sky-400">{formatToman(Number(item.unitPrice) * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
        {Number(order.discountAmount) > 0 && (
          <div className="flex justify-between py-1 text-xs text-emerald-400">
            <span>تخفیف</span>
            <span>-{formatToman(order.discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between py-1 text-xs text-slate-400">
          <span>روش پرداخت</span>
          <span className="text-slate-200">کیف پول</span>
        </div>
        <div className="mt-2 flex justify-between border-t border-white/10 pt-2 text-base font-extrabold">
          <span className="text-white">مبلغ نهایی</span>
          <span className="text-sky-400">{formatToman(order.totalAmount)}</span>
        </div>
      </div>
    </PageContainer>
  );
}
