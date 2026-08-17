import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const update: Record<string, unknown> = {};
  for (const key of ["category", "title", "description", "icon", "unit", "badge", "isActive", "isPopular"]) {
    if (key in body) update[key] = body[key];
  }
  if ("price" in body) update.price = String(body.price);
  if ("stock" in body) update.stock = Number(body.stock);

  const [row] = await db.update(products).set(update).where(eq(products.id, Number(id))).returning();
  return Response.json(row);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.delete(products).where(eq(products.id, Number(id)));
  return Response.json({ ok: true });
}
