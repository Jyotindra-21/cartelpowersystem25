import { NextRequest, NextResponse } from "next/server";
import { MinioClient } from "@/lib/minio";

const minioClient = new MinioClient();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const folder = (formData.get("folder") as string) || "uploads";

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }
    const uploadResults = [];
    for (const file of files) {
      try {
        const buffer = await file.arrayBuffer();
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${file.name}`;

        await minioClient.uploadObject(
          fileName,
          Buffer.from(buffer),
          file.size,
          file.type
        );

        const url = await minioClient.getObjectUrl(fileName);

        uploadResults.push({
          fileName: file.name,
          uploadedName: fileName,
          url: url,
          size: file.size,
          type: file.type,
          success: true,
        });
      } catch (error) {
        uploadResults.push({
          fileName: file.name,
          success: false,
          error: error instanceof Error ? error.message : "Upload failed",
        });
      }
    }

    return NextResponse.json({
      success: true,
      results: uploadResults,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
