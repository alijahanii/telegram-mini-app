"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, ListOrdered, User, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/format";
import { useCartStore } from "@/store/cart-store";
import { useEffect, useState } from "react";

const items = [
  { href: "/", label: "خانه", icon: Home },
  { href: "/store", label: "فروشگاه", icon: Store },
  { href: "/orders", label: "سفارش‌ها", icon: ListOrdered },
  { href: "/profile", label: "پروفایل", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.06] bg-[#0a0e14]/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="relative flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 py-1.5 transition-colors active:scale-95"
            >
              <span className="relative">
                <Icon
                  className={cn(
                    "h-[22px] w-[22px] transition-colors",
                    active ? "text-sky-400" : "text-slate-500",
                  )}
                  strokeWidth={active ? 2.4 : 2}
                />
                {href === "/store" && mounted && cartCount > 0 && (
                  <span className="absolute -left-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </span>
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors",
                  active ? "text-sky-400" : "text-slate-500",
                )}
              >
                {label}
              </span>
              {active && (
                <span className="absolute top-0 h-0.5 w-8 rounded-full bg-gradient-to-l from-[#2AABEE] to-[#5B6FEE]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function CartFab() {
  const pathname = usePathname();
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || cartCount === 0) return null;
  if (pathname?.startsWith("/admin") || pathname === "/cart" || pathname === "/checkout") return null;

  return (
    <Link
      href="/cart"
      className="fixed bottom-[76px] left-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-l from-[#2AABEE] to-[#5B6FEE] text-white shadow-[0_10px_30px_-6px_rgba(43,150,238,0.7)] active:scale-95"
    >
      <ShoppingCart className="h-6 w-6" />
      <span className="absolute -left-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
        {cartCount}
      </span>
    </Link>
  );
}
