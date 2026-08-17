"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatToman, toPersianDigits } from "@/lib/format";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  if (!mounted) return null;

  return (
    <PageContainer noPadBottom>
      <h1 className="mb-4 text-lg font-extrabold text-white">سبد خرید</h1>

      {items.length === 0 ? (
        <EmptyState
          icon="🛒"
          title="سبد خرید شما خالی است"
          description="محصولات مورد نظر خود را از فروشگاه انتخاب کنید"
          action={
            <Link href="/store">
              <Button size="sm">مشاهده فروشگاه</Button>
            </Link>
          }
        />
      ) : (
        <div className="pb-[calc(140px+env(safe-area-inset-bottom))]">
          <div className="mb-4 flex flex-col gap-3">
            {items.map((item) => (
              <div
                key={item.key}
                className="flex items-center gap-3 rounded-[18px] border border-white/[0.06] bg-white/[0.04] p-3"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-white/[0.1] to-white/[0.02] text-2xl">
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-white">{item.title}</p>
                  {item.subtitle && <p className="truncate text-[11px] text-slate-400">{item.subtitle}</p>}
                  <p className="mt-1 text-xs font-bold text-sky-400">{formatToman(item.unitPrice)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => removeItem(item.key)} className="text-red-400 active:scale-90">
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-2 rounded-full bg-white/10 px-1.5 py-1">
                    <button
                      onClick={() => updateQuantity(item.key, item.quantity - 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 active:scale-90"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-4 text-center text-xs font-bold">{toPersianDigits(item.quantity)}</span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.key,
                          Math.min(item.quantity + 1, item.maxStock ?? Infinity),
                        )
                      }
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 active:scale-90"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
            <div className="flex justify-between py-1 text-sm text-slate-400">
              <span>جمع جزء</span>
              <span className="text-slate-200">{formatToman(subtotal)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-white/10 pt-2 text-base font-extrabold">
              <span className="text-white">مبلغ نهایی</span>
              <span className="text-sky-400">{formatToman(subtotal)}</span>
            </div>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#0a0e14]/95 p-4 backdrop-blur-xl pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <div className="mx-auto max-w-lg">
            <Link href="/checkout">
              <Button size="lg" fullWidth>ادامه پرداخت</Button>
            </Link>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
