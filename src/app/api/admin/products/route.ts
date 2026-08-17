import { db } from "@/db";
import { products } from "@/db/schema";
import { listAllProductsAdmin } from "@/lib/admin-queries";
import { NextRequest } from "next/server";

export async function GET() {
  const rows = await listAllProductsAdmin();
  return Response.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const [row] = await db
    .insert(products)
    .values({
      category: body.category,
      title: body.title,
      description: body.description ?? "",
      icon: body.icon || "⭐",
      price: String(body.price ?? 0),
      stock: Number(body.stock ?? 0),
      unit: body.unit || "عدد",
      badge: body.badge || null,
      isActive: body.isActive ?? true,
      isPopular: body.isPopular ?? false,
    })
    .returning();
  return Response.json(row);
}
