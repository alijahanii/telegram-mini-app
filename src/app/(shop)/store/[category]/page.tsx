import { PageContainer } from "@/components/layout/PageContainer";
import { listProducts } from "@/lib/queries";
import { CATEGORY_META } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const meta = CATEGORY_META[category] ?? { label: category, icon: "🛍" };
  const products = await listProducts(category);
  const serialized = products.map((p) => ({ ...p, price: String(p.price) }));

  return (
    <PageContainer>
      <div className="mb-4 flex items-center gap-2">
        <Link href="/store" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
          <ChevronRight className="h-4 w-4 text-slate-300" />
        </Link>
        <h1 className="text-lg font-extrabold text-white">
          {meta.icon} {meta.label}
        </h1>
      </div>

      {serialized.length === 0 ? (
        <EmptyState title="محصولی یافت نشد" description="به زودی محصولات جدید اضافه خواهد شد" />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {serialized.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
