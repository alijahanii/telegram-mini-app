"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChannelDTO, AdPackageDTO } from "@/lib/types";
import { Label, Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { formatToman } from "@/lib/format";
import { toast } from "sonner";
import { ImagePlus, Calendar } from "lucide-react";

export function AdOrderForm({
  channels,
  initialChannelId,
  initialPackages,
}: {
  channels: ChannelDTO[];
  initialChannelId: number;
  initialPackages: AdPackageDTO[];
}) {
  const router = useRouter();
  const [channelId, setChannelId] = useState(initialChannelId);
  const [packages, setPackages] = useState<AdPackageDTO[]>(initialPackages);
  const [packageId, setPackageId] = useState<number | "">(initialPackages[0]?.id ?? "");
  const [adText, setAdText] = useState("");
  const [destinationLink, setDestinationLink] = useState("");
  const [fileName, setFileName] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPkgs, setLoadingPkgs] = useState(false);

  const selectedPackage = useMemo(
    () => packages.find((p) => p.id === packageId),
    [packages, packageId],
  );
  const selectedChannel = useMemo(
    () => channels.find((c) => c.id === channelId),
    [channels, channelId],
  );

  async function handleChannelChange(id: number) {
    setChannelId(id);
    setLoadingPkgs(true);
    try {
      const res = await fetch(`/api/channels/${id}`);
      const data = await res.json();
      setPackages(data.packages);
      setPackageId(data.packages[0]?.id ?? "");
    } finally {
      setLoadingPkgs(false);
    }
  }

  async function handleSubmit() {
    if (!packageId) {
      toast.error("لطفا یک بسته تبلیغاتی انتخاب کنید");
      return;
    }
    if (!adText.trim()) {
      toast.error("متن تبلیغ را وارد کنید");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/ads/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelId,
          packageId,
          adText,
          destinationLink,
          mediaUrl: fileName || null,
          scheduledAt: scheduledAt || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "خطا در ثبت سفارش");
        return;
      }
      toast.success("سفارش تبلیغ با موفقیت ثبت شد");
      router.push(`/orders/${data.orderId}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pb-[calc(120px+env(safe-area-inset-bottom))]">
      <div className="mb-4">
        <Label>انتخاب کانال</Label>
        <Select value={channelId} onChange={(e) => handleChannelChange(Number(e.target.value))}>
          {channels.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.username})
            </option>
          ))}
        </Select>
      </div>

      <div className="mb-4">
        <Label>انتخاب بسته تبلیغاتی</Label>
        {loadingPkgs ? (
          <div className="h-12 animate-pulse rounded-2xl bg-white/[0.06]" />
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {packages.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPackageId(p.id)}
                className={`flex items-center justify-between rounded-2xl border p-3 text-sm transition ${
                  packageId === p.id
                    ? "border-sky-500/60 bg-sky-500/10"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                <span className="font-medium text-white">{p.label}</span>
                <span className="font-bold text-sky-400">{formatToman(p.price)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mb-4">
        <Label>متن تبلیغ</Label>
        <Textarea
          rows={4}
          placeholder="متن آگهی خود را اینجا بنویسید..."
          value={adText}
          onChange={(e) => setAdText(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <Label>لینک مقصد</Label>
        <Input
          type="url"
          placeholder="https://t.me/yourchannel"
          value={destinationLink}
          onChange={(e) => setDestinationLink(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <Label>تصویر یا ویدیوی تبلیغ</Label>
        <label className="flex h-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] text-slate-400">
          <ImagePlus className="h-5 w-5" />
          <span className="text-xs">{fileName || "برای آپلود ضربه بزنید"}</span>
          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
          />
        </label>
      </div>

      <div className="mb-4">
        <Label>زمان‌بندی انتشار</Label>
        <div className="relative">
          <Input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="pl-10"
          />
          <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
        <p className="mb-3 text-sm font-bold text-white">خلاصه سفارش</p>
        <div className="flex justify-between py-1 text-xs text-slate-400">
          <span>کانال</span>
          <span className="text-slate-200">{selectedChannel?.name}</span>
        </div>
        <div className="flex justify-between py-1 text-xs text-slate-400">
          <span>بسته</span>
          <span className="text-slate-200">{selectedPackage?.label ?? "-"}</span>
        </div>
        <div className="mt-2 flex justify-between border-t border-white/10 pt-2 text-sm font-bold">
          <span className="text-slate-300">مبلغ نهایی</span>
          <span className="text-sky-400">{formatToman(selectedPackage?.price ?? 0)}</span>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#0a0e14]/95 p-4 backdrop-blur-xl pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-lg">
          <Button size="lg" fullWidth loading={loading} onClick={handleSubmit}>
            ادامه پرداخت
          </Button>
        </div>
      </div>
    </div>
  );
}
