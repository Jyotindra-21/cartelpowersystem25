import { NextRequest, NextResponse } from 'next/server';
import { MinioClient } from '@/lib/minio';

const minioClient = new MinioClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string }> }
) {
  try {
    // Await the params promise
    const { path } = await params;
    const url = new URL(request.url);
    const isBulkDelete = url.searchParams.get('bulk') === 'true';

    if (isBulkDelete) {
      // Handle bulk deletion
      const { items } = await request.json();
      
      if (!items || !Array.isArray(items)) {
        return NextResponse.json(
          { error: 'Items array is required for bulk delete' },
          { status: 400 }
        );
      }

      // Separate files and folders
      const filesToDelete = items.filter(item => !item.isDir).map(item => item.name);
      const foldersToDelete = items.filter(item => item.isDir).map(item => item.name);

      // Delete files
      if (filesToDelete.length > 0) {
        await minioClient.deleteObjects(filesToDelete);
      }

      // Delete folders (recursively delete all objects in folder)
      const folderDeletionPromises = foldersToDelete.map(async (folderPath) => {
        // List all objects in the folder
        const objectsInFolder = await minioClient.listObjects(folderPath);
        
        // Use type assertion and filter
        const objectNames = objectsInFolder
          .map(obj => obj.name!)
          .filter(name => name !== undefined) as string[];
        
        // Delete all objects in the folder
        if (objectNames.length > 0) {
          await minioClient.deleteObjects(objectNames);
        }
      });

      await Promise.all(folderDeletionPromises);

      return NextResponse.json({ 
        success: true,
        message: `Successfully deleted ${items.length} items` 
      });
    } else {
      // Handle single file/folder deletion
      const decodedPath = decodeURIComponent(path);
      
      // Check if it's a folder by listing objects with this prefix
      const objectsInPath = await minioClient.listObjects(decodedPath);
      
      // Use type assertion and filter
      const validObjectNames = objectsInPath
        .map(obj => obj.name!)
        .filter(name => name !== undefined) as string[];
      
      const isFolder = validObjectNames.length > 0 && 
        validObjectNames.some(name => name !== decodedPath && name.startsWith(decodedPath + '/'));

      if (isFolder) {
        // Delete folder recursively
        if (validObjectNames.length > 0) {
          await minioClient.deleteObjects(validObjectNames);
        }
      } else {
        // Delete single file
        await minioClient.deleteObject(decodedPath);
      }
      
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete object' },
      { status: 500 }
    );
  }
}