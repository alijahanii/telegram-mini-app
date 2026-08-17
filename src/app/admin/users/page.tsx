import { listAllUsers } from "@/lib/queries";
import { UsersClient } from "./UsersClient";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await listAllUsers();
  const serialized = users.map((u) => ({
    ...u,
    walletBalance: String(u.walletBalance),
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <div>
      <h1 className="mb-1 text-xl font-extrabold text-white">مدیریت کاربران</h1>
      <p className="mb-6 text-sm text-slate-400">مشاهده و مدیریت حساب‌های کاربری فروشگاه</p>
      <UsersClient users={serialized as never} />
    </div>
  );
}
