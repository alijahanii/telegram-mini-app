import { ChannelDTO } from "@/lib/types";
import { formatCompactNumber, toPersianDigits } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Users, Eye, TrendingUp } from "lucide-react";

export function ChannelCard({ channel }: { channel: ChannelDTO }) {
  return (
    <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.04] p-4 backdrop-blur-xl">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2AABEE]/30 to-[#5B6FEE]/30 text-2xl">
          📢
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-white">{channel.name}</p>
          <p className="truncate text-xs text-slate-400">{channel.username}</p>
        </div>
        <Badge tone="blue">{channel.category}</Badge>
      </div>

      <div className="mb-3 grid grid-cols-3 gap-2 rounded-2xl bg-white/[0.03] p-2.5 text-center">
        <div>
          <div className="mb-1 flex items-center justify-center gap-1 text-slate-400">
            <Users className="h-3 w-3" />
          </div>
          <p className="text-xs font-bold text-white">{formatCompactNumber(channel.membersCount)}</p>
          <p className="text-[10px] text-slate-500">عضو</p>
        </div>
        <div className="border-x border-white/[0.06]">
          <div className="mb-1 flex items-center justify-center gap-1 text-slate-400">
            <Eye className="h-3 w-3" />
          </div>
          <p className="text-xs font-bold text-white">{formatCompactNumber(channel.avgViews)}</p>
          <p className="text-[10px] text-slate-500">بازدید</p>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-center gap-1 text-emerald-400">
            <TrendingUp className="h-3 w-3" />
          </div>
          <p className="text-xs font-bold text-emerald-400">{toPersianDigits(channel.engagement)}٪</p>
          <p className="text-[10px] text-slate-500">تعامل</p>
        </div>
      </div>

      <Link href={`/ads/${channel.id}`}>
        <Button size="sm" fullWidth variant="outline">
          مشاهده تعرفه
        </Button>
      </Link>
    </div>
  );
}
