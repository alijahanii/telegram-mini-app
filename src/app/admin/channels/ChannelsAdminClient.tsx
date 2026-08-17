"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { formatToman, toPersianDigits } from "@/lib/format";
import { Plus, Trash2, Pencil, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface AdminPackage {
  id: number;
  type: string;
  label: string;
  price: string;
  isActive: boolean;
}

interface AdminChannel {
  id: number;
  name: string;
  username: string;
  category: string;
  membersCount: number;
  avgViews: number;
  engagement: string;
  description: string;
  isActive: boolean;
  packages: AdminPackage[];
}

const emptyForm = {
  name: "",
  username: "",
  category: "عمومی",
  membersCount: "",
  avgViews: "",
  engagement: "",
  description: "",
};

export function ChannelsAdminClient({ channels }: { channels: AdminChannel[] }) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminChannel | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function openEdit(c: AdminChannel) {
    setEditing(c);
    setForm({
      name: c.name,
      username: c.username,
      category: c.category,
      membersCount: String(c.membersCount),
      avgViews: String(c.avgViews),
      engagement: c.engagement,
      description: c.description,
    });
    setFormOpen(true);
  }

  async function save() {
    setSaving(true);
    try {
      if (editing) {
        await fetch(`/api/admin/channels/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        toast.success("کانال بروزرسانی شد");
      } else {
        await fetch("/api/admin/channels", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        toast.success("کانال جدید اضافه شد");
      }
      setFormOpen(false);
      router.refresh();
    } catch {
      toast.error("خطا در ذخیره‌سازی");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("آیا از حذف این کانال مطمئن هستید؟")) return;
    await fetch(`/api/admin/channels/${id}`, { method: "DELETE" });
    toast.success("کانال حذف شد");
    router.refresh();
  }

  async function updatePackagePrice(pkgId: number, price: string) {
    await fetch(`/api/admin/packages/${pkgId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price }),
    });
    toast.success("قیمت بسته بروزرسانی شد");
    router.refresh();
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> افزودن کانال
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {channels.map((c) => (
          <div key={c.id} className="rounded-[20px] border border-white/[0.06] bg-white/[0.04] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/30 to-purple-500/30 text-xl">📢</div>
                <div>
                  <p className="text-sm font-bold text-white">{c.name}</p>
                  <p className="text-xs text-slate-400">{c.username} · {toPersianDigits(c.membersCount)} عضو</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Badge tone={c.isActive ? "green" : "red"}>{c.isActive ? "فعال" : "غیرفعال"}</Badge>
                <button onClick={() => openEdit(c)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                  <Pencil className="h-4 w-4 text-slate-300" />
                </button>
                <button onClick={() => remove(c.id)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
                  <Trash2 className="h-4 w-4 text-red-400" />
                </button>
                <button
                  onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5"
                >
                  <ChevronDown className={`h-4 w-4 text-slate-300 transition-transform ${expanded === c.id ? "rotate-180" : ""}`} />
                </button>
              </div>
            </div>

            {expanded === c.id && (
              <div className="mt-4 grid grid-cols-1 gap-2 border-t border-white/[0.06] pt-4 sm:grid-cols-2">
                {c.packages.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                    <span className="text-xs text-slate-300">{p.label}</span>
                    <input
                      type="number"
                      defaultValue={p.price}
                      onBlur={(e) => {
                        if (e.target.value !== p.price) updatePackagePrice(p.id, e.target.value);
                      }}
                      className="w-28 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-left text-xs text-white outline-none focus:border-sky-500/60"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? "ویرایش کانال" : "افزودن کانال"}>
        <div className="flex flex-col gap-3">
          <div>
            <Label>نام کانال</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>یوزرنیم</Label>
            <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="@channel" />
          </div>
          <div>
            <Label>دسته‌بندی</Label>
            <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>تعداد اعضا</Label>
              <Input type="number" value={form.membersCount} onChange={(e) => setForm({ ...form, membersCount: e.target.value })} />
            </div>
            <div>
              <Label>میانگین بازدید</Label>
              <Input type="number" value={form.avgViews} onChange={(e) => setForm({ ...form, avgViews: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>نرخ تعامل (٪)</Label>
            <Input type="number" value={form.engagement} onChange={(e) => setForm({ ...form, engagement: e.target.value })} />
          </div>
          <div>
            <Label>توضیحات</Label>
            <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <Button fullWidth loading={saving} onClick={save}>
            {editing ? "ذخیره تغییرات" : "افزودن کانال"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
