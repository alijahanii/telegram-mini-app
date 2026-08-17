import { PageContainer } from "@/components/layout/PageContainer";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const RULES = [
  "تمامی پرداخت‌ها از طریق کیف پول داخلی TeleShop انجام می‌شود و اطلاعات بانکی ذخیره نمی‌گردد.",
  "پس از ثبت سفارش تبلیغات، امکان لغو تا قبل از شروع پخش تبلیغ وجود دارد.",
  "محصولات دیجیتال مانند Stars و Premium پس از تحویل قابل استرداد نیستند مگر در صورت بروز خطای فنی.",
  "کدهای تخفیف صرفا در بازه زمانی اعتبار خود قابل استفاده هستند.",
  "هرگونه سو استفاده از سیستم تخفیف یا کیف پول منجر به مسدود شدن حساب کاربری خواهد شد.",
  "پشتیبانی TeleShop متعهد به پاسخگویی حداکثر ظرف ۲۴ ساعت است.",
];

export default function RulesPage() {
  return (
    <PageContainer>
      <div className="mb-4 flex items-center gap-2">
        <Link href="/profile" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
          <ChevronRight className="h-4 w-4 text-slate-300" />
        </Link>
        <h1 className="text-base font-bold text-white">قوانین و مقررات</h1>
      </div>

      <div className="flex flex-col gap-2.5">
        {RULES.map((rule, idx) => (
          <div key={idx} className="flex gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500/15 text-[11px] font-bold text-sky-400">
              {idx + 1}
            </span>
            <p className="text-sm leading-6 text-slate-300">{rule}</p>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
