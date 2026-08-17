import Link from "next/link";
import { PageContainer, SectionTitle } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProductCard } from "@/components/ProductCard";
import { getCurrentUser } from "@/lib/current-user";
import { listPopularProducts } from "@/lib/queries";
import { formatToman } from "@/lib/format";
import { Wallet, ChevronLeft, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

const CATEGORIES = [
  { href: "/ads", label: "تبلیغات کانال‌ها", icon: "📢", tone: "from-sky-500/25 to-blue-600/10" },
  { href: "/store/premium", label: "Premium", icon: "⭐", tone: "from-amber-400/25 to-orange-500/10" },
  { href: "/store/stars", label: "Stars", icon: "✨", tone: "from-purple-400/25 to-fuchsia-600/10" },
  { href: "/gifts", label: "Gift", icon: "🎁", tone: "from-pink-400/25 to-rose-600/10" },
  { href: "/store/sticker", label: "Sticker", icon: "🎨", tone: "from-emerald-400/25 to-teal-600/10" },
  { href: "/store/other", label: "سایر خدمات", icon: "🛠", tone: "from-slate-400/25 to-slate-600/10" },
];

export default async function HomePage() {
  const [user, popular] = await Promise.all([getCurrentUser(), listPopularProducts()]);

  return (
    <PageContainer>
      {/* Welcome */}
      <section className="mb-5 animate-slide-up">
        <h1 className="text-xl font-extrabold text-white">سلام {user?.firstName ?? ""} 👋</h1>
        <p className="mt-1 text-sm text-slate-400">به فروشگاه خدمات تلگرام خوش آمدید</p>
      </section>

      {/* Wallet card */}
      <Card className="relative mb-6 overflow-hidden p-5 animate-slide-up">
        <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-1.5 text-slate-400">
              <Wallet className="h-3.5 w-3.5" />
              <span className="text-xs">موجودی کیف پول</span>
            </div>
            <p className="text-2xl font-extrabold text-white">
              {formatToman(user?.walletBalance ?? 0)}
            </p>
          </div>
          <Link href="/profile/wallet">
            <Button size="md">افزایش موجودی</Button>
          </Link>
        </div>
      </Card>

      {/* Categories */}
      <section className="mb-6">
        <SectionTitle title="دسته‌بندی خدمات" />
        <div className="grid grid-cols-3 gap-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="flex flex-col items-center justify-center gap-2 rounded-[18px] border border-white/[0.06] bg-white/[0.04] py-4 backdrop-blur-xl transition-transform active:scale-95"
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${c.tone} text-2xl`}>
                {c.icon}
              </span>
              <span className="text-[11px] font-medium text-slate-200">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Promo banner */}
      <Link href="/store/premium" className="mb-6 block">
        <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-l from-[#7C3AED] via-[#5B6FEE] to-[#2AABEE] p-5 shadow-[0_16px_40px_-12px_rgba(91,111,238,0.6)]">
          <div className="absolute left-3 top-3 rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
            ٪۳۰ تخفیف
          </div>
          <Sparkles className="absolute left-4 bottom-4 h-16 w-16 text-white/10" />
          <div className="relative mt-6">
            <p className="text-lg font-extrabold text-white">پیشنهاد ویژه امروز</p>
            <p className="mt-1 text-xs text-white/80">اشتراک تلگرام پرمیوم با تخفیف باورنکردنی، فقط امروز</p>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-2xl bg-white px-4 py-2 text-xs font-bold text-[#5B6FEE]">
              مشاهده پیشنهاد
              <ChevronLeft className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </Link>

      {/* Popular products */}
      <section>
        <SectionTitle title="محصولات پرطرفدار" action={{ label: "مشاهده همه", href: "/store" }} />
        <div className="grid grid-cols-2 gap-3">
          {popular.map((p) => (
            <ProductCard
              key={p.id}
              product={{ ...p, price: String(p.price) }}
            />
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
