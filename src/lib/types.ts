export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";
export type OrderType = "service" | "gift" | "ad";
export type Rarity = "common" | "rare" | "epic" | "legendary";

export interface UserDTO {
  id: number;
  telegramId: string | null;
  username: string | null;
  firstName: string;
  lastName: string | null;
  avatarUrl: string | null;
  walletBalance: string;
  role: string;
  createdAt: string;
}

export interface ChannelDTO {
  id: number;
  name: string;
  username: string;
  avatarUrl: string | null;
  category: string;
  membersCount: number;
  avgViews: number;
  engagement: string;
  description: string;
  isActive: boolean;
}

export interface AdPackageDTO {
  id: number;
  channelId: number;
  type: string;
  label: string;
  price: string;
  isActive: boolean;
}

export interface ProductDTO {
  id: number;
  category: string;
  title: string;
  description: string;
  icon: string;
  imageUrl: string | null;
  price: string;
  stock: number;
  unit: string;
  badge: string | null;
  isActive: boolean;
  isPopular: boolean;
}

export interface GiftDTO {
  id: number;
  name: string;
  description: string;
  imageUrl: string | null;
  icon: string;
  rarity: string;
  price: string;
  stock: number;
  isActive: boolean;
}

export interface OrderItemDTO {
  id: number;
  orderId: number;
  itemType: string;
  refId: number | null;
  title: string;
  imageUrl: string | null;
  icon: string | null;
  unitPrice: string;
  quantity: number;
}

export interface OrderDTO {
  id: number;
  userId: number;
  type: OrderType;
  status: OrderStatus;
  totalAmount: string;
  discountAmount: string;
  paymentMethod: string;
  note: string | null;
  createdAt: string;
  items?: OrderItemDTO[];
}

export interface TransactionDTO {
  id: number;
  userId: number;
  type: string;
  amount: string;
  status: string;
  description: string;
  createdAt: string;
}

export interface DiscountCodeDTO {
  id: number;
  code: string;
  percent: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

export const CATEGORY_META: Record<string, { label: string; icon: string }> = {
  premium: { label: "Premium", icon: "⭐" },
  stars: { label: "Stars", icon: "✨" },
  sticker: { label: "استیکر", icon: "🎨" },
  other: { label: "سایر خدمات", icon: "🛠" },
};

export const RARITY_META: Record<Rarity, { label: string; color: string }> = {
  common: { label: "معمولی", color: "from-slate-500 to-slate-400" },
  rare: { label: "کمیاب", color: "from-sky-500 to-blue-500" },
  epic: { label: "حماسی", color: "from-purple-500 to-fuchsia-500" },
  legendary: { label: "افسانه‌ای", color: "from-amber-400 to-orange-500" },
};

export const ORDER_STATUS_META: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: "در انتظار", className: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  processing: { label: "در حال انجام", className: "bg-sky-500/15 text-sky-400 border-sky-500/30" },
  completed: { label: "تکمیل شده", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  cancelled: { label: "لغو شده", className: "bg-red-500/15 text-red-400 border-red-500/30" },
};
