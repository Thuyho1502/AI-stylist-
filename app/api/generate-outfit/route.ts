import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface WardrobeItemInput {
  category: string;
  subcategory: string | null;
  color: string;
  material: string | null;
}

interface OutfitRequest {
  occasion: string;
  style: string;
  weather?: string | null;
  customPrompt?: string | null;
  wardrobeItems?: WardrobeItemInput[];
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

CRITICAL — cross-check every single item against BOTH occasion AND weather together, not just one or the other:
- Fabric weight must match weather: no heavy knits, wool, or thick layers in hot/sunny weather; no lightweight/sheer fabrics alone in cold weather
- Accessory formality must match occasion formality: beach/vacation items (wide-brim sun hats, flip-flops, novelty sunglasses) do NOT belong in work, date, party, or other social-event outfits unless the occasion is explicitly a beach or outdoor casual event
- An item can be individually weather-appropriate AND individually occasion-appropriate, but still wrong if it clashes when combined — always evaluate the outfit as a whole, not item by item
- When occasion is "party" or similarly social, prioritize event-appropriate accessories (jewelry, clutch, heeled sandals) over outdoor/functional gear
- If weather and occasion pull in different directions (e.g. formal party + hot weather), resolve it with fabric choice and silhouette (lightweight formal fabrics), not by adding casual/outdoor items

When building an outfit:
- Build around one focal/hero piece
- Maintain a cohesive color palette (max 2-3 colors)
- Balance proportions: fitted top = relaxed bottom, oversized top = slim bottom
- Recommend accessories only when they genuinely enhance the look AND fit the occasion's formality
- Ensure footwear matches both the occasion and outfit aesthetic
- Never recommend combinations that obviously conflict with the event
- If information is missing, make reasonable assumptions instead of refusing
- If the user provides a specific custom request, treat it as the top priority and build the outfit around it
- When the user's wardrobe is provided, treat it as a real closet — prefer reusing what they already own over suggesting new purchases, but never force a poor match just to use an existing item
- Before finalizing, mentally review the full outfit as a cohesive look — remove or replace any single item that doesn't logically belong with the rest

Always respond with valid JSON only. No extra text, no markdown.
`.trim();

const COLOR_DIRECTIONS = [
  "monochrome black and grey palette",
  "earthy tones (olive, brown, cream)",
  "cool blue and denim-based palette",
  "muted pastel palette",
  "high-contrast black and white palette",
  "warm neutrals (tan, rust, ivory)",
];

const STYLE_ANGLES = [
  "techwear-influenced silhouette",
  "90s vintage-inspired pieces",
  "minimalist clean-cut approach",
  "athleisure-influenced comfort pieces",
  "utility/workwear-inspired details",
  "preppy-influenced layering",
];

function pickShuffled<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

const userPrompt = (
  occasion: string,
  style: string,
  weather: string | null,
  variation: number,
  colorDirection: string,
  styleAngle: string,
  customPrompt: string | null,
  wardrobeText: string | null
) => `
Generate outfit variation #${variation} for:
- Occasion: ${occasion}
- Style preference: ${style}
- Weather: ${weather ?? "not specified"}
- Color direction for this variation: ${colorDirection}
- Styling angle to lean into: ${styleAngle}
${customPrompt ? `
The user has given this specific request — treat it as the HIGHEST PRIORITY, above the general color direction and styling angle listed above:
"${customPrompt}"
` : ""}
${wardrobeText ? `
The user's existing wardrobe includes:
${wardrobeText}

PRIORITIZE building the outfit using items from this wardrobe whenever they fit the occasion/style/weather. Only suggest a NEW item (not in the wardrobe) when nothing suitable exists there. When you use an existing wardrobe item, name it EXACTLY as listed above.
` : ""}

Return ONLY this JSON format:
{
  "hero_piece": "The focal item the outfit is built around",
  "outfit": ["item 1", "item 2", ...],
  "reason": "1-2 sentences explaining why this outfit works for the occasion and style."
}

Rules:
- outfit should have 3 to 7 items depending on complexity (casual = fewer, formal/layered = more)
- Each item must have a specific descriptive name (e.g. "Camel Wool Trench Coat", "White Slim-fit Oxford Shirt")
${customPrompt
  ? "- Prioritize the user's specific request above all else, even if it conflicts with the general color direction or styling angle"
  : "- Follow the given color direction and styling angle closely — avoid generic/default combinations"}
- Avoid overused items like plain black puffer jackets or plain white sneakers unless they truly fit the direction
- hero_piece must be one of the items in the outfit array
- reason must be under 50 words and sound natural, not robotic
`;

const FALLBACK_VARIATIONS = [
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
];

export async function POST(req: Request) {
  try {
    const body: OutfitRequest = await req.json();
    const { occasion, style, weather, customPrompt, wardrobeItems } = body;

    const wardrobeText =
      wardrobeItems && wardrobeItems.length > 0
        ? wardrobeItems
            .map(
              (item) =>
                `- ${item.subcategory || item.category} (${item.color}${
                  item.material ? `, ${item.material}` : ""
                })`
            )
            .join("\n")
        : null;

    const colorDirections = pickShuffled(COLOR_DIRECTIONS, 3);
    const styleAngles = pickShuffled(STYLE_ANGLES, 3);

    const makeRequest = (variation: number, temperature: number, colorDirection: string, styleAngle: string) =>
      openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: userPrompt(
              occasion,
              style,
              weather ?? null,
              variation,
              colorDirection,
              styleAngle,
              customPrompt ?? null,
              wardrobeText
            ),
          },
        ],
        temperature,
        max_tokens: 400,
        frequency_penalty: 0.6,
        presence_penalty: 0.4,
        response_format: { type: "json_object" },
      });

    const results = await Promise.allSettled([
      makeRequest(1, 0.8, colorDirections[0], styleAngles[0]),
      makeRequest(2, 0.9, colorDirections[1], styleAngles[1]),
      makeRequest(3, 1.0, colorDirections[2], styleAngles[2]),
    ]);

    const parsed = results
      .map((result, i) => {
        if (result.status === "rejected") {
          console.error(`Variation ${i + 1} request failed:`, result.reason);
          return null;
        }
        try {
          const text = result.value.choices[0].message.content ?? "";
          const clean = text.replace(/```json|```/g, "").trim();
          return JSON.parse(clean);
        } catch (err) {
          console.error(
            `Variation ${i + 1} parse failed:`,
            err,
            result.value.choices[0]?.message?.content
          );
          return null;
        }
      })
      .filter((v): v is { hero_piece: string; outfit: string[]; reason: string } => v !== null);

    if (parsed.length === 0) {
      console.error("All 3 variations failed — using fallback");
      return NextResponse.json({ variations: FALLBACK_VARIATIONS });
    }

    return NextResponse.json({
      variations: parsed.map((v) => ({
        hero_piece: v.hero_piece,
        outfit: v.outfit,
        reason: v.reason,
      })),
    });
  } catch (error) {
    console.error("OpenAI error:", error);
    return NextResponse.json({ variations: FALLBACK_VARIATIONS });
  }
}