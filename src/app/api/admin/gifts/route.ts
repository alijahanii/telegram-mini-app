import { db } from "@/db";
import { gifts } from "@/db/schema";
import { listAllGiftsAdmin } from "@/lib/admin-queries";
import { NextRequest } from "next/server";

export async function GET() {
  const rows = await listAllGiftsAdmin();
  return Response.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const [row] = await db
    .insert(gifts)
    .values({
      name: body.name,
      description: body.description ?? "",
      icon: body.icon || "🎁",
      rarity: body.rarity || "common",
      price: String(body.price ?? 0),
      stock: Number(body.stock ?? 0),
      isActive: body.isActive ?? true,
    })
    .returning();
  return Response.json(row);
}
