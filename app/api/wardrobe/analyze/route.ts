import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { imageUrl } = await req.json();
  if (!imageUrl) {
    return NextResponse.json({ error: "Missing imageUrl" }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this clothing image and return ONLY valid JSON, no markdown, no explanation, in this exact shape:
{
  "category": "TOP" | "BOTTOM" | "OUTERWEAR" | "DRESS" | "SHOES" | "BAG" | "ACCESSORY",
  "subcategory": "short name, e.g. White T-shirt",
  "color": "main color",
  "material": "fabric/material if visible, or null",
  "pattern": "solid | striped | plaid | floral | other, or null",
  "seasons": ["SPRING" | "SUMMER" | "FALL" | "WINTER" | "ALL_SEASON"]
}`,
              },
              { type: "image_url", image_url: { url: imageUrl } },
            ],
          },
        ],
        max_tokens: 300,
      }),
    });

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content ?? "";
    const cleanJson = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanJson);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("AI analyze error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}