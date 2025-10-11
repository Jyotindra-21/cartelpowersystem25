import { NextRequest, NextResponse } from "next/server";
import { MinioClient } from "@/lib/minio";

const minioClient = new MinioClient();

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const fileName = requestBody.filename;
    const url = await minioClient.getObjectUrl(fileName);
    return NextResponse.json({
      success: true,
      url: url,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Fail to get URL" }, { status: 500 });
  }
}
