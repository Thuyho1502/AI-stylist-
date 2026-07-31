import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from "@/lib/r2";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { outfit, heroPiece, occasion, style } = await req.json();

    if (!outfit || !Array.isArray(outfit) || outfit.length === 0) {
      return NextResponse.json({ error: "Missing outfit items" }, { status: 400 });
    }

    const itemsList = outfit.join(", ");

    const prompt = `A clean, professional flat-lay style fashion photograph showing a complete outfit: ${itemsList}. ${heroPiece ? `The focal item is: ${heroPiece}.` : ""} Styled for a ${occasion ?? "everyday"} occasion with a ${style ?? "casual"} aesthetic. Items arranged neatly on a soft neutral background, editorial fashion catalog style, soft natural lighting, no people, no text, no watermark.`;

    const response = await openai.images.generate({
      model: "gpt-image-1-mini",
      prompt,
      size: "1024x1024",
      quality: "low",
    });

    const base64Image = response.data?.[0]?.b64_json;
    if (!base64Image) {
      throw new Error("No image returned");
    }

    const buffer = Buffer.from(base64Image, "base64");
    const fileName = `outfit-images/${session.user.id}/${crypto.randomUUID()}.png`;

    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: "image/png",
      })
    );

    const imageUrl = `${R2_PUBLIC_URL}/${fileName}`;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
  }
}