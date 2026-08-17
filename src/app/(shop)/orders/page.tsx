import { PageContainer } from "@/components/layout/PageContainer";
import { getCurrentUser } from "@/lib/current-user";
import { listOrdersForUser } from "@/lib/queries";
import { OrdersClient } from "./OrdersClient";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const user = await getCurrentUser();
  const orders = user ? await listOrdersForUser(user.id) : [];
  const serialized = orders.map((o) => ({
    ...o,
    totalAmount: String(o.totalAmount),
    discountAmount: String(o.discountAmount),
    createdAt: o.createdAt.toISOString(),
  }));

  return (
    <PageContainer>
      <h1 className="mb-4 text-lg font-extrabold text-white">سفارش‌های من</h1>
      <OrdersClient orders={serialized as never} />
    </PageContainer>
  );
}
