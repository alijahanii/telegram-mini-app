import { PageContainer } from "@/components/layout/PageContainer";
import { getCurrentUser } from "@/lib/current-user";
import { listOrdersForUser } from "@/lib/queries";
import { formatToman, toPersianDigits } from "@/lib/format";
import Link from "next/link";
import {
  ListOrdered,
  Wallet,
  Receipt,
  Ticket,
  LifeBuoy,
  FileText,
  Settings,
  ChevronLeft,
} from "lucide-react";

export const dynamic = "force-dynamic";

const MENU = [
  { href: "/orders", label: "سفارش‌های من", icon: ListOrdered, tone: "text-sky-400" },
  { href: "/profile/wallet", label: "کیف پول", icon: Wallet, tone: "text-emerald-400" },
  { href: "/profile/transactions", label: "تراکنش‌ها", icon: Receipt, tone: "text-purple-400" },
  { href: "/profile/discounts", label: "کدهای تخفیف", icon: Ticket, tone: "text-amber-400" },
  { href: "/profile/support", label: "پشتیبانی", icon: LifeBuoy, tone: "text-pink-400" },
  { href: "/profile/rules", label: "قوانین", icon: FileText, tone: "text-slate-300" },
  { href: "/profile/settings", label: "تنظیمات", icon: Settings, tone: "text-slate-300" },
];

export default async function ProfilePage() {
  const user = await getCurrentUser();
  const orders = user ? await listOrdersForUser(user.id) : [];

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-5 flex items-center gap-4 rounded-[20px] border border-white/[0.06] bg-white/[0.04] p-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-sky-500 text-2xl font-bold text-white">
          {user?.firstName?.slice(0, 1) ?? "م"}
        </div>
        <div>
          <p className="text-base font-extrabold text-white">
            {user?.firstName} {user?.lastName ?? ""}
          </p>
          <p className="text-xs text-slate-400">@{user?.username}</p>
          <p className="mt-1 text-[11px] text-slate-500">شناسه تلگرام: {toPersianDigits(user?.telegramId ?? "-")}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
          <p className="mb-1 text-[11px] text-slate-400">موجودی کیف پول</p>
          <p className="text-base font-extrabold text-sky-400">{formatToman(user?.walletBalance ?? 0)}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
          <p className="mb-1 text-[11px] text-slate-400">تعداد سفارش‌ها</p>
          <p className="text-base font-extrabold text-white">{toPersianDigits(orders.length)}</p>
        </div>
      </div>

      {/* Menu */}
      <div className="overflow-hidden rounded-[20px] border border-white/[0.06] bg-white/[0.04]">
        {MENU.map((item, idx) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex min-h-[52px] items-center gap-3 px-4 ${idx !== MENU.length - 1 ? "border-b border-white/[0.05]" : ""} active:bg-white/[0.04]`}
          >
            <item.icon className={`h-[18px] w-[18px] ${item.tone}`} />
            <span className="flex-1 text-sm text-slate-200">{item.label}</span>
            <ChevronLeft className="h-4 w-4 text-slate-600" />
          </Link>
        ))}
      </div>
    </PageContainer>
  );
}
