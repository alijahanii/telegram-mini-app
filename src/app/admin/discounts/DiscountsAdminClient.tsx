"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DiscountCodeDTO } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { toPersianDigits, formatDate } from "@/lib/format";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const emptyForm = { code: "", percent: "10", maxUses: "100" };

export function DiscountsAdminClient({ discounts }: { discounts: DiscountCodeDTO[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!form.code.trim()) {
      toast.error("کد تخفیف را وارد کنید");
      return;
    }
    setSaving(true);
    try {
      await fetch("/api/admin/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      toast.success("کد تخفیف اضافه شد");
      setOpen(false);
      setForm(emptyForm);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(d: DiscountCodeDTO) {
    await fetch(`/api/admin/discounts/${d.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !d.isActive }),
    });
    router.refresh();
  }

  async function remove(id: number) {
    if (!confirm("آیا از حذف این کد تخفیف مطمئن هستید؟")) return;
    await fetch(`/api/admin/discounts/${id}`, { method: "DELETE" });
    toast.success("کد تخفیف حذف شد");
    router.refresh();
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> افزودن کد تخفیف
        </Button>
      </div>

      <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.04] p-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-right text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs text-slate-400">
                <th className="pb-2 font-medium">کد</th>
                <th className="pb-2 font-medium">درصد</th>
                <th className="pb-2 font-medium">استفاده</th>
                <th className="pb-2 font-medium">تاریخ ایجاد</th>
                <th className="pb-2 font-medium">وضعیت</th>
                <th className="pb-2 font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((d) => (
                <tr key={d.id} className="border-b border-white/[0.04]">
                  <td className="py-2.5 font-bold text-white">{d.code}</td>
                  <td className="py-2.5 text-sky-400">{toPersianDigits(d.percent)}٪</td>
                  <td className="py-2.5 text-slate-400">{toPersianDigits(d.usedCount)} / {toPersianDigits(d.maxUses)}</td>
                  <td className="py-2.5 text-xs text-slate-500">{formatDate(d.createdAt)}</td>
                  <td className="py-2.5">
                    <button onClick={() => toggleActive(d)}>
                      <Badge tone={d.isActive ? "green" : "red"}>{d.isActive ? "فعال" : "غیرفعال"}</Badge>
                    </button>
                  </td>
                  <td className="py-2.5">
                    <Button size="sm" variant="danger" onClick={() => remove(d.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="افزودن کد تخفیف">
        <div className="flex flex-col gap-3">
          <div>
            <Label>کد تخفیف</Label>
            <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="مثلا SUMMER20" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>درصد تخفیف</Label>
              <Input type="number" value={form.percent} onChange={(e) => setForm({ ...form, percent: e.target.value })} />
            </div>
            <div>
              <Label>حداکثر استفاده</Label>
              <Input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} />
            </div>
          </div>
          <Button fullWidth loading={saving} onClick={save}>افزودن کد تخفیف</Button>
        </div>
      </Modal>
    </div>
  );
}
