import { PageContainer } from "@/components/layout/PageContainer";
import { getCurrentUser } from "@/lib/current-user";
import { listTransactionsForUser } from "@/lib/queries";
import { formatDateTime, formatToman } from "@/lib/format";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";
import { ChevronRight, ArrowDownLeft, ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
  const user = await getCurrentUser();
  const transactions = user ? await listTransactionsForUser(user.id) : [];

  return (
    <PageContainer>
      <div className="mb-4 flex items-center gap-2">
        <Link href="/profile" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
          <ChevronRight className="h-4 w-4 text-slate-300" />
        </Link>
        <h1 className="text-base font-bold text-white">تراکنش‌ها</h1>
      </div>

      {transactions.length === 0 ? (
        <EmptyState icon="🧾" title="تراکنشی ثبت نشده است" />
      ) : (
        <div className="flex flex-col gap-2.5">
          {transactions.map((t) => {
            const positive = Number(t.amount) > 0;
            return (
              <div
                key={t.id}
                className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3.5"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${positive ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}
                >
                  {positive ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-white">{t.description}</p>
                  <p className="text-[11px] text-slate-500">{formatDateTime(t.createdAt)}</p>
                </div>
                <p className={`text-sm font-bold ${positive ? "text-emerald-400" : "text-red-400"}`}>
                  {positive ? "+" : ""}
                  {formatToman(t.amount)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}
