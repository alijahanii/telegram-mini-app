"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatToman, formatDateTime, toPersianDigits } from "@/lib/format";
import { TransactionDTO } from "@/lib/types";
import { toast } from "sonner";
import { Wallet, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { hapticNotify } from "@/lib/telegram";

const AMOUNTS = [100000, 250000, 500000, 1000000, 2000000, 5000000];

export function WalletClient({
  initialBalance,
  transactions,
}: {
  initialBalance: string;
  transactions: TransactionDTO[];
}) {
  const router = useRouter();
  const [balance, setBalance] = useState(Number(initialBalance));
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleTopup() {
    if (!amount) return;
    setLoading(true);
    try {
      const res = await fetch("/api/wallet/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "خطا در افزایش موجودی");
        return;
      }
      setBalance(data.balance);
      hapticNotify("success");
      toast.success("کیف پول با موفقیت شارژ شد");
      setOpen(false);
      setAmount(null);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Card className="relative mb-6 overflow-hidden p-5">
        <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-1.5 text-slate-400">
              <Wallet className="h-3.5 w-3.5" />
              <span className="text-xs">موجودی فعلی</span>
            </div>
            <p className="text-2xl font-extrabold text-white">{formatToman(balance)}</p>
          </div>
          <Button onClick={() => setOpen(true)}>افزایش موجودی</Button>
        </div>
      </Card>

      <h2 className="mb-3 text-sm font-bold text-white">تاریخچه تراکنش‌ها</h2>
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

      <Modal open={open} onClose={() => setOpen(false)} title="افزایش موجودی کیف پول">
        <div className="mb-4 grid grid-cols-3 gap-2">
          {AMOUNTS.map((a) => (
            <button
              key={a}
              onClick={() => setAmount(a)}
              className={`rounded-xl border p-3 text-center text-xs font-bold transition ${
                amount === a ? "border-sky-500/60 bg-sky-500/10 text-sky-400" : "border-white/10 bg-white/[0.03] text-slate-300"
              }`}
            >
              {toPersianDigits(a.toLocaleString("en-US"))}
              <br />
              تومان
            </button>
          ))}
        </div>
        <Button fullWidth size="lg" disabled={!amount} loading={loading} onClick={handleTopup}>
          پرداخت و شارژ کیف پول
        </Button>
      </Modal>
    </div>
  );
}
