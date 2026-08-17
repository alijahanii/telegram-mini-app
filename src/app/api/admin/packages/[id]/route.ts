import { db } from "@/db";
import { adPackages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const update: Record<string, unknown> = {};
  if ("price" in body) update.price = String(body.price);
  if ("label" in body) update.label = body.label;
  if ("isActive" in body) update.isActive = body.isActive;

  const [row] = await db.update(adPackages).set(update).where(eq(adPackages.id, Number(id))).returning();
  return Response.json(row);
}
