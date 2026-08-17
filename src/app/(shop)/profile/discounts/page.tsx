import { PageContainer } from "@/components/layout/PageContainer";
import { listDiscountCodes } from "@/lib/queries";
import { toPersianDigits, formatDate } from "@/lib/format";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { ChevronRight, Ticket } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DiscountsPage() {
  const codes = await listDiscountCodes();
  const active = codes.filter((c) => c.isActive && c.usedCount < c.maxUses);

  return (
    <PageContainer>
      <div className="mb-4 flex items-center gap-2">
        <Link href="/profile" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
          <ChevronRight className="h-4 w-4 text-slate-300" />
        </Link>
        <h1 className="text-base font-bold text-white">کدهای تخفیف</h1>
      </div>

      {active.length === 0 ? (
        <EmptyState icon="🎟️" title="کد تخفیف فعالی وجود ندارد" />
      ) : (
        <div className="flex flex-col gap-3">
          {active.map((c) => (
            <div
              key={c.id}
              className="relative overflow-hidden rounded-2xl border border-dashed border-sky-500/30 bg-gradient-to-l from-sky-500/10 to-purple-500/10 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-sky-400" />
                  <span className="text-base font-extrabold tracking-wider text-white">{c.code}</span>
                </div>
                <Badge tone="green">{toPersianDigits(c.percent)}٪ تخفیف</Badge>
              </div>
              <p className="mt-2 text-[11px] text-slate-400">
                {toPersianDigits(c.maxUses - c.usedCount)} استفاده باقیمانده
                {c.expiresAt && ` · تا ${formatDate(c.expiresAt)}`}
              </p>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
