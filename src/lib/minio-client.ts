import { Client } from "minio";

export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: parseInt(process.env.MINIO_PORT || "443"),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
  region: process.env.MINIO_REGION || "us-east-1",
});

export const MINIO_BUCKET = process.env.MINIO_BUCKET || "uploads";
// Helper function to check if bucket exists and create if it doesn't
export async function ensureBucketExists() {
  try {
    const bucketExists = await minioClient.bucketExists(MINIO_BUCKET);
    if (!bucketExists) {
      await minioClient.makeBucket(MINIO_BUCKET, "us-east-1");
      console.log(`Bucket ${MINIO_BUCKET} created successfully`);
    }
  } catch (error) {
    console.error("Error ensuring bucket exists:", error);
    throw error;
  }
}
