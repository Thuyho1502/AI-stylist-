import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from "@/lib/r2";

export async function POST(req: NextRequest) {
  try {
    // 1. Check user đã đăng nhập chưa
    const session = await getServerSession(authOptions);
console.log("SESSION DEBUG:", session); // dòng tạm để debug

        if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

    

    // 2. Lấy file từ formData
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 3. Validate loại file
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    // 4. Validate kích thước (giới hạn 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    // 5. Chuyển file thành buffer để upload
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split(".").pop();
    const fileName = `wardrobe/${session.user.id}/${crypto.randomUUID()}.${fileExtension}`;

    // 6. Upload lên R2
    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      })
    );

    // 7. Trả về URL public để dùng ở bước tiếp theo (AI scan + lưu DB)
    const imageUrl = `${R2_PUBLIC_URL}/${fileName}`;

    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}