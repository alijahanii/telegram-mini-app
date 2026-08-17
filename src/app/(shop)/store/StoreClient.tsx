"use client";

import { useState } from "react";
import { Tabs } from "@/components/ui/Tabs";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductDTO } from "@/lib/types";

const CATS = [
  { value: "all", label: "همه" },
  { value: "premium", label: "Premium" },
  { value: "stars", label: "Stars" },
  { value: "sticker", label: "استیکر" },
  { value: "other", label: "سایر خدمات" },
];

export function StoreClient({ products }: { products: ProductDTO[] }) {
  const [cat, setCat] = useState("all");
  const filtered = cat === "all" ? products : products.filter((p) => p.category === cat);

  return (
    <div>
      <Tabs items={CATS} value={cat} onChange={setCat} className="mb-4" />
      {filtered.length === 0 ? (
        <EmptyState title="محصولی یافت نشد" description="در این دسته‌بندی محصولی موجود نیست" />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
