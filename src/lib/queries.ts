import { db } from "@/db";
import {
  channels,
  adPackages,
  products,
  gifts,
  orders,
  orderItems,
  transactions,
  discountCodes,
  users,
} from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function listChannels() {
  return db.select().from(channels).where(eq(channels.isActive, true)).orderBy(desc(channels.membersCount));
}

export async function getChannelById(id: number) {
  const [channel] = await db.select().from(channels).where(eq(channels.id, id));
  if (!channel) return null;
  const packages = await db
    .select()
    .from(adPackages)
    .where(eq(adPackages.channelId, id));
  return { channel, packages };
}

export async function listProducts(category?: string) {
  const all = await db.select().from(products).where(eq(products.isActive, true));
  if (category) return all.filter((p) => p.category === category);
  return all;
}

export async function listPopularProducts() {
  const all = await db.select().from(products).where(eq(products.isActive, true));
  return all.filter((p) => p.isPopular);
}

export async function getProductById(id: number) {
  const [product] = await db.select().from(products).where(eq(products.id, id));
  return product ?? null;
}

export async function listGifts() {
  return db.select().from(gifts).where(eq(gifts.isActive, true)).orderBy(desc(gifts.price));
}

export async function getGiftById(id: number) {
  const [gift] = await db.select().from(gifts).where(eq(gifts.id, id));
  return gift ?? null;
}

export async function listOrdersForUser(userId: number) {
  const rows = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
  return rows;
}

export async function getOrderDetail(orderId: number) {
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  return { order, items };
}

export async function listTransactionsForUser(userId: number) {
  return db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .orderBy(desc(transactions.createdAt));
}

export async function listDiscountCodes() {
  return db.select().from(discountCodes).orderBy(desc(discountCodes.createdAt));
}

export async function listAllUsers() {
  return db.select().from(users).orderBy(desc(users.createdAt));
}

export async function listAllOrders() {
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}
