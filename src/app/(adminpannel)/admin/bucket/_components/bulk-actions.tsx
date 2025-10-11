'use client';

import { Button } from '@/components/ui/button';
import { Trash2, X } from 'lucide-react';

interface BucketItem {
  name: string;
  lastModified: string;
  etag: string;
  size: number;
  isDir?: boolean;
}

interface BulkActionsProps {
  selectedItems: BucketItem[];
  onClearSelection: () => void;
  onBulkDelete: (items: BucketItem[]) => void;
}

export function BulkActions({ selectedItems, onClearSelection, onBulkDelete }: BulkActionsProps) {
  if (selectedItems.length === 0) return null;

  const folderCount = selectedItems.filter(item => item.isDir).length;
  const fileCount = selectedItems.filter(item => !item.isDir).length;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:relative sm:bottom-auto sm:left-auto sm:right-auto sm:mb-4 sm:p-4 p-3 bg-primary/95 backdrop-blur-sm sm:bg-primary/10 rounded-xl sm:rounded-lg border border-primary/20 sm:border-none shadow-lg sm:shadow-none">
      {/* Mobile Layout */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <span className="font-semibold text-white sm:text-foreground text-sm">
              {selectedItems.length} selected
            </span>
            <span className="text-xs text-white/80 sm:text-muted-foreground">
              {folderCount > 0 && `${folderCount} folder${folderCount !== 1 ? 's' : ''}`}
              {folderCount > 0 && fileCount > 0 && ', '}
              {fileCount > 0 && `${fileCount} file${fileCount !== 1 ? 's' : ''}`}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearSelection}
            className="h-8 w-8 text-white hover:bg-white/20 sm:text-muted-foreground sm:hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearSelection}
            className="flex-1 bg-white/20 text-white border-white/30 hover:bg-white/30 hover:text-white sm:bg-transparent sm:text-foreground sm:border-border"
          >
            Clear
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onBulkDelete(selectedItems)}
            className="flex-1"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Desktop Layout (unchanged) */}
      <div className="hidden sm:flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium">
            {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
          </span>
          <span className="text-sm text-muted-foreground">
            ({folderCount} folder{folderCount !== 1 ? 's' : ''}, {fileCount} file{fileCount !== 1 ? 's' : ''})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearSelection}
          >
            Clear Selection
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onBulkDelete(selectedItems)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete Selected ({selectedItems.length})
          </Button>
        </div>
      </div>
    </div>
  );
}