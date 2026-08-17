"use client";

import { useState } from "react";
import { Tabs } from "@/components/ui/Tabs";
import { OrderCard } from "@/components/OrderCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { OrderDTO, OrderStatus } from "@/lib/types";

const TABS: { value: string; label: string }[] = [
  { value: "all", label: "همه" },
  { value: "pending", label: "در انتظار" },
  { value: "processing", label: "در حال انجام" },
  { value: "completed", label: "تکمیل شده" },
  { value: "cancelled", label: "لغو شده" },
];

export function OrdersClient({ orders }: { orders: OrderDTO[] }) {
  const [tab, setTab] = useState("all");
  const filtered = tab === "all" ? orders : orders.filter((o) => o.status === (tab as OrderStatus));

  return (
    <div>
      <Tabs items={TABS} value={tab} onChange={setTab} className="mb-4" />
      {filtered.length === 0 ? (
        <EmptyState icon="📦" title="سفارشی یافت نشد" description="سفارشات شما در این وضعیت نمایش داده می‌شود" />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </div>
      )}
    </div>
  );
}
