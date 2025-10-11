import { NextRequest, NextResponse } from "next/server";
import { minioClient, MINIO_BUCKET } from "@/lib/minio-client";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split(".").pop() || "jpg";
    let fileName;
    if (folder) {
      fileName = `${folder}/${timestamp}-${randomString}.${extension}`;
    } else {
      fileName = `${timestamp}-${randomString}.${extension}`;
    }
    // Upload to MinIO with proper metadata
    const metaData = {
      "Content-Type": file.type,
    };
    await minioClient.putObject(
      MINIO_BUCKET,
      fileName,
      buffer,
      buffer.length,
      metaData
    );
    // Generate public URL (using presigned URL or public endpoint)
    let publicUrl: string;

    if (process.env.NEXT_PUBLIC_URL_ENDPOINT) {
      // If you have a public endpoint configured
      publicUrl = `${process.env.NEXT_PUBLIC_URL_ENDPOINT}/${fileName}`;
    } else {
      // Generate presigned URL that expires in 7 days
      publicUrl = await minioClient.presignedGetObject(
        MINIO_BUCKET,
        fileName,
        7 * 24 * 60 * 60
      );
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: fileName,
      folder: folder || "",
      service: "minio",
    });
  } catch (error) {
    console.error("MinIO upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
