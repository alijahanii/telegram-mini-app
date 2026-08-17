"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ListOrdered,
  Radio,
  Megaphone,
  Package,
  Gift,
  Tag,
  Boxes,
  CreditCard,
  Ticket,
  Settings,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/format";

const NAV = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard },
  { href: "/admin/users", label: "کاربران", icon: Users },
  { href: "/admin/orders", label: "سفارش‌ها", icon: ListOrdered },
  { href: "/admin/channels", label: "کانال‌ها", icon: Radio },
  { href: "/admin/ads", label: "تبلیغات", icon: Megaphone },
  { href: "/admin/products", label: "محصولات", icon: Package },
  { href: "/admin/gifts", label: "Giftها", icon: Gift },
  { href: "/admin/prices", label: "قیمت‌ها", icon: Tag },
  { href: "/admin/inventory", label: "موجودی", icon: Boxes },
  { href: "/admin/payments", label: "پرداخت‌ها", icon: CreditCard },
  { href: "/admin/discounts", label: "تخفیف‌ها", icon: Ticket },
  { href: "/admin/settings", label: "تنظیمات", icon: Settings },
];

export function AdminShell({ children, adminName }: { children: ReactNode; adminName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const activeLabel = NAV.find((n) => (n.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(n.href)))?.label ?? "داشبورد";

  return (
    <div className="min-h-dvh bg-[#05070c] text-white lg:flex">
      {/* Mobile topbar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/[0.06] bg-[#0a0e14]/90 px-4 py-3 backdrop-blur-xl lg:hidden">
        <button onClick={() => setOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
          <Menu className="h-5 w-5" />
        </button>
        <p className="text-sm font-bold">{activeLabel}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-sky-500 text-xs font-bold">
          {adminName.slice(0, 1)}
        </span>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-72 shrink-0 border-l border-white/[0.06] bg-[#0a0e14] p-4 transition-transform lg:sticky lg:top-0 lg:h-dvh lg:translate-x-0",
          open ? "translate-x-0" : "translate-x-full lg:translate-x-0",
        )}
      >
        <div className="mb-6 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#2AABEE] to-[#5B6FEE] text-sm font-bold">
              T
            </span>
            <span>
              <span className="block text-sm font-extrabold leading-none">TeleShop</span>
              <span className="block text-[10px] leading-none text-slate-400 mt-1">پنل مدیریت</span>
            </span>
          </Link>
          <button onClick={() => setOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 lg:hidden">
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
                  active ? "bg-gradient-to-l from-[#2AABEE]/20 to-[#5B6FEE]/10 text-sky-400" : "text-slate-400 hover:bg-white/5 hover:text-white",
                )}
              >
                <item.icon className="h-[18px] w-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/"
          className="mt-6 flex min-h-[44px] items-center gap-3 rounded-xl border border-white/10 px-3 text-sm text-slate-300 hover:bg-white/5"
        >
          <ExternalLink className="h-4 w-4" />
          بازگشت به اپلیکیشن
        </Link>
      </aside>

      {open && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />}

      <main className="min-w-0 flex-1 p-4 lg:p-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
