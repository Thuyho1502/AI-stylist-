import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { occasion, style, weather, items } = await req.json();

  const outfit = await prisma.outfit.create({
    data: {
      userId: user.id,
      occasion,
      style,
      weather,
      items,
      isFavorite: false,
    },
  });

  return NextResponse.json(outfit);
}