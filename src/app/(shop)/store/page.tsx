import { PageContainer } from "@/components/layout/PageContainer";
import { listProducts } from "@/lib/queries";
import { StoreClient } from "./StoreClient";

export const dynamic = "force-dynamic";

export default async function StorePage() {
  const products = await listProducts();
  const serialized = products.map((p) => ({ ...p, price: String(p.price) }));

  return (
    <PageContainer>
      <h1 className="mb-4 text-lg font-extrabold text-white">فروشگاه خدمات</h1>
      <StoreClient products={serialized} />
    </PageContainer>
  );
}
