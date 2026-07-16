// app/api/dashboard/stats/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
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

  const [wardrobeItems, savedOutfits, outfitsThisWeek, favorites] = await Promise.all([
    prisma.wardrobeItem.count({ where: { userId: user.id } }),
    prisma.outfit.count({ where: { userId: user.id } }),
    prisma.outfit.count({
      where: {
        userId: user.id,
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.outfit.count({ where: { userId: user.id, isFavorite: true } }),
  ]);

  return NextResponse.json({ wardrobeItems, savedOutfits, outfitsThisWeek, favorites });
}