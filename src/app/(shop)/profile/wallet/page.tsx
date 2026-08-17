import { PageContainer } from "@/components/layout/PageContainer";
import { getCurrentUser } from "@/lib/current-user";
import { listTransactionsForUser } from "@/lib/queries";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { WalletClient } from "./WalletClient";

export const dynamic = "force-dynamic";

export default async function WalletPage() {
  const user = await getCurrentUser();
  const transactions = user ? await listTransactionsForUser(user.id) : [];
  const serialized = transactions.map((t) => ({
    ...t,
    amount: String(t.amount),
    createdAt: t.createdAt.toISOString(),
  }));

  return (
    <PageContainer>
      <div className="mb-4 flex items-center gap-2">
        <Link href="/profile" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
          <ChevronRight className="h-4 w-4 text-slate-300" />
        </Link>
        <h1 className="text-base font-bold text-white">کیف پول</h1>
      </div>

      <WalletClient
        initialBalance={String(user?.walletBalance ?? 0)}
        transactions={serialized as never}
      />
    </PageContainer>
  );
}
