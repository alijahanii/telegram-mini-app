"use client";

import { ProductDTO } from "@/lib/types";
import { formatToman } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import Link from "next/link";
import { hapticImpact } from "@/lib/telegram";

export function ProductCard({ product }: { product: ProductDTO }) {
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
      quantity: 1,
      maxStock: product.stock,
    });
    hapticImpact("light");
    toast.success("به سبد خرید اضافه شد");
  }

  return (
    <div className="flex flex-col rounded-[20px] border border-white/[0.06] bg-white/[0.04] p-3 backdrop-blur-xl transition-transform active:scale-[0.98]">
      <Link href={`/store/product/${product.id}`} className="mb-3 flex h-28 items-center justify-center rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] text-5xl">
        {product.icon}
      </Link>
      <div className="mb-1 flex items-start justify-between gap-2">
        <Link href={`/store/product/${product.id}`} className="text-[13px] font-bold leading-tight text-white line-clamp-2">
          {product.title}
        </Link>
        {product.badge && <Badge tone="purple" className="shrink-0">{product.badge}</Badge>}
      </div>
      <p className="mb-2 line-clamp-1 text-[11px] text-slate-400">{product.description}</p>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-extrabold text-sky-400">{formatToman(product.price)}</span>
        <span className={outOfStock ? "text-[10px] text-red-400" : "text-[10px] text-emerald-400"}>
          {outOfStock ? "ناموجود" : "موجود"}
        </span>
      </div>
      <Button size="sm" fullWidth disabled={outOfStock} onClick={handleAdd}>
        افزودن به سبد
      </Button>
    </div>
  );
}
