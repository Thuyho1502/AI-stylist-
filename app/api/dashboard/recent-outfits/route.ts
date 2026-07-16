// app/api/dashboard/recent-outfits/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const outfits = await prisma.outfit.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 4,
    select: { id: true, occasion: true, createdAt: true },
  });

  return NextResponse.json(outfits);
}