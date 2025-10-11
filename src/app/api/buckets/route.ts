import { NextRequest, NextResponse } from 'next/server';
import { MinioClient } from '@/lib/minio';

const minioClient = new MinioClient();

export async function GET() {
  try {
    const objects = await minioClient.listObjects();
    return NextResponse.json(objects);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch objects ${error}` },
      { status: 500 }
    );
  }
}