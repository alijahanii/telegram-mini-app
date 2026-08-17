import { db } from "@/db";
import { orders, orderItems, transactions, users, discountCodes, products, gifts } from "@/db/schema";
import { getCurrentUser } from "@/lib/current-user";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

interface CheckoutItem {
  itemType: "product" | "gift";
  refId: number;
  title: string;
  icon?: string;
  unitPrice: number;
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items: CheckoutItem[] = body.items ?? [];
    const discountCode: string | undefined = body.discountCode;

    if (!items.length) {
      return Response.json({ error: "سبد خرید خالی است" }, { status: 400 });
    }

    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "کاربر یافت نشد" }, { status: 401 });

    const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    let discountAmount = 0;

    if (discountCode) {
      const [code] = await db
        .select()
        .from(discountCodes)
        .where(eq(discountCodes.code, discountCode.trim().toUpperCase()));
      if (
        code &&
        code.isActive &&
        code.usedCount < code.maxUses &&
        (!code.expiresAt || new Date(code.expiresAt) > new Date())
      ) {
        discountAmount = Math.round((subtotal * code.percent) / 100);
        await db
          .update(discountCodes)
          .set({ usedCount: code.usedCount + 1 })
          .where(eq(discountCodes.id, code.id));
      } else {
        return Response.json({ error: "کد تخفیف نامعتبر یا منقضی شده است" }, { status: 400 });
      }
    }

    const total = subtotal - discountAmount;
    const balance = Number(user.walletBalance);
    if (balance < total) {
      return Response.json({ error: "موجودی کیف پول کافی نیست" }, { status: 400 });
    }

    // Validate stock
    for (const item of items) {
      if (item.itemType === "product") {
        const [p] = await db.select().from(products).where(eq(products.id, item.refId));
        if (!p || p.stock < item.quantity) {
          return Response.json({ error: `موجودی «${item.title}» کافی نیست` }, { status: 400 });
        }
      } else {
        const [g] = await db.select().from(gifts).where(eq(gifts.id, item.refId));
        if (!g || g.stock < item.quantity) {
          return Response.json({ error: `موجودی «${item.title}» کافی نیست` }, { status: 400 });
        }
      }
    }

    const orderType = items.every((i) => i.itemType === "gift") ? "gift" : "service";

    const [order] = await db
      .insert(orders)
      .values({
        userId: user.id,
        type: orderType,
        status: "pending",
        totalAmount: String(total),
        discountAmount: String(discountAmount),
        paymentMethod: "wallet",
      })
      .returning();

    for (const item of items) {
      await db.insert(orderItems).values({
        orderId: order.id,
        itemType: item.itemType,
        refId: item.refId,
        title: item.title,
        icon: item.icon ?? null,
        unitPrice: String(item.unitPrice),
        quantity: item.quantity,
      });

      if (item.itemType === "product") {
        const [p] = await db.select().from(products).where(eq(products.id, item.refId));
        if (p) {
          await db
            .update(products)
            .set({ stock: p.stock - item.quantity })
            .where(eq(products.id, item.refId));
        }
      } else {
        const [g] = await db.select().from(gifts).where(eq(gifts.id, item.refId));
        if (g) {
          await db
            .update(gifts)
            .set({ stock: g.stock - item.quantity })
            .where(eq(gifts.id, item.refId));
        }
      }
    }

    await db
      .update(users)
      .set({ walletBalance: String(balance - total) })
      .where(eq(users.id, user.id));

    await db.insert(transactions).values({
      userId: user.id,
      type: "purchase",
      amount: String(-total),
      status: "completed",
      description: `پرداخت سفارش #${order.id}`,
    });

    return Response.json({ orderId: order.id });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "خطا در ثبت سفارش" }, { status: 500 });
  }
}
