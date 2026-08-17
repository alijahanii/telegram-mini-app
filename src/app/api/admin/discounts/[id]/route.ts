import { db } from "@/db";
import { discountCodes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const update: Record<string, unknown> = {};
  for (const key of ["code", "isActive"]) {
    if (key in body) update[key] = body[key];
  }
  if ("percent" in body) update.percent = Number(body.percent);
  if ("maxUses" in body) update.maxUses = Number(body.maxUses);

  const [row] = await db.update(discountCodes).set(update).where(eq(discountCodes.id, Number(id))).returning();
  return Response.json(row);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.delete(discountCodes).where(eq(discountCodes.id, Number(id)));
  return Response.json({ ok: true });
}
