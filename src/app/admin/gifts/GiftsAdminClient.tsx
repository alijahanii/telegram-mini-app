"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GiftDTO, RARITY_META, Rarity } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { formatToman, toPersianDigits } from "@/lib/format";
import { Plus, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";

const emptyForm = {
  name: "",
  description: "",
  icon: "🎁",
  rarity: "common",
  price: "",
  stock: "",
};

export function GiftsAdminClient({ gifts }: { gifts: GiftDTO[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<GiftDTO | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(g: GiftDTO) {
    setEditing(g);
    setForm({ name: g.name, description: g.description, icon: g.icon, rarity: g.rarity, price: g.price, stock: String(g.stock) });
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    try {
      if (editing) {
        await fetch(`/api/admin/gifts/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        toast.success("گیفت بروزرسانی شد");
      } else {
        await fetch("/api/admin/gifts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        toast.success("گیفت جدید اضافه شد");
      }
      setOpen(false);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("آیا از حذف این گیفت مطمئن هستید؟")) return;
    await fetch(`/api/admin/gifts/${id}`, { method: "DELETE" });
    toast.success("گیفت حذف شد");
    router.refresh();
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> افزودن گیفت
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {gifts.map((g) => {
          const rarity = RARITY_META[g.rarity as Rarity] ?? RARITY_META.common;
          return (
            <div key={g.id} className="rounded-[20px] border border-white/[0.06] bg-white/[0.04] p-4">
              <div className="mb-2 flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] text-2xl">{g.icon}</span>
                <Badge tone="purple">{rarity.label}</Badge>
              </div>
              <p className="mb-1 text-sm font-bold text-white">{g.name}</p>
              <p className="mb-2 text-[11px] text-slate-500">موجودی: {toPersianDigits(g.stock)}</p>
              <p className="mb-3 text-sm font-bold text-sky-400">{formatToman(g.price)}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(g)}>
                  <Pencil className="h-3.5 w-3.5" /> ویرایش
                </Button>
                <Button size="sm" variant="danger" onClick={() => remove(g.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "ویرایش گیفت" : "افزودن گیفت"}>
        <div className="flex flex-col gap-3">
          <div>
            <Label>نام گیفت</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>توضیحات</Label>
            <Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>آیکون (ایموجی)</Label>
              <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
            </div>
            <div>
              <Label>سطح کمیابی</Label>
              <Select value={form.rarity} onChange={(e) => setForm({ ...form, rarity: e.target.value })}>
                <option value="common">معمولی</option>
                <option value="rare">کمیاب</option>
                <option value="epic">حماسی</option>
                <option value="legendary">افسانه‌ای</option>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>قیمت (تومان)</Label>
              <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div>
              <Label>موجودی</Label>
              <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>
          </div>
          <Button fullWidth loading={saving} onClick={save}>
            {editing ? "ذخیره تغییرات" : "افزودن گیفت"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
