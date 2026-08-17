import { db } from "@/db";
import { orders, orderItems, adOrders, adPackages, channels, transactions, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/current-user";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { channelId, packageId, adText, destinationLink, mediaUrl, scheduledAt } = body;

    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "کاربر یافت نشد" }, { status: 401 });

    const [pkg] = await db.select().from(adPackages).where(eq(adPackages.id, Number(packageId)));
    if (!pkg) return Response.json({ error: "بسته تبلیغاتی نامعتبر است" }, { status: 400 });

    const [channel] = await db.select().from(channels).where(eq(channels.id, Number(channelId)));
    if (!channel) return Response.json({ error: "کانال یافت نشد" }, { status: 400 });

    const price = Number(pkg.price);
    const balance = Number(user.walletBalance);
    if (balance < price) {
      return Response.json({ error: "موجودی کیف پول کافی نیست" }, { status: 400 });
    }

    const [order] = await db
      .insert(orders)
      .values({
        userId: user.id,
        type: "ad",
        status: "pending",
        totalAmount: String(price),
        paymentMethod: "wallet",
        note: `تبلیغ در کانال ${channel.name}`,
      })
      .returning();

    await db.insert(orderItems).values({
      orderId: order.id,
      itemType: "ad",
      refId: channel.id,
      title: `${pkg.label} - ${channel.name}`,
      icon: "📢",
      unitPrice: String(price),
      quantity: 1,
    });

    await db.insert(adOrders).values({
      orderId: order.id,
      channelId: channel.id,
      packageId: pkg.id,
      adText: adText ?? "",
      destinationLink: destinationLink ?? null,
      mediaUrl: mediaUrl ?? null,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
    });

    await db
      .update(users)
      .set({ walletBalance: String(balance - price) })
      .where(eq(users.id, user.id));

    await db.insert(transactions).values({
      userId: user.id,
      type: "purchase",
      amount: String(-price),
      status: "completed",
      description: `ثبت سفارش تبلیغ - ${channel.name}`,
    });

    return Response.json({ orderId: order.id });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "خطا در ثبت سفارش" }, { status: 500 });
  }
}
