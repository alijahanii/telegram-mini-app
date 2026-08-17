"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Tabs } from "@/components/ui/Tabs";

interface ProductRow { id: number; title: string; icon: string; price: string; }
interface GiftRow { id: number; name: string; icon: string; price: string; }
interface ChannelRow { id: number; name: string; packages: { id: number; label: string; price: string }[]; }

function PriceInput({ defaultValue, onSave }: { defaultValue: string; onSave: (v: string) => void }) {
  return (
    <input
      type="number"
      defaultValue={defaultValue}
      onBlur={(e) => {
        if (e.target.value !== defaultValue) onSave(e.target.value);
      }}
      className="w-32 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-left text-sm text-white outline-none focus:border-sky-500/60"
    />
  );
}

export function PricesAdminClient({
  products,
  gifts,
  channels,
}: {
  products: ProductRow[];
  gifts: GiftRow[];
  channels: ChannelRow[];
}) {
  const [tab, setTab] = useState("products");

  async function updateProduct(id: number, price: string) {
    await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price }),
    });
    toast.success("قیمت محصول بروزرسانی شد");
  }

  async function updateGift(id: number, price: string) {
    await fetch(`/api/admin/gifts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price }),
    });
    toast.success("قیمت گیفت بروزرسانی شد");
  }

  async function updatePackage(id: number, price: string) {
    await fetch(`/api/admin/packages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price }),
    });
    toast.success("قیمت بسته تبلیغاتی بروزرسانی شد");
  }

  return (
    <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.04] p-5">
      <Tabs
        items={[
          { value: "products", label: "محصولات" },
          { value: "gifts", label: "Giftها" },
          { value: "channels", label: "تبلیغات کانال‌ها" },
        ]}
        value={tab}
        onChange={setTab}
        className="mb-4"
      />

      {tab === "products" && (
        <div className="flex flex-col gap-2">
          {products.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <span className="text-sm text-slate-200">{p.icon} {p.title}</span>
              <PriceInput defaultValue={p.price} onSave={(v) => updateProduct(p.id, v)} />
            </div>
          ))}
        </div>
      )}

      {tab === "gifts" && (
        <div className="flex flex-col gap-2">
          {gifts.map((g) => (
            <div key={g.id} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <span className="text-sm text-slate-200">{g.icon} {g.name}</span>
              <PriceInput defaultValue={g.price} onSave={(v) => updateGift(g.id, v)} />
            </div>
          ))}
        </div>
      )}

      {tab === "channels" && (
        <div className="flex flex-col gap-4">
          {channels.map((c) => (
            <div key={c.id}>
              <p className="mb-2 text-sm font-bold text-white">{c.name}</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {c.packages.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <span className="text-xs text-slate-300">{p.label}</span>
                    <PriceInput defaultValue={p.price} onSave={(v) => updatePackage(p.id, v)} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
