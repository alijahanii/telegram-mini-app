import { getDashboardStats, listAllOrdersAdmin } from "@/lib/admin-queries";
import { formatToman, toPersianDigits, formatDateTime } from "@/lib/format";
import { Users, ListOrdered, Wallet, Clock, TrendingUp } from "lucide-react";
import { ORDER_STATUS_META, OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.04] p-5">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-xl font-extrabold text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{label}</p>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const [stats, orders] = await Promise.all([getDashboardStats(), listAllOrdersAdmin()]);
  const maxDay = Math.max(1, ...stats.last7Days.map((d) => Number(d.total)));

  return (
    <div>
      <h1 className="mb-1 text-xl font-extrabold text-white">داشبورد مدیریت</h1>
      <p className="mb-6 text-sm text-slate-400">نمای کلی از عملکرد فروشگاه TeleShop</p>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard icon={Users} label="کل کاربران" value={toPersianDigits(stats.totalUsers)} tone="bg-sky-500/15 text-sky-400" />
        <StatCard icon={ListOrdered} label="کل سفارش‌ها" value={toPersianDigits(stats.totalOrders)} tone="bg-purple-500/15 text-purple-400" />
        <StatCard icon={Wallet} label="درآمد کل" value={formatToman(stats.revenue)} tone="bg-emerald-500/15 text-emerald-400" />
        <StatCard icon={Clock} label="سفارش‌های در انتظار" value={toPersianDigits(stats.pendingOrders)} tone="bg-amber-500/15 text-amber-400" />
        <StatCard icon={TrendingUp} label="فروش امروز" value={formatToman(stats.todaySales)} tone="bg-pink-500/15 text-pink-400" />
      </div>

      {/* Chart */}
      <div className="mb-6 rounded-[20px] border border-white/[0.06] bg-white/[0.04] p-5">
        <p className="mb-4 text-sm font-bold text-white">روند فروش ۷ روز اخیر</p>
        {stats.last7Days.length === 0 ? (
          <p className="text-xs text-slate-500">داده‌ای برای نمایش وجود ندارد</p>
        ) : (
          <div className="flex h-40 items-end gap-3">
            {stats.last7Days.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-[#2AABEE] to-[#5B6FEE]"
                  style={{ height: `${Math.max(6, (Number(d.total) / maxDay) * 100)}%` }}
                />
                <span className="text-[10px] text-slate-500">{toPersianDigits(d.day.slice(5))}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent orders */}
      <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.04] p-5">
        <p className="mb-4 text-sm font-bold text-white">آخرین سفارش‌ها</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-right text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs text-slate-400">
                <th className="pb-2 font-medium">شناسه</th>
                <th className="pb-2 font-medium">کاربر</th>
                <th className="pb-2 font-medium">نوع</th>
                <th className="pb-2 font-medium">مبلغ</th>
                <th className="pb-2 font-medium">وضعیت</th>
                <th className="pb-2 font-medium">تاریخ</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 8).map((o) => {
                const status = ORDER_STATUS_META[o.status as OrderStatus] ?? ORDER_STATUS_META.pending;
                return (
                  <tr key={o.id} className="border-b border-white/[0.04]">
                    <td className="py-2.5 text-slate-300">#{toPersianDigits(o.id)}</td>
                    <td className="py-2.5 text-slate-300">{o.firstName ?? "-"}</td>
                    <td className="py-2.5 text-slate-400">{o.type}</td>
                    <td className="py-2.5 font-bold text-sky-400">{formatToman(o.totalAmount)}</td>
                    <td className="py-2.5">
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] ${status.className}`}>{status.label}</span>
                    </td>
                    <td className="py-2.5 text-xs text-slate-500">{formatDateTime(o.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
