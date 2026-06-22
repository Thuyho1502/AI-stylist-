import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { weather, occasion } = body;

  // MOCK AI LOGIC (tạm thời)
  const outfit = generateOutfit(weather, occasion);

  return NextResponse.json({ outfit });
}

function generateOutfit(weather: string, occasion: string) {
  if (weather === "cold") {
    return [
      "Black wool coat",
      "White sweater",
      "Blue jeans",
      "Sneakers",
    ];
  }

  return [
    "T-shirt",
    "Shorts",
    "Sneakers",
  ];
}