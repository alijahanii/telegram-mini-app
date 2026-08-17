"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import Link from "next/link";
import { ChevronRight, Moon, Bell, Globe, Shield } from "lucide-react";
import { useState } from "react";

function Toggle({ defaultChecked }: { defaultChecked?: boolean }) {
  const [on, setOn] = useState(!!defaultChecked);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-sky-500" : "bg-white/15"}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${on ? "-translate-x-0.5" : "-translate-x-5"}`}
      />
    </button>
  );
}

export default function SettingsPage() {
  return (
    <PageContainer>
      <div className="mb-4 flex items-center gap-2">
        <Link href="/profile" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
          <ChevronRight className="h-4 w-4 text-slate-300" />
        </Link>
        <h1 className="text-base font-bold text-white">تنظیمات</h1>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-white/[0.06] bg-white/[0.04]">
        <div className="flex items-center gap-3 border-b border-white/[0.05] px-4 py-4">
          <Moon className="h-[18px] w-[18px] text-purple-400" />
          <span className="flex-1 text-sm text-slate-200">حالت تیره</span>
          <Toggle defaultChecked />
        </div>
        <div className="flex items-center gap-3 border-b border-white/[0.05] px-4 py-4">
          <Bell className="h-[18px] w-[18px] text-amber-400" />
          <span className="flex-1 text-sm text-slate-200">اعلان‌ها</span>
          <Toggle defaultChecked />
        </div>
        <div className="flex items-center gap-3 border-b border-white/[0.05] px-4 py-4">
          <Globe className="h-[18px] w-[18px] text-sky-400" />
          <span className="flex-1 text-sm text-slate-200">زبان</span>
          <span className="text-xs text-slate-400">فارسی</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-4">
          <Shield className="h-[18px] w-[18px] text-emerald-400" />
          <span className="flex-1 text-sm text-slate-200">حریم خصوصی و امنیت</span>
        </div>
      </div>
    </PageContainer>
  );
}
