import { PageContainer } from "@/components/layout/PageContainer";
import { getGiftById } from "@/lib/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { GiftDetailClient } from "./GiftDetailClient";

export const dynamic = "force-dynamic";

export default async function GiftDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gift = await getGiftById(Number(id));
  if (!gift) notFound();

  return (
    <PageContainer noPadBottom>
      <div className="mb-4 flex items-center gap-2">
        <Link href="/gifts" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
          <ChevronRight className="h-4 w-4 text-slate-300" />
        </Link>
        <h1 className="text-base font-bold text-white">جزئیات هدیه</h1>
      </div>
      <GiftDetailClient gift={{ ...gift, price: String(gift.price) }} />
    </PageContainer>
  );
}
