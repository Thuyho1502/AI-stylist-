import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { occasion, style, weather, outfit, reason } = body;

  if (!outfit || !Array.isArray(outfit) || outfit.length === 0) {
    return NextResponse.json({ error: "Missing outfit items" }, { status: 400 });
  }

  const saved = await prisma.outfit.create({
    data: {
      userId: session.user.id,
      occasion: occasion || null,
      style: style || null,
      weather: weather || null,
      items: { outfit, reason },
    },
  });

  return NextResponse.json({ outfit: saved }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const outfits = await prisma.outfit.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(outfits);
}