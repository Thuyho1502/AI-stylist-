// app/api/dashboard/wardrobe-summary/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";

const COLORS: Record<string, string> = {
  Tops:        "#7c3aed",
  Bottoms:     "#ec4899",
  Shoes:       "#f59e0b",
  Accessories: "#10b981",
  Other:       "#64748b",
};

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

  const groups = await prisma.wardrobeItem.groupBy({
    by: ["category"],
    where: { userId: user.id },
    _count: { category: true },
  });

  const summary = groups.map((g) => ({
    name:  g.category,
    value: g._count.category,
    color: COLORS[g.category] ?? COLORS["Other"],
  }));

  return NextResponse.json(summary);
}