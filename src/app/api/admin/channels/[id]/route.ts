import { db } from "@/db";
import { channels } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const update: Record<string, unknown> = {};
  for (const key of ["name", "username", "category", "description", "isActive"]) {
    if (key in body) update[key] = body[key];
  }
  if ("membersCount" in body) update.membersCount = Number(body.membersCount);
  if ("avgViews" in body) update.avgViews = Number(body.avgViews);
  if ("engagement" in body) update.engagement = String(body.engagement);

  const [row] = await db.update(channels).set(update).where(eq(channels.id, Number(id))).returning();
  return Response.json(row);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.delete(channels).where(eq(channels.id, Number(id)));
  return Response.json({ ok: true });
}
