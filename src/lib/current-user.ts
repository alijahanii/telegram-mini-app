import { cookies } from "next/headers";
import { createHmac } from "crypto";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const DEMO_TELEGRAM_ID = "111111";
const DEMO_ADMIN_TELEGRAM_ID = "999999";
const COOKIE_NAME = "teleshop_tg_init_data";
const MAX_AGE_SECONDS = 60 * 60 * 24;

function getVerifiedTelegramId(initData: string, botToken: string): string | null {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  const userRaw = params.get("user");
  const authDate = Number(params.get("auth_date"));
  if (!hash || !userRaw || !Number.isFinite(authDate)) return null;
  if (Math.floor(Date.now() / 1000) - authDate > MAX_AGE_SECONDS) return null;

  params.delete("hash");
  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
  const secretKey = createHmac("sha256", "WebAppData").update(botToken).digest();
  const calculatedHash = createHmac("sha256", secretKey).update(dataCheckString).digest("hex");
  if (calculatedHash !== hash) return null;

  try {
    const user = JSON.parse(userRaw) as { id?: number };
    return user.id ? String(user.id) : null;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const cookie = (await cookies()).get(COOKIE_NAME)?.value;

  if (botToken && cookie) {
    const telegramId = getVerifiedTelegramId(cookie, botToken);
    if (telegramId) {
      const [user] = await db.select().from(users).where(eq(users.telegramId, telegramId)).limit(1);
      if (user) return user;
    }
  }

  // Keeps local/browser preview working before the Mini App is opened from Telegram.
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.telegramId, DEMO_TELEGRAM_ID))
    .limit(1);
  return user ?? null;
}

export async function getCurrentAdmin() {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.telegramId, DEMO_ADMIN_TELEGRAM_ID))
    .limit(1);
  return user ?? null;
}
