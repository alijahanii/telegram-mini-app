import { db } from "@/db";
import { discountCodes } from "@/db/schema";
import { listAllDiscountsAdmin } from "@/lib/admin-queries";
import { NextRequest } from "next/server";

export async function GET() {
  const rows = await listAllDiscountsAdmin();
  return Response.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const [row] = await db
    .insert(discountCodes)
    .values({
      code: String(body.code).toUpperCase(),
      percent: Number(body.percent ?? 10),
      maxUses: Number(body.maxUses ?? 100),
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      isActive: body.isActive ?? true,
    })
    .returning();
  return Response.json(row);
}
