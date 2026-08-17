import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const update: Record<string, unknown> = {};
  if ("role" in body) update.role = body.role;
  if ("walletBalance" in body) update.walletBalance = String(body.walletBalance);

  const [row] = await db.update(users).set(update).where(eq(users.id, Number(id))).returning();
  return Response.json(row);
}
