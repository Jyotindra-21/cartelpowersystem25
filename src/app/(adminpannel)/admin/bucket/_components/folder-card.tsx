'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Folder, Trash2 } from 'lucide-react';

interface BucketItem {
  name: string;
  lastModified: string;
  etag: string;
  size: number;
  isDir?: boolean;
}

interface FolderCardProps {
  folder: BucketItem;
  isSelected: boolean;
  onSelect: (folder: BucketItem) => void;
  onDelete: (folder: BucketItem) => void;
  onNavigate: (folderPath: string) => void;
  getFolderName: (path: string) => string;
}

export function FolderCard({
  folder,
  isSelected,
  onSelect,
  onDelete,
  onNavigate,
  getFolderName
}: FolderCardProps) {
  return (
    <Card className={`p-3 hover:bg-accent/50 transition-colors ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-1">
          {/* Checkbox for selection */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(folder)}
            className="cursor-pointer h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <div
            className="flex items-center space-x-2 cursor-pointer flex-1"
            onClick={() => onNavigate(folder.name)}
          >
            <Folder className="h-5 w-5 text-blue-500" />
            <div className="min-w-0 flex-1">
              <span className="text-sm font-medium truncate block">
                {getFolderName(folder.name)}
              </span>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(folder)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </Card>
  );
}