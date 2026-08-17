import { db } from "@/db";
import { channels, adPackages } from "@/db/schema";
import { listAllChannelsAdmin } from "@/lib/admin-queries";
import { NextRequest } from "next/server";

const DEFAULT_PACKAGES = [
  { type: "1h", label: "تبلیغ ۱ ساعته", price: 150000 },
  { type: "6h", label: "تبلیغ ۶ ساعته", price: 450000 },
  { type: "12h", label: "تبلیغ ۱۲ ساعته", price: 750000 },
  { type: "24h", label: "تبلیغ ۲۴ ساعته", price: 1200000 },
  { type: "pin", label: "پین تبلیغ (بالای کانال)", price: 2200000 },
];

export async function GET() {
  const rows = await listAllChannelsAdmin();
  return Response.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const [channel] = await db
    .insert(channels)
    .values({
      name: body.name,
      username: body.username,
      category: body.category || "عمومی",
      membersCount: Number(body.membersCount ?? 0),
      avgViews: Number(body.avgViews ?? 0),
      engagement: String(body.engagement ?? 0),
      description: body.description ?? "",
      isActive: body.isActive ?? true,
    })
    .returning();

  await db.insert(adPackages).values(
    DEFAULT_PACKAGES.map((p) => ({
      channelId: channel.id,
      type: p.type,
      label: p.label,
      price: String(p.price),
    })),
  );

  return Response.json(channel);
}
