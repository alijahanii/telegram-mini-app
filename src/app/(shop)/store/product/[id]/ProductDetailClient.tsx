"use client";

import { useState } from "react";
import { ProductDTO } from "@/lib/types";
import { formatToman, toPersianDigits } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import { hapticImpact } from "@/lib/telegram";

export function ProductDetailClient({ product }: { product: ProductDTO }) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const outOfStock = product.stock <= 0;

  function handleAdd() {
    addItem({
      itemType: "product",
      refId: product.id,
      title: product.title,
      subtitle: product.unit,
      icon: product.icon,
      imageUrl: product.imageUrl,
      unitPrice: Number(product.price),
      quantity: qty,
      maxStock: product.stock,
    });
    hapticImpact("medium");
    toast.success(`${qty} عدد به سبد خرید اضافه شد`);
  }

  return (
    <div className="pb-[calc(100px+env(safe-area-inset-bottom))]">
      <div className="mb-4 flex h-56 items-center justify-center rounded-[24px] bg-gradient-to-br from-white/[0.1] to-white/[0.02] text-8xl">
        {product.icon}
      </div>

      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-lg font-extrabold text-white">{product.title}</h2>
        {product.badge && <Badge tone="purple">{product.badge}</Badge>}
      </div>
      <p className="mb-4 text-sm leading-6 text-slate-400">{product.description}</p>

      <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
        <div>
          <p className="mb-1 text-[11px] text-slate-400">قیمت واحد</p>
          <p className="text-xl font-extrabold text-sky-400">{formatToman(product.price)}</p>
        </div>
        <div className="text-left">
          <p className="mb-1 text-[11px] text-slate-400">موجودی</p>
          <p className={`text-sm font-bold ${outOfStock ? "text-red-400" : "text-emerald-400"}`}>
            {outOfStock ? "ناموجود" : `${toPersianDigits(product.stock)} ${product.unit}`}
          </p>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3">
        <span className="text-sm text-slate-300">تعداد</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 active:scale-90"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-6 text-center font-bold">{toPersianDigits(qty)}</span>
          <button
            onClick={() => setQty((q) => Math.min(product.stock || 1, q + 1))}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 active:scale-90"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#0a0e14]/95 p-4 backdrop-blur-xl pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="flex-1">
            <p className="text-[11px] text-slate-400">مبلغ کل</p>
            <p className="text-base font-extrabold text-white">{formatToman(Number(product.price) * qty)}</p>
          </div>
          <Button size="lg" disabled={outOfStock} onClick={handleAdd} className="flex-1">
            افزودن به سبد
          </Button>
        </div>
      </div>
    </div>
  );
}
