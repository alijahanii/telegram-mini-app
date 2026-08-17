import { listAllProductsAdmin } from "@/lib/admin-queries";
import { ProductsAdminClient } from "./ProductsAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await listAllProductsAdmin();
  const serialized = products.map((p) => ({ ...p, price: String(p.price), createdAt: p.createdAt.toISOString() }));

  return (
    <div>
      <h1 className="mb-1 text-xl font-extrabold text-white">مدیریت محصولات</h1>
      <p className="mb-6 text-sm text-slate-400">افزودن، ویرایش و حذف محصولات فروشگاه خدمات</p>
      <ProductsAdminClient products={serialized as never} />
    </div>
  );
}
