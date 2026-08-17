import { listAllProductsAdmin, listAllGiftsAdmin, listAllChannelsAdmin } from "@/lib/admin-queries";
import { PricesAdminClient } from "./PricesAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPricesPage() {
  const [products, gifts, channels] = await Promise.all([
    listAllProductsAdmin(),
    listAllGiftsAdmin(),
    listAllChannelsAdmin(),
  ]);

  return (
    <div>
      <h1 className="mb-1 text-xl font-extrabold text-white">مدیریت قیمت‌ها</h1>
      <p className="mb-6 text-sm text-slate-400">تغییر سریع قیمت محصولات، Giftها و بسته‌های تبلیغاتی</p>
      <PricesAdminClient
        products={products.map((p) => ({ id: p.id, title: p.title, icon: p.icon, price: String(p.price) }))}
        gifts={gifts.map((g) => ({ id: g.id, name: g.name, icon: g.icon, price: String(g.price) }))}
        channels={channels.map((c) => ({
          id: c.id,
          name: c.name,
          packages: c.packages.map((p) => ({ id: p.id, label: p.label, price: String(p.price) })),
        }))}
      />
    </div>
  );
}
