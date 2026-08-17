import { OrderDTO, ORDER_STATUS_META, OrderStatus } from "@/lib/types";
import { formatDateTime, formatToman, toPersianDigits } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const TYPE_LABEL: Record<string, string> = {
  service: "سرویس فروشگاه",
  gift: "گیفت",
  ad: "تبلیغ کانال",
};

export function OrderCard({ order }: { order: OrderDTO }) {
  const status = ORDER_STATUS_META[order.status as OrderStatus] ?? ORDER_STATUS_META.pending;
  return (
    <Link
      href={`/orders/${order.id}`}
      className="flex items-center gap-3 rounded-[20px] border border-white/[0.06] bg-white/[0.04] p-4 backdrop-blur-xl active:scale-[0.98] transition-transform"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-white/[0.1] to-white/[0.02] text-xl">
        {order.type === "ad" ? "📢" : order.type === "gift" ? "🎁" : "🛍"}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="truncate text-sm font-bold text-white">سفارش #{toPersianDigits(order.id)}</p>
          <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${status.className}`}>
            {status.label}
          </span>
        </div>
        <p className="mb-1 text-[11px] text-slate-400">{TYPE_LABEL[order.type] ?? order.type} · {formatDateTime(order.createdAt)}</p>
        <p className="text-xs font-bold text-sky-400">{formatToman(order.totalAmount)}</p>
      </div>
      <ChevronLeft className="h-4 w-4 shrink-0 text-slate-500" />
    </Link>
  );
}
