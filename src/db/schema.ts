import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  telegramId: text("telegram_id").unique(),
  username: text("username"),
  firstName: text("first_name").notNull().default("کاربر"),
  lastName: text("last_name"),
  avatarUrl: text("avatar_url"),
  walletBalance: numeric("wallet_balance", { precision: 14, scale: 0 })
    .notNull()
    .default("0"),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const channels = pgTable("channels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  avatarUrl: text("avatar_url"),
  category: text("category").notNull().default("عمومی"),
  membersCount: integer("members_count").notNull().default(0),
  avgViews: integer("avg_views").notNull().default(0),
  engagement: numeric("engagement", { precision: 5, scale: 2 })
    .notNull()
    .default("0"),
  description: text("description").notNull().default(""),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const adPackages = pgTable("ad_packages", {
  id: serial("id").primaryKey(),
  channelId: integer("channel_id")
    .notNull()
    .references(() => channels.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  label: text("label").notNull(),
  price: numeric("price", { precision: 14, scale: 0 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  icon: text("icon").notNull().default("⭐"),
  imageUrl: text("image_url"),
  price: numeric("price", { precision: 14, scale: 0 }).notNull(),
  stock: integer("stock").notNull().default(0),
  unit: text("unit").notNull().default("عدد"),
  badge: text("badge"),
  isActive: boolean("is_active").notNull().default(true),
  isPopular: boolean("is_popular").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const gifts = pgTable("gifts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  imageUrl: text("image_url"),
  icon: text("icon").notNull().default("🎁"),
  rarity: text("rarity").notNull().default("common"),
  price: numeric("price", { precision: 14, scale: 0 }).notNull(),
  stock: integer("stock").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  status: text("status").notNull().default("pending"),
  totalAmount: numeric("total_amount", { precision: 14, scale: 0 }).notNull(),
  discountAmount: numeric("discount_amount", { precision: 14, scale: 0 })
    .notNull()
    .default("0"),
  paymentMethod: text("payment_method").notNull().default("wallet"),
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  itemType: text("item_type").notNull(),
  refId: integer("ref_id"),
  title: text("title").notNull(),
  imageUrl: text("image_url"),
  icon: text("icon"),
  unitPrice: numeric("unit_price", { precision: 14, scale: 0 }).notNull(),
  quantity: integer("quantity").notNull().default(1),
});

export const adOrders = pgTable("ad_orders", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  channelId: integer("channel_id")
    .notNull()
    .references(() => channels.id),
  packageId: integer("package_id")
    .notNull()
    .references(() => adPackages.id),
  adText: text("ad_text").notNull().default(""),
  destinationLink: text("destination_link"),
  mediaUrl: text("media_url"),
  scheduledAt: timestamp("scheduled_at"),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  amount: numeric("amount", { precision: 14, scale: 0 }).notNull(),
  status: text("status").notNull().default("completed"),
  description: text("description").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const discountCodes = pgTable("discount_codes", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  percent: integer("percent").notNull().default(10),
  maxUses: integer("max_uses").notNull().default(100),
  usedCount: integer("used_count").notNull().default(0),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
