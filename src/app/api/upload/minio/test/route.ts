import { NextResponse } from "next/server";
import { minioClient, MINIO_BUCKET, ensureBucketExists } from "@/lib/minio-client";

export async function GET() {
  try {
    await ensureBucketExists();
    
    // List buckets to test connection
    const buckets = await minioClient.listBuckets();
    
    return NextResponse.json({
      success: true,
      message: "MinIO connection successful",
      buckets: buckets.map(b => b.name),
      currentBucket: MINIO_BUCKET
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      details: "Check your MINIO_ENDPOINT, credentials, and network connection"
    }, { status: 500 });
  }
}