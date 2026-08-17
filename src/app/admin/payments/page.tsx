import { listAllTransactionsAdmin } from "@/lib/admin-queries";
import { formatDateTime, formatToman, toPersianDigits } from "@/lib/format";
import { EmptyState } from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<string, string> = {
  deposit: "واریز به کیف پول",
  purchase: "خرید",
  refund: "بازگشت وجه",
  withdraw: "برداشت",
};

export default async function AdminPaymentsPage() {
  const transactions = await listAllTransactionsAdmin();

  return (
    <div>
      <h1 className="mb-1 text-xl font-extrabold text-white">پرداخت‌ها و تراکنش‌ها</h1>
      <p className="mb-6 text-sm text-slate-400">تاریخچه کامل تراکنش‌های مالی کاربران</p>

      {transactions.length === 0 ? (
        <EmptyState title="تراکنشی ثبت نشده است" />
      ) : (
        <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.04] p-5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-right text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs text-slate-400">
                  <th className="pb-2 font-medium">کاربر</th>
                  <th className="pb-2 font-medium">نوع</th>
                  <th className="pb-2 font-medium">توضیحات</th>
                  <th className="pb-2 font-medium">مبلغ</th>
                  <th className="pb-2 font-medium">وضعیت</th>
                  <th className="pb-2 font-medium">تاریخ</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => {
                  const positive = Number(t.amount) > 0;
                  return (
                    <tr key={t.id} className="border-b border-white/[0.04]">
                      <td className="py-2.5 text-slate-300">{t.firstName} (@{t.username})</td>
                      <td className="py-2.5 text-slate-400">{TYPE_LABEL[t.type] ?? t.type}</td>
                      <td className="py-2.5 text-slate-400">{t.description}</td>
                      <td className={`py-2.5 font-bold ${positive ? "text-emerald-400" : "text-red-400"}`}>
                        {positive ? "+" : ""}
                        {formatToman(t.amount)}
                      </td>
                      <td className="py-2.5 text-xs text-slate-400">{t.status === "completed" ? "موفق" : t.status}</td>
                      <td className="py-2.5 text-xs text-slate-500">{formatDateTime(t.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
