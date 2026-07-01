import { NextResponse } from "next/server";

interface OutfitRequest{
  occasion: string;
  style:string;
  weather?: string|null;
}
export async function POST(req:Request) {
  const body: OutfitRequest = await req.json();
  const {occasion, style, weather} = body;

  const outfit = generateOutfit(occasion,style,weather ?? null);
  return NextResponse.json({outfit});
  
}

function generateOutfit(
  occasion: string,
  style: string,
  weather: string | null
): string[] {
  const isCold = weather === "cold";
   const isHot = weather === "hot" || weather === "sunny";
  const isRainy = weather === "rainy";

  if (occasion === "work" || style === "formal") {
    if (isCold) return ["Wool Trench Coat", "White Button-up Shirt", "Dress Trousers", "Oxford Shoes"];
    return ["Blazer", "White Button-up Shirt", "Tailored Trousers", "Loafers"];
  }

   if (occasion === "date" || style === "elegant") {
    if (isCold) return ["Long Camel Coat", "Silk Blouse", "Black Midi Skirt", "Ankle Boots"];
    return ["Satin Slip Dress", "Strappy Heels", "Small Shoulder Bag"];
  }
   if (occasion === "party") {
    return ["Sequin Top", "High-waist Trousers", "Block Heels", "Clutch Bag"];
  }
   if (style === "streetwear") {
    if (isCold) return ["Puffer Jacket", "Graphic Hoodie", "Cargo Pants", "Chunky Sneakers"];
    return ["Graphic Tee", "Baggy Jeans", "Air Force 1s", "Cap"];
  }

  if (isCold) {
    return ["Beige Oversized Hoodie", "Black Puffer Jacket", "Light Blue Straight Jeans", "White Sneakers", "Black Beanie & Backpack"];
  }
  if (isHot) {
    return ["Linen Shirt", "Shorts", "Slip-on Sneakers", "Sunglasses"];
  }

  if (isRainy) {
    return ["Waterproof Jacket", "Roll-neck Sweater", "Slim Jeans", "Chelsea Boots"];
  }
   return ["White T-shirt", "Mom Jeans", "White Sneakers", "Tote Bag"];
}