import { listAllProductsAdmin, listAllGiftsAdmin } from "@/lib/admin-queries";
import { InventoryAdminClient } from "./InventoryAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const [products, gifts] = await Promise.all([listAllProductsAdmin(), listAllGiftsAdmin()]);

  return (
    <div>
      <h1 className="mb-1 text-xl font-extrabold text-white">مدیریت موجودی</h1>
      <p className="mb-6 text-sm text-slate-400">مشاهده و بروزرسانی سریع موجودی انبار محصولات و Giftها</p>
      <InventoryAdminClient
        products={products.map((p) => ({ id: p.id, title: p.title, icon: p.icon, stock: p.stock }))}
        gifts={gifts.map((g) => ({ id: g.id, name: g.name, icon: g.icon, stock: g.stock }))}
      />
    </div>
  );
}
