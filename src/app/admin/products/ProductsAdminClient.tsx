"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductDTO } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { formatToman, toPersianDigits } from "@/lib/format";
import { Plus, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";

const emptyForm = {
  category: "premium",
  title: "",
  description: "",
  icon: "⭐",
  price: "",
  stock: "",
  unit: "عدد",
  badge: "",
  isPopular: false,
};

export function ProductsAdminClient({ products }: { products: ProductDTO[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProductDTO | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(p: ProductDTO) {
    setEditing(p);
    setForm({
      category: p.category,
      title: p.title,
      description: p.description,
      icon: p.icon,
      price: p.price,
      stock: String(p.stock),
      unit: p.unit,
      badge: p.badge ?? "",
      isPopular: p.isPopular,
    });
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    try {
      const payload = { ...form, badge: form.badge || null };
      if (editing) {
        await fetch(`/api/admin/products/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        toast.success("محصول بروزرسانی شد");
      } else {
        await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        toast.success("محصول جدید اضافه شد");
      }
      setOpen(false);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(p: ProductDTO) {
    await fetch(`/api/admin/products/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !p.isActive }),
    });
    router.refresh();
  }

  async function remove(id: number) {
    if (!confirm("آیا از حذف این محصول مطمئن هستید؟")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    toast.success("محصول حذف شد");
    router.refresh();
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> افزودن محصول
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div key={p.id} className="rounded-[20px] border border-white/[0.06] bg-white/[0.04] p-4">
            <div className="mb-2 flex items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] text-2xl">{p.icon}</span>
              <button onClick={() => toggleActive(p)}>
                <Badge tone={p.isActive ? "green" : "red"}>{p.isActive ? "فعال" : "غیرفعال"}</Badge>
              </button>
            </div>
            <p className="mb-1 text-sm font-bold text-white">{p.title}</p>
            <p className="mb-2 text-[11px] text-slate-500">{p.category} · موجودی: {toPersianDigits(p.stock)}</p>
            <p className="mb-3 text-sm font-bold text-sky-400">{formatToman(p.price)}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(p)}>
                <Pencil className="h-3.5 w-3.5" /> ویرایش
              </Button>
              <Button size="sm" variant="danger" onClick={() => remove(p.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "ویرایش محصول" : "افزودن محصول"}>
        <div className="flex flex-col gap-3">
          <div>
            <Label>دسته‌بندی</Label>
            <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="premium">Premium</option>
              <option value="stars">Stars</option>
              <option value="sticker">استیکر</option>
              <option value="other">سایر خدمات</option>
            </Select>
          </div>
          <div>
            <Label>عنوان محصول</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
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
              <Label>واحد</Label>
              <Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
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
          <div>
            <Label>برچسب (اختیاری)</Label>
            <Input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="مثلا پرفروش" />
          </div>
          <Button fullWidth loading={saving} onClick={save}>
            {editing ? "ذخیره تغییرات" : "افزودن محصول"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
