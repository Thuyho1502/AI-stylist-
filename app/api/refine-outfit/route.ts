import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface RefineRequest {
  occasion: string;
  style: string;
  weather?: string | null;
  originalOutfit: {
    hero_piece: string;
    outfit: string[];
    reason: string;
  };
  feedback: string;
}

const SYSTEM_PROMPT = `
You are an experienced personal fashion stylist. You are revising an outfit based on the user's specific feedback.

Rules for revising:
- Keep everything the user did NOT complain about — do not change items unrelated to their feedback
- Apply the user's feedback precisely — if they say "remove the hat", remove it; if they say "something lighter for hot weather", swap the heavy item for a lighter one
- After applying the feedback, re-check the ENTIRE outfit for coherence: fabric weight must still match weather, accessory formality must still match occasion, colors must still feel cohesive (max 2-3 colors)
- If removing an item leaves a gap (e.g. no footwear), add an appropriate replacement
- Each item must have a specific descriptive name (e.g. "Camel Wool Trench Coat", not just "Coat")
- outfit should have 3 to 7 items depending on complexity

Always respond with valid JSON only. No extra text, no markdown.
`.trim();

const userPrompt = (
  occasion: string,
  style: string,
  weather: string | null,
  originalOutfit: RefineRequest["originalOutfit"],
  feedback: string
) => `
Original outfit for:
- Occasion: ${occasion}
- Style preference: ${style}
- Weather: ${weather ?? "not specified"}

Current outfit:
${JSON.stringify(originalOutfit, null, 2)}

User's feedback on this outfit:
"${feedback}"

Revise the outfit based on this feedback. Return ONLY this JSON format:
{
  "hero_piece": "The focal item the outfit is built around",
  "outfit": ["item 1", "item 2", ...],
  "reason": "1-2 sentences explaining the revised outfit and why it now works better."
}
`;

export async function POST(req: Request) {
  try {
    const body: RefineRequest = await req.json();
    const { occasion, style, weather, originalOutfit, feedback } = body;

    if (!feedback || feedback.trim().length === 0) {
      return NextResponse.json({ error: "Feedback is required" }, { status: 400 });
    }

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: userPrompt(occasion, style, weather ?? null, originalOutfit, feedback.trim()),
        },
      ],
      temperature: 0.7,
      max_tokens: 400,
      response_format: { type: "json_object" },
    });

    const text = res.choices[0].message.content ?? "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json({
      hero_piece: parsed.hero_piece,
      outfit: parsed.outfit,
      reason: parsed.reason,
    });
  } catch (error) {
    console.error("Refine outfit error:", error);
    return NextResponse.json({ error: "Failed to refine outfit" }, { status: 500 });
  }
}