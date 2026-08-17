import { getCurrentUser } from "@/lib/current-user";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "not found" }, { status: 404 });
  return Response.json({ balance: String(user.walletBalance) });
}
