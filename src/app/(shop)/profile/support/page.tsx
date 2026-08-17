import { PageContainer } from "@/components/layout/PageContainer";
import Link from "next/link";
import { ChevronRight, MessageCircle, Mail, Phone } from "lucide-react";

export default function SupportPage() {
  return (
    <PageContainer>
      <div className="mb-4 flex items-center gap-2">
        <Link href="/profile" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
          <ChevronRight className="h-4 w-4 text-slate-300" />
        </Link>
        <h1 className="text-base font-bold text-white">پشتیبانی</h1>
      </div>

      <div className="mb-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 text-sm leading-6 text-slate-400">
        تیم پشتیبانی TeleShop به صورت شبانه‌روزی آماده پاسخگویی به سوالات شماست. از راه‌های زیر با ما در ارتباط باشید.
      </div>

      <div className="flex flex-col gap-2.5">
        <a
          href="https://t.me/teleshop_support"
          className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.04] p-4 active:scale-[0.98]"
        >
          <MessageCircle className="h-5 w-5 text-sky-400" />
          <div>
            <p className="text-sm font-bold text-white">چت با پشتیبانی در تلگرام</p>
            <p className="text-xs text-slate-400">@teleshop_support</p>
          </div>
        </a>
        <a
          href="mailto:support@teleshop.app"
          className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.04] p-4 active:scale-[0.98]"
        >
          <Mail className="h-5 w-5 text-purple-400" />
          <div>
            <p className="text-sm font-bold text-white">ایمیل پشتیبانی</p>
            <p className="text-xs text-slate-400">support@teleshop.app</p>
          </div>
        </a>
        <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.04] p-4">
          <Phone className="h-5 w-5 text-emerald-400" />
          <div>
            <p className="text-sm font-bold text-white">تماس تلفنی</p>
            <p className="text-xs text-slate-400">۹ صبح تا ۹ شب، همه روزه</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
