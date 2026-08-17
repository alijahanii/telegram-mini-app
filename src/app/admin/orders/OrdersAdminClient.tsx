"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDateTime, formatToman, toPersianDigits } from "@/lib/format";
import { ORDER_STATUS_META, OrderStatus } from "@/lib/types";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

interface AdminOrder {
  id: number;
  userId: number;
  type: string;
  status: string;
  totalAmount: string;
  discountAmount: string;
  paymentMethod: string;
  note: string | null;
  createdAt: string;
  firstName: string | null;
  username: string | null;
}

const TABS = [
  { value: "all", label: "همه" },
  { value: "pending", label: "در انتظار" },
  { value: "processing", label: "در حال انجام" },
  { value: "completed", label: "تکمیل شده" },
  { value: "cancelled", label: "لغو شده" },
];

export function OrdersAdminClient({ orders }: { orders: AdminOrder[] }) {
  const router = useRouter();
  const [tab, setTab] = useState("all");
  const [updating, setUpdating] = useState<number | null>(null);
  const filtered = tab === "all" ? orders : orders.filter((o) => o.status === tab);

  async function updateStatus(id: number, status: string) {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      toast.success("وضعیت سفارش بروزرسانی شد");
      router.refresh();
    } catch {
      toast.error("خطا در بروزرسانی وضعیت");
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.04] p-5">
      <Tabs items={TABS} value={tab} onChange={setTab} className="mb-4" />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-right text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs text-slate-400">
              <th className="pb-2 font-medium">شناسه</th>
              <th className="pb-2 font-medium">کاربر</th>
              <th className="pb-2 font-medium">نوع</th>
              <th className="pb-2 font-medium">مبلغ</th>
              <th className="pb-2 font-medium">تاریخ</th>
              <th className="pb-2 font-medium">وضعیت</th>
              <th className="pb-2 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => {
              const status = ORDER_STATUS_META[o.status as OrderStatus] ?? ORDER_STATUS_META.pending;
              return (
                <tr key={o.id} className="border-b border-white/[0.04]">
                  <td className="py-2.5 text-slate-300">#{toPersianDigits(o.id)}</td>
                  <td className="py-2.5 text-slate-300">{o.firstName ?? "-"}</td>
                  <td className="py-2.5 text-slate-400">{o.type === "ad" ? "تبلیغ" : o.type === "gift" ? "گیفت" : "سرویس"}</td>
                  <td className="py-2.5 font-bold text-sky-400">{formatToman(o.totalAmount)}</td>
                  <td className="py-2.5 text-xs text-slate-500">{formatDateTime(o.createdAt)}</td>
                  <td className="py-2.5">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] ${status.className}`}>{status.label}</span>
                  </td>
                  <td className="py-2.5">
                    <div className="flex gap-1.5">
                      {o.status === "pending" && (
                        <>
                          <Button size="sm" loading={updating === o.id} onClick={() => updateStatus(o.id, "processing")}>
                            تایید
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => updateStatus(o.id, "cancelled")}>
                            رد
                          </Button>
                        </>
                      )}
                      {o.status === "processing" && (
                        <Button size="sm" onClick={() => updateStatus(o.id, "completed")}>
                          تکمیل
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
