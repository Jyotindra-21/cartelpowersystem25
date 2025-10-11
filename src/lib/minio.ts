import * as Minio from "minio";

export class MinioClient {
  private client: Minio.Client;

  constructor() {
    this.client = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT!,
      port: parseInt(process.env.MINIO_PORT || "9000"),
      useSSL: process.env.MINIO_USE_SSL === "true",
      accessKey: process.env.MINIO_ACCESS_KEY!,
      secretKey: process.env.MINIO_SECRET_KEY!,
    });
  }

  async listObjects(prefix?: string): Promise<Minio.BucketItem[]> {
    return new Promise((resolve, reject) => {
      const objects: Minio.BucketItem[] = [];
      const stream = this.client.listObjectsV2(
        process.env.MINIO_BUCKET!,
        prefix,
        true,
        "/"
      );

      stream.on("data", (obj: Minio.BucketItem) => {
        // Type guard to ensure we have a valid object with name
        if (obj && typeof obj.name === "string") {
          // Cast to BucketItem since we've verified it has the required properties
          const bucketItem: Minio.BucketItem = {
            name: obj.name,
            lastModified: obj.lastModified || new Date(),
            etag: obj.etag || "",
            size: obj.size || 0,
            prefix: obj.prefix,
          };
          objects.push(bucketItem);
        }
      });

      stream.on("end", () => resolve(objects));
      stream.on("error", reject);
    });
  }

  async getObjectUrl(objectName: string): Promise<string> {
    return this.client.presignedGetObject(
      process.env.MINIO_BUCKET!,
      objectName,
      24 * 60 * 60 // 24 hours
    );
  }

  async deleteObjects(objectNames: string[]): Promise<void> {
    try {
      // Remove objects in bulk - this is more efficient than individual calls
      await this.client.removeObjects(process.env.MINIO_BUCKET!, objectNames);
    } catch (error) {
      console.error("Error deleting objects in bulk:", error);
      throw error;
    }
  }

  async deleteObject(objectName: string): Promise<void> {
    return this.client.removeObject(process.env.MINIO_BUCKET!, objectName);
  }

  async uploadObject(
    objectName: string,
    buffer: Buffer,
    size: number,
    contentType: string = "application/octet-stream"
  ): Promise<void> {
    await this.client.putObject(
      process.env.MINIO_BUCKET!,
      objectName,
      buffer,
      size,
      { "Content-Type": contentType }
    );
  }
}
