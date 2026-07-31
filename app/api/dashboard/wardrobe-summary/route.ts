// app/api/dashboard/wardrobe-summary/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";

const CATEGORY_DISPLAY: Record<string, { label: string; color: string }> = {
  TOP:        { label: "Tops",        color: "#7c3aed" },
  BOTTOM:     { label: "Bottoms",     color: "#ec4899" },
  OUTERWEAR:  { label: "Outerwear",   color: "#3b82f6" },
  DRESS:      { label: "Dresses",     color: "#f43f5e" },
  SHOES:      { label: "Shoes",       color: "#f59e0b" },
  BAG:        { label: "Bags",        color: "#06b6d4" },
  ACCESSORY:  { label: "Accessories", color: "#10b981" },
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

  const summary = groups.map((g) => {
    const display = CATEGORY_DISPLAY[g.category] ?? { label: g.category, color: "#64748b" };
    return {
      name: display.label,
      value: g._count.category,
      color: display.color,
    };
  });

  return NextResponse.json(summary);
}