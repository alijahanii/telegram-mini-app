import { GiftDTO, Rarity, RARITY_META } from "@/lib/types";
import { formatToman, toPersianDigits } from "@/lib/format";
import Link from "next/link";
import { cn } from "@/lib/format";

export function GiftCard({ gift }: { gift: GiftDTO }) {
  const rarity = RARITY_META[gift.rarity as Rarity] ?? RARITY_META.common;
  return (
    <Link
      href={`/gifts/${gift.id}`}
      className="group relative flex flex-col overflow-hidden rounded-[20px] border border-white/[0.06] bg-white/[0.04] backdrop-blur-xl transition-transform active:scale-[0.97]"
    >
      <div className={cn("flex h-32 items-center justify-center bg-gradient-to-br text-6xl", rarity.color, "opacity-90")}>
        <span className="drop-shadow-[0_6px_16px_rgba(0,0,0,0.4)]">{gift.icon}</span>
      </div>
      <div className="absolute right-2 top-2">
        <span className={cn("rounded-full bg-gradient-to-l px-2.5 py-1 text-[10px] font-bold text-white shadow", rarity.color)}>
          {rarity.label}
        </span>
      </div>
      <div className="p-3">
        <p className="mb-1 truncate text-sm font-bold text-white">{gift.name}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-extrabold text-sky-400">{formatToman(gift.price)}</span>
          <span className="text-[10px] text-slate-400">{toPersianDigits(gift.stock)} عدد</span>
        </div>
      </div>
    </Link>
  );
}
