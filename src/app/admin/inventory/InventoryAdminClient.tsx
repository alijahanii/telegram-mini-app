"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Tabs } from "@/components/ui/Tabs";
import { toPersianDigits } from "@/lib/format";

interface Row { id: number; title?: string; name?: string; icon: string; stock: number; }

function StockInput({ defaultValue, onSave }: { defaultValue: number; onSave: (v: number) => void }) {
  return (
    <input
      type="number"
      defaultValue={defaultValue}
      onBlur={(e) => {
        const v = Number(e.target.value);
        if (v !== defaultValue) onSave(v);
      }}
      className="w-24 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-left text-sm text-white outline-none focus:border-sky-500/60"
    />
  );
}

export function InventoryAdminClient({ products, gifts }: { products: Row[]; gifts: Row[] }) {
  const [tab, setTab] = useState("products");

  async function updateProductStock(id: number, stock: number) {
    await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock }),
    });
    toast.success("موجودی محصول بروزرسانی شد");
  }

  async function updateGiftStock(id: number, stock: number) {
    await fetch(`/api/admin/gifts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock }),
    });
    toast.success("موجودی گیفت بروزرسانی شد");
  }

  const rows = tab === "products" ? products : gifts;

  return (
    <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.04] p-5">
      <Tabs
        items={[
          { value: "products", label: "محصولات" },
          { value: "gifts", label: "Giftها" },
        ]}
        value={tab}
        onChange={setTab}
        className="mb-4"
      />
      <div className="flex flex-col gap-2">
        {rows.map((r) => (
          <div key={r.id} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <span className="text-sm text-slate-200">
              {r.icon} {r.title ?? r.name}
              {r.stock <= 5 && <span className="mr-2 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] text-red-400">موجودی کم</span>}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500">فعلی: {toPersianDigits(r.stock)}</span>
              <StockInput
                defaultValue={r.stock}
                onSave={(v) => (tab === "products" ? updateProductStock(r.id, v) : updateGiftStock(r.id, v))}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
