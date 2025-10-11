export interface BucketItem {
  name: string;
  prefix?: string;
  size: number;
  lastModified: Date;
  isDir?: boolean;
}

export interface FolderStructure {
  [key: string]: {
    files: BucketItem[];
    folders: string[];
  };
}