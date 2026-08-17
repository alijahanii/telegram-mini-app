import { getChannelById } from "@/lib/queries";
import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const data = await getChannelById(Number(id));
  if (!data) return Response.json({ error: "not found" }, { status: 404 });
  return Response.json({
    channel: { ...data.channel, engagement: String(data.channel.engagement) },
    packages: data.packages.map((p) => ({ ...p, price: String(p.price) })),
  });
}
