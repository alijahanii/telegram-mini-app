import { listAdOrdersAdmin } from "@/lib/admin-queries";
import { formatDateTime, formatToman, toPersianDigits } from "@/lib/format";
import { ORDER_STATUS_META, OrderStatus } from "@/lib/types";
import { EmptyState } from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";

export default async function AdminAdsPage() {
  const adOrders = await listAdOrdersAdmin();

  return (
    <div>
      <h1 className="mb-1 text-xl font-extrabold text-white">مدیریت تبلیغات</h1>
      <p className="mb-6 text-sm text-slate-400">سفارش‌های تبلیغاتی ثبت‌شده توسط کاربران</p>

      {adOrders.length === 0 ? (
        <EmptyState title="سفارش تبلیغاتی وجود ندارد" />
      ) : (
        <div className="flex flex-col gap-3">
          {adOrders.map((ad) => {
            const status = ORDER_STATUS_META[ad.status as OrderStatus] ?? ORDER_STATUS_META.pending;
            return (
              <div key={ad.orderId} className="rounded-[20px] border border-white/[0.06] bg-white/[0.04] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">سفارش #{toPersianDigits(ad.orderId)} · {ad.channelName}</p>
                    <p className="text-xs text-slate-400">{ad.channelUsername} · {ad.packageLabel}</p>
                  </div>
                  <span className={`rounded-full border px-2.5 py-1 text-[10px] ${status.className}`}>{status.label}</span>
                </div>
                <p className="mb-2 rounded-xl bg-white/[0.03] p-3 text-xs leading-6 text-slate-300">{ad.adText || "بدون متن"}</p>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                  <span>مشتری: {ad.firstName} (@{ad.username})</span>
                  {ad.destinationLink && <span>لینک: {ad.destinationLink}</span>}
                  {ad.scheduledAt && <span>زمان‌بندی: {formatDateTime(ad.scheduledAt)}</span>}
                  <span className="mr-auto font-bold text-sky-400">{formatToman(ad.totalAmount)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
