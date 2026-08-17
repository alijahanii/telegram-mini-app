import { db } from "@/db";
import { users, transactions } from "@/db/schema";
import { getCurrentUser } from "@/lib/current-user";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

// Payment abstraction: in this demo build, wallet top-ups are recorded
// directly. Swap the body of this handler with a real payment gateway
// callback (e.g. Zarinpal / Stripe) verification before crediting balance.
export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json();
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      return Response.json({ error: "مبلغ نامعتبر است" }, { status: 400 });
    }

    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "کاربر یافت نشد" }, { status: 401 });

    const newBalance = Number(user.walletBalance) + numericAmount;
    await db.update(users).set({ walletBalance: String(newBalance) }).where(eq(users.id, user.id));

    await db.insert(transactions).values({
      userId: user.id,
      type: "deposit",
      amount: String(numericAmount),
      status: "completed",
      description: "افزایش موجودی کیف پول",
    });

    return Response.json({ balance: newBalance });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "خطا در افزایش موجودی" }, { status: 500 });
  }
}
