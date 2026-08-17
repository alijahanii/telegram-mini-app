import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHmac } from "crypto";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const COOKIE_NAME = "teleshop_tg_init_data";
const MAX_AGE_SECONDS = 60 * 60 * 24; // Telegram initData should be refreshed daily.

function validateInitData(initData: string, botToken: string) {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;

  params.delete("hash");
  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = createHmac("sha256", "WebAppData").update(botToken).digest();
  const calculatedHash = createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  if (calculatedHash !== hash) return null;

  const authDate = Number(params.get("auth_date"));
  if (!Number.isFinite(authDate) || Math.floor(Date.now() / 1000) - authDate > MAX_AGE_SECONDS) {
    return null;
  }

  const userRaw = params.get("user");
  if (!userRaw) return null;

  try {
    return JSON.parse(userRaw) as {
      id: number;
      first_name?: string;
      last_name?: string;
      username?: string;
      photo_url?: string;
    };
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return NextResponse.json(
      { ok: false, error: "TELEGRAM_BOT_TOKEN is not configured" },
      { status: 500 }
    );
  }

  const body = (await request.json().catch(() => null)) as { initData?: string } | null;
  if (!body?.initData) {
    return NextResponse.json({ ok: false, error: "initData is required" }, { status: 400 });
  }

  const telegramUser = validateInitData(body.initData, botToken);
  if (!telegramUser) {
    return NextResponse.json({ ok: false, error: "Invalid Telegram initData" }, { status: 401 });
  }

  await db
    .insert(users)
    .values({
      telegramId: String(telegramUser.id),
      username: telegramUser.username ?? null,
      firstName: telegramUser.first_name ?? "کاربر",
      lastName: telegramUser.last_name ?? null,
      avatarUrl: telegramUser.photo_url ?? null,
    })
    .onConflictDoUpdate({
      target: users.telegramId,
      set: {
        username: telegramUser.username ?? null,
        firstName: telegramUser.first_name ?? "کاربر",
        lastName: telegramUser.last_name ?? null,
        avatarUrl: telegramUser.photo_url ?? null,
      },
    });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, body.initData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE_SECONDS,
    path: "/",
  });

  return NextResponse.json({
    ok: true,
    user: {
      id: telegramUser.id,
      firstName: telegramUser.first_name ?? "کاربر",
      username: telegramUser.username ?? null,
    },
  });
}
