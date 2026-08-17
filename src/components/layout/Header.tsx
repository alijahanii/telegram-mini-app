import Link from "next/link";
import { Bell } from "lucide-react";
import { UserDTO } from "@/lib/types";

function initials(name: string) {
  return name.trim().slice(0, 1);
}

export function Header({ user }: { user: UserDTO | null }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0a0e14]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2AABEE] to-[#5B6FEE] text-lg font-bold text-white shadow-[0_6px_18px_-4px_rgba(43,150,238,0.7)]">
            T
          </span>
          <span>
            <span className="block text-sm font-extrabold leading-none text-white">TeleShop</span>
            <span className="block text-[10px] leading-none text-slate-400 mt-1">فروشگاه خدمات تلگرام</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-3 pr-1 active:scale-95"
          >
            <span className="text-right leading-tight">
              <span className="block text-xs font-semibold text-white">{user?.firstName ?? "کاربر مهمان"}</span>
              <span className="block text-[10px] text-slate-400">@{user?.username ?? "guest"}</span>
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-sky-500 text-xs font-bold text-white">
              {initials(user?.firstName ?? "م")}
            </span>
          </Link>
          <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] active:scale-95">
            <Bell className="h-[18px] w-[18px] text-slate-300" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
          </button>
        </div>
      </div>
    </header>
  );
}
