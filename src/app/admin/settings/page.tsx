"use client";

import { useState } from "react";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

function Toggle({ defaultChecked }: { defaultChecked?: boolean }) {
  const [on, setOn] = useState(!!defaultChecked);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-sky-500" : "bg-white/15"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${on ? "-translate-x-0.5" : "-translate-x-5"}`} />
    </button>
  );
}

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="mb-1 text-xl font-extrabold text-white">تنظیمات فروشگاه</h1>
      <p className="mb-6 text-sm text-slate-400">پیکربندی عمومی و اطلاعات پایه TeleShop</p>

      <div className="mb-6 rounded-[20px] border border-white/[0.06] bg-white/[0.04] p-5">
        <p className="mb-4 text-sm font-bold text-white">اطلاعات فروشگاه</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label>نام فروشگاه</Label>
            <Input defaultValue="TeleShop" />
          </div>
          <div>
            <Label>آیدی پشتیبانی تلگرام</Label>
            <Input defaultValue="@teleshop_support" />
          </div>
        </div>
        <Button className="mt-4" onClick={() => toast.success("تنظیمات ذخیره شد")}>
          ذخیره تغییرات
        </Button>
      </div>

      <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.04] p-5">
        <p className="mb-4 text-sm font-bold text-white">تنظیمات سیستمی</p>
        <div className="flex items-center justify-between border-b border-white/[0.05] py-3">
          <span className="text-sm text-slate-300">حالت تعمیر و نگهداری</span>
          <Toggle />
        </div>
        <div className="flex items-center justify-between border-b border-white/[0.05] py-3">
          <span className="text-sm text-slate-300">ثبت‌نام کاربران جدید</span>
          <Toggle defaultChecked />
        </div>
        <div className="flex items-center justify-between py-3">
          <span className="text-sm text-slate-300">اعلان ایمیلی سفارش‌های جدید</span>
          <Toggle defaultChecked />
        </div>
      </div>
    </div>
  );
}
