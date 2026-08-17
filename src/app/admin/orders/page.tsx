import { listAllOrdersAdmin } from "@/lib/admin-queries";
import { OrdersAdminClient } from "./OrdersAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await listAllOrdersAdmin();
  const serialized = orders.map((o) => ({
    ...o,
    totalAmount: String(o.totalAmount),
    discountAmount: String(o.discountAmount),
    createdAt: o.createdAt.toISOString(),
  }));

  return (
    <div>
      <h1 className="mb-1 text-xl font-extrabold text-white">مدیریت سفارش‌ها</h1>
      <p className="mb-6 text-sm text-slate-400">مشاهده، تایید یا رد سفارش‌های ثبت‌شده</p>
      <OrdersAdminClient orders={serialized as never} />
    </div>
  );
}
