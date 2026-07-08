import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface OutfitRequest {
  occasion: string;
  style: string;
  weather?: string | null;
}

const SYSTEM_PROMPT = `
You are an experienced personal fashion stylist. Your goal is to help users choose stylish, practical, and confidence-boosting outfits.

Always consider:
- Occasion and dress code
- Weather and seasonal context
- User style preferences
- Color harmony and cohesive palette
- Body proportion balance between upper and lower garments
- Comfort and practicality
- Timeless styling over overly trendy looks (unless user asks)

When building an outfit:
- Build around one focal/hero piece
- Maintain a cohesive color palette (max 2-3 colors)
- Balance proportions: fitted top = relaxed bottom, oversized top = slim bottom
- Recommend accessories only when they genuinely enhance the look
- Ensure footwear matches both the occasion and outfit aesthetic
- Never recommend combinations that obviously conflict with the event
- If information is missing, make reasonable assumptions instead of refusing

Always respond with valid JSON only. No extra text, no markdown.
`.trim();

const userPrompt = (occasion: string, style: string, weather: string | null, variation: number) => `
Generate outfit variation #${variation} for:
- Occasion: ${occasion}
- Style preference: ${style}
- Weather: ${weather ?? "not specified"}

Return ONLY this JSON format:
{
  "hero_piece": "The focal item the outfit is built around",
  "outfit": ["item 1", "item 2", ...],
  "reason": "1-2 sentences explaining why this outfit works for the occasion and style."
}

Rules:
- outfit should have 3 to 7 items depending on complexity (casual = fewer, formal/layered = more)
- Each item must have a specific descriptive name (e.g. "Camel Wool Trench Coat", "White Slim-fit Oxford Shirt")
- Variation #${variation} must be CLEARLY DIFFERENT in color palette, vibe, and items from other variations
- hero_piece must be one of the items in the outfit array
- reason must be under 50 words and sound natural, not robotic
`;

export async function POST(req: Request) {
  try {
    const body: OutfitRequest = await req.json();
    const { occasion, style, weather } = body;

    const makeRequest = (variation: number, temperature: number) =>
      openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt(occasion, style, weather ?? null, variation) },
        ],
        temperature,
        max_tokens: 400,
      });

    const [res1, res2, res3] = await Promise.all([
      makeRequest(1, 0.7),
      makeRequest(2, 0.9),
      makeRequest(3, 1.0),
    ]);

    const parse = (res: typeof res1) => {
      const text = res.choices[0].message.content ?? "";
      const clean = text.replace(/```json|```/g, "").trim();
      return JSON.parse(clean);
    };

    const [v1, v2, v3] = [parse(res1), parse(res2), parse(res3)];

    return NextResponse.json({
      variations: [
        { hero_piece: v1.hero_piece, outfit: v1.outfit, reason: v1.reason },
        { hero_piece: v2.hero_piece, outfit: v2.outfit, reason: v2.reason },
        { hero_piece: v3.hero_piece, outfit: v3.outfit, reason: v3.reason },
      ],
    });
  } catch (error) {
    console.error("OpenAI error:", error);

    return NextResponse.json({
      variations: [
        {
          hero_piece: "White Oversized T-shirt",
          outfit: ["White Oversized T-shirt", "Light Blue Straight Jeans", "White Sneakers"],
          reason: "A clean, minimal look built around a crisp white tee — effortless and versatile.",
        },
        {
          hero_piece: "Black Hoodie",
          outfit: ["Black Hoodie", "Cargo Pants", "Chunky Sneakers", "Baseball Cap"],
          reason: "A streetwear-inspired look anchored by a classic black hoodie — relaxed and urban.",
        },
        {
          hero_piece: "Striped Long Sleeve Shirt",
          outfit: ["Striped Long Sleeve Shirt", "Beige Chinos", "Loafers", "Leather Belt"],
          reason: "A smart casual outfit built around a timeless striped shirt — balanced and put-together.",
        },
      ],
    });
  }
}