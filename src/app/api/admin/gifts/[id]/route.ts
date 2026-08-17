import { db } from "@/db";
import { gifts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const update: Record<string, unknown> = {};
  for (const key of ["name", "description", "icon", "rarity", "isActive"]) {
    if (key in body) update[key] = body[key];
  }
  if ("price" in body) update.price = String(body.price);
  if ("stock" in body) update.stock = Number(body.stock);

  const [row] = await db.update(gifts).set(update).where(eq(gifts.id, Number(id))).returning();
  return Response.json(row);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.delete(gifts).where(eq(gifts.id, Number(id)));
  return Response.json({ ok: true });
}
