"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatToman, toPersianDigits } from "@/lib/format";
import { Wallet, ShieldCheck, Tag, X } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { hapticNotify } from "@/lib/telegram";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clear } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [discountInput, setDiscountInput] = useState("");
  const [discount, setDiscount] = useState<{ code: string; percent: number } | null>(null);
  const [checkingDiscount, setCheckingDiscount] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/wallet")
      .then((r) => r.json())
      .then((d) => setBalance(Number(d.balance ?? 0)))
      .catch(() => setBalance(0));
  }, []);

  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const discountAmount = discount ? Math.round((subtotal * discount.percent) / 100) : 0;
  const total = subtotal - discountAmount;
  const insufficientBalance = balance !== null && balance < total;

  async function applyDiscount() {
    if (!discountInput.trim()) return;
    setCheckingDiscount(true);
    try {
      const res = await fetch("/api/discount/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: discountInput }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
        return;
      }
      setDiscount({ code: data.code, percent: data.percent });
      toast.success(`کد تخفیف ${data.percent}٪ اعمال شد`);
    } finally {
      setCheckingDiscount(false);
    }
  }

  async function handlePay() {
    if (items.length === 0) return;
    setPaying(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            itemType: i.itemType,
            refId: i.refId,
            title: i.title,
            icon: i.icon,
            unitPrice: i.unitPrice,
            quantity: i.quantity,
          })),
          discountCode: discount?.code,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        hapticNotify("error");
        toast.error(data.error ?? "خطا در پرداخت");
        return;
      }
      hapticNotify("success");
      toast.success("پرداخت با موفقیت انجام شد");
      clear();
      router.push(`/orders/${data.orderId}`);
    } finally {
      setPaying(false);
    }
  }

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <PageContainer>
        <h1 className="mb-4 text-lg font-extrabold text-white">پرداخت</h1>
        <p className="text-center text-sm text-slate-400">سبد خرید شما خالی است.</p>
        <Link href="/store" className="mt-4 block">
          <Button fullWidth>مشاهده فروشگاه</Button>
        </Link>
      </PageContainer>
    );
  }

  return (
    <PageContainer noPadBottom>
      <h1 className="mb-4 text-lg font-extrabold text-white">تسویه حساب</h1>

      <div className="pb-[calc(140px+env(safe-area-inset-bottom))]">
        {/* Order summary */}
        <div className="mb-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
          <p className="mb-3 text-sm font-bold text-white">خلاصه سفارش</p>
          <div className="flex flex-col gap-2">
            {items.map((i) => (
              <div key={i.key} className="flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  {i.title} × {toPersianDigits(i.quantity)}
                </span>
                <span className="text-slate-200">{formatToman(i.unitPrice * i.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Discount code */}
        <div className="mb-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
          <p className="mb-2 flex items-center gap-1.5 text-sm font-bold text-white">
            <Tag className="h-4 w-4 text-sky-400" /> کد تخفیف
          </p>
          {discount ? (
            <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
              <span>کد «{discount.code}» ({toPersianDigits(discount.percent)}٪ تخفیف) فعال شد</span>
              <button onClick={() => setDiscount(null)}>
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="مثلا WELCOME10"
                value={discountInput}
                onChange={(e) => setDiscountInput(e.target.value)}
              />
              <Button variant="outline" loading={checkingDiscount} onClick={applyDiscount}>
                اعمال
              </Button>
            </div>
          )}
        </div>

        {/* Wallet balance */}
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-sky-400" />
            <span className="text-sm text-slate-300">موجودی کیف پول</span>
          </div>
          <span className="text-sm font-bold text-white">
            {balance === null ? "..." : formatToman(balance)}
          </span>
        </div>

        {/* Payment method */}
        <div className="mb-4 rounded-2xl border border-sky-500/30 bg-sky-500/10 p-4">
          <p className="mb-1 text-sm font-bold text-white">روش پرداخت</p>
          <p className="text-xs text-slate-400">کسر از کیف پول TeleShop</p>
        </div>

        {/* Totals */}
        <div className="mb-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
          <div className="flex justify-between py-1 text-xs text-slate-400">
            <span>جمع جزء</span>
            <span className="text-slate-200">{formatToman(subtotal)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between py-1 text-xs text-emerald-400">
              <span>تخفیف</span>
              <span>-{formatToman(discountAmount)}</span>
            </div>
          )}
          <div className="mt-2 flex justify-between border-t border-white/10 pt-2 text-base font-extrabold">
            <span className="text-white">مبلغ قابل پرداخت</span>
            <span className="text-sky-400">{formatToman(total)}</span>
          </div>
        </div>

        {/* Security info */}
        <div className="flex items-start gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 text-[11px] text-slate-400">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
          <span>پرداخت شما از طریق کیف پول داخلی TeleShop و کاملا امن انجام می‌شود. اطلاعات مالی شما ذخیره نمی‌شود.</span>
        </div>

        {insufficientBalance && (
          <p className="mt-3 text-center text-xs text-red-400">
            موجودی کیف پول کافی نیست. لطفا ابتدا کیف پول خود را شارژ کنید.
          </p>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#0a0e14]/95 p-4 backdrop-blur-xl pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-lg">
          {insufficientBalance ? (
            <Link href="/profile/wallet">
              <Button size="lg" fullWidth>افزایش موجودی کیف پول</Button>
            </Link>
          ) : (
            <Button size="lg" fullWidth loading={paying} onClick={handlePay}>
              پرداخت و ثبت سفارش
            </Button>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
