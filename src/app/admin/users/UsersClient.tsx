"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserDTO } from "@/lib/types";
import { formatToman, toPersianDigits, formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { toast } from "sonner";

export function UsersClient({ users }: { users: UserDTO[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<UserDTO | null>(null);
  const [balance, setBalance] = useState("");
  const [saving, setSaving] = useState(false);

  function openEdit(u: UserDTO) {
    setEditing(u);
    setBalance(u.walletBalance);
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletBalance: balance }),
      });
      if (!res.ok) throw new Error();
      toast.success("موجودی کاربر بروزرسانی شد");
      setEditing(null);
      router.refresh();
    } catch {
      toast.error("خطا در بروزرسانی");
    } finally {
      setSaving(false);
    }
  }

  async function toggleRole(u: UserDTO) {
    const role = u.role === "admin" ? "user" : "admin";
    await fetch(`/api/admin/users/${u.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    toast.success("نقش کاربر تغییر کرد");
    router.refresh();
  }

  return (
    <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.04] p-5">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-right text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs text-slate-400">
              <th className="pb-2 font-medium">نام</th>
              <th className="pb-2 font-medium">یوزرنیم</th>
              <th className="pb-2 font-medium">شناسه تلگرام</th>
              <th className="pb-2 font-medium">موجودی</th>
              <th className="pb-2 font-medium">نقش</th>
              <th className="pb-2 font-medium">عضویت</th>
              <th className="pb-2 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-white/[0.04]">
                <td className="py-2.5 text-slate-200">{u.firstName} {u.lastName ?? ""}</td>
                <td className="py-2.5 text-slate-400">@{u.username}</td>
                <td className="py-2.5 text-slate-400">{toPersianDigits(u.telegramId ?? "-")}</td>
                <td className="py-2.5 font-bold text-sky-400">{formatToman(u.walletBalance)}</td>
                <td className="py-2.5">
                  <button onClick={() => toggleRole(u)}>
                    <Badge tone={u.role === "admin" ? "purple" : "slate"}>{u.role === "admin" ? "مدیر" : "کاربر"}</Badge>
                  </button>
                </td>
                <td className="py-2.5 text-xs text-slate-500">{formatDate(u.createdAt)}</td>
                <td className="py-2.5">
                  <Button size="sm" variant="outline" onClick={() => openEdit(u)}>
                    ویرایش موجودی
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="ویرایش موجودی کاربر">
        <div className="mb-4">
          <Label>موجودی کیف پول (تومان)</Label>
          <Input type="number" value={balance} onChange={(e) => setBalance(e.target.value)} />
        </div>
        <Button fullWidth loading={saving} onClick={save}>ذخیره تغییرات</Button>
      </Modal>
    </div>
  );
}
