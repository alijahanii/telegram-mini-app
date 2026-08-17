import { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNav, CartFab } from "@/components/layout/BottomNav";
import { getCurrentUser } from "@/lib/current-user";

export const dynamic = "force-dynamic";

export default async function ShopLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  const userDto = user
    ? {
        ...user,
        walletBalance: String(user.walletBalance),
        createdAt: user.createdAt.toISOString(),
      }
    : null;

  return (
    <div className="min-h-dvh">
      <Header user={userDto} />
      {children}
      <CartFab />
      <BottomNav />
    </div>
  );
}
