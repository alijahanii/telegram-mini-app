import { db } from "@/db";
import {
  users,
  orders,
  products,
  gifts,
  channels,
  adPackages,
  adOrders,
  discountCodes,
  transactions,
} from "@/db/schema";
import { desc, gte, sql } from "drizzle-orm";

export async function listAdOrdersAdmin() {
  const rows = await db
    .select({
      orderId: orders.id,
      status: orders.status,
      totalAmount: orders.totalAmount,
      createdAt: orders.createdAt,
      adText: adOrders.adText,
      destinationLink: adOrders.destinationLink,
      mediaUrl: adOrders.mediaUrl,
      scheduledAt: adOrders.scheduledAt,
      channelName: channels.name,
      channelUsername: channels.username,
      packageLabel: adPackages.label,
      firstName: users.firstName,
      username: users.username,
    })
    .from(adOrders)
    .innerJoin(orders, sql`${adOrders.orderId} = ${orders.id}`)
    .innerJoin(channels, sql`${adOrders.channelId} = ${channels.id}`)
    .innerJoin(adPackages, sql`${adOrders.packageId} = ${adPackages.id}`)
    .innerJoin(users, sql`${orders.userId} = ${users.id}`)
    .orderBy(desc(orders.createdAt));
  return rows;
}

export async function listAllProductsAdmin() {
  return db.select().from(products).orderBy(desc(products.createdAt));
}

export async function listAllGiftsAdmin() {
  return db.select().from(gifts).orderBy(desc(gifts.createdAt));
}

export async function listAllChannelsAdmin() {
  const channelRows = await db.select().from(channels).orderBy(desc(channels.createdAt));
  const packageRows = await db.select().from(adPackages);
  return channelRows.map((c) => ({
    ...c,
    packages: packageRows.filter((p) => p.channelId === c.id),
  }));
}

export async function listAllDiscountsAdmin() {
  return db.select().from(discountCodes).orderBy(desc(discountCodes.createdAt));
}

export async function listAllTransactionsAdmin() {
  const rows = await db
    .select({
      id: transactions.id,
      userId: transactions.userId,
      type: transactions.type,
      amount: transactions.amount,
      status: transactions.status,
      description: transactions.description,
      createdAt: transactions.createdAt,
      firstName: users.firstName,
      username: users.username,
    })
    .from(transactions)
    .leftJoin(users, sql`${transactions.userId} = ${users.id}`)
    .orderBy(desc(transactions.createdAt));
  return rows;
}

export async function listAllOrdersAdmin() {
  const rows = await db
    .select({
      id: orders.id,
      userId: orders.userId,
      type: orders.type,
      status: orders.status,
      totalAmount: orders.totalAmount,
      discountAmount: orders.discountAmount,
      paymentMethod: orders.paymentMethod,
      note: orders.note,
      createdAt: orders.createdAt,
      firstName: users.firstName,
      username: users.username,
    })
    .from(orders)
    .leftJoin(users, sql`${orders.userId} = ${users.id}`)
    .orderBy(desc(orders.createdAt));
  return rows;
}

export async function getDashboardStats() {
  const [[userCount], [orderCount], [pendingCount], revenueRows, todayRows] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(users),
    db.select({ count: sql<number>`count(*)::int` }).from(orders),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(orders)
      .where(sql`${orders.status} = 'pending'`),
    db
      .select({ total: sql<string>`coalesce(sum(${orders.totalAmount}), 0)` })
      .from(orders)
      .where(sql`${orders.status} != 'cancelled'`),
    db
      .select({ total: sql<string>`coalesce(sum(${orders.totalAmount}), 0)` })
      .from(orders)
      .where(gte(orders.createdAt, sql`date_trunc('day', now())`)),
  ]);

  const last7Days = await db
    .select({
      day: sql<string>`to_char(${orders.createdAt}, 'YYYY-MM-DD')`,
      total: sql<string>`coalesce(sum(${orders.totalAmount}), 0)`,
    })
    .from(orders)
    .where(sql`${orders.status} != 'cancelled' and ${orders.createdAt} >= now() - interval '7 days'`)
    .groupBy(sql`to_char(${orders.createdAt}, 'YYYY-MM-DD')`)
    .orderBy(sql`to_char(${orders.createdAt}, 'YYYY-MM-DD')`);

  return {
    totalUsers: userCount?.count ?? 0,
    totalOrders: orderCount?.count ?? 0,
    pendingOrders: pendingCount?.count ?? 0,
    revenue: revenueRows[0]?.total ?? "0",
    todaySales: todayRows[0]?.total ?? "0",
    last7Days,
  };
}
