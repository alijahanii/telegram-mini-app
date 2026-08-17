import { db } from "@/db";
import { discountCodes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { code } = await req.json();
  if (!code) return Response.json({ error: "کد تخفیف را وارد کنید" }, { status: 400 });

  const [record] = await db
    .select()
    .from(discountCodes)
    .where(eq(discountCodes.code, String(code).trim().toUpperCase()));

  if (
    !record ||
    !record.isActive ||
    record.usedCount >= record.maxUses ||
    (record.expiresAt && new Date(record.expiresAt) < new Date())
  ) {
    return Response.json({ error: "کد تخفیف نامعتبر یا منقضی شده است" }, { status: 400 });
  }

  return Response.json({ percent: record.percent, code: record.code });
}
