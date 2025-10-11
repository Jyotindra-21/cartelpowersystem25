'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Search, Plus } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ImageCard } from './image-card';
import { FolderCard } from './folder-card';
import { OtherFileCard } from './other-file-card';
import { BulkActions } from './bulk-actions';
import MultiFileUpload from '@/components/custom/multi-file-upload';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/hooks/use-toast';

interface BucketItem {
    name: string;
    lastModified: string;
    etag: string;
    size: number;
    isDir?: boolean;
}

interface FolderItem {
    name: string;
    path: string;
}

interface DeleteDialogState {
    open: boolean;
    items: BucketItem[];
    isBulk: boolean;
}

export function MinioBrowser() {
    const [items, setItems] = useState<BucketItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [currentPath, setCurrentPath] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItems, setSelectedItems] = useState<BucketItem[]>([]);
    const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
        open: false,
        items: [],
        isBulk: false
    });
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [breadcrumbs, setBreadcrumbs] = useState<FolderItem[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        fetchItems(currentPath);
    }, [currentPath]);

    useEffect(() => {
        updateBreadcrumbs();
    }, [currentPath]);

    const updateBreadcrumbs = () => {
        if (!currentPath) {
            setBreadcrumbs([{ name: 'Root', path: '' }]);
            return;
        }

        const paths = currentPath.split('/').filter(Boolean);
        const crumbs: FolderItem[] = [{ name: 'Root', path: '' }];

        let accumulatedPath = '';
        paths.forEach((path, index) => {
            accumulatedPath += (accumulatedPath ? '/' : '') + path;
            crumbs.push({
                name: path,
                path: accumulatedPath
            });
        });

        setBreadcrumbs(crumbs);
    };

    const fetchItems = async (prefix?: string) => {
        try {
            setLoading(true);
            setError('');
            const url = prefix ? `/api/buckets?prefix=${encodeURIComponent(prefix)}` : '/api/buckets';
            const response = await fetch(url);

            if (!response.ok) throw new Error('Failed to fetch items');

            const data = await response.json();
            setItems(data);
            // Clear selection when items change
            setSelectedItems([]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleSingleDelete = async (item: BucketItem) => {
        try {
            const response = await fetch(`/api/buckets/${encodeURIComponent(item.name)}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete item');

            setItems(items.filter(i => i.name !== item.name));
            setSelectedItems(selectedItems.filter(i => i.name !== item.name));
            setDeleteDialog({ open: false, items: [], isBulk: false });

            toast({
                title: "Success",
                description: `Successfully deleted ${item.isDir ? 'folder' : 'file'}`,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete item');
            toast({
                title: "Error",
                description: "Failed to delete item",
                variant: "destructive"
            });
        }
    };

    const handleBulkDelete = async (itemsToDelete: BucketItem[]) => {
        try {
            const response = await fetch(`/api/buckets/bulk?bulk=true`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: itemsToDelete
                })
            });

            if (!response.ok) throw new Error('Failed to delete items');

            const deletedNames = itemsToDelete.map(item => item.name);
            setItems(prevItems => prevItems.filter(item => !deletedNames.includes(item.name)));
            setSelectedItems([]);
            setDeleteDialog({ open: false, items: [], isBulk: false });

            toast({
                title: "Success",
                description: `Successfully deleted ${itemsToDelete.length} ${itemsToDelete.length === 1 ? 'item' : 'items'}`,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete items');
            toast({
                title: "Error",
                description: "Failed to delete items",
                variant: "destructive"
            });
        }
    };

    const handleSelectItem = (item: BucketItem) => {
        setSelectedItems(prev => {
            const isAlreadySelected = prev.some(selected => selected.name === item.name);
            if (isAlreadySelected) {
                return prev.filter(selected => selected.name !== item.name);
            } else {
                return [...prev, item];
            }
        });
    };

    const handleUploadSuccess = () => {
        fetchItems(currentPath);
    };
    const navigateToFolder = (folderPath: string) => {
        setCurrentPath(folderPath);
    };
    const navigateToBreadcrumb = (path: string) => {
        setCurrentPath(path);
    };
    const getFolderName = (path: string): string => {
        const parts = path.split('/').filter(Boolean);
        return parts[parts.length - 1] || path;
    };
    const getFileName = (path: string): string => {
        const parts = path.split('/');
        return parts[parts.length - 1];
    };
    const isImageFile = (fileName: string): boolean => {
        return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(fileName);
    };
    // Extract folders from items
    const extractFolders = (items: BucketItem[]): BucketItem[] => {
        const folderPaths = new Set<string>();

        items.forEach(item => {
            if (item.isDir) return;

            // Get the path relative to current directory
            let relativePath = item.name;
            if (currentPath) {
                if (!item.name.startsWith(currentPath + '/')) return;
                relativePath = item.name.slice(currentPath.length + 1);
            }

            const parts = relativePath.split('/').filter(Boolean);

            // If there's a folder structure, the first part is a direct subfolder
            if (parts.length > 1) {
                const folderName = parts[0];
                const fullFolderPath = currentPath
                    ? `${currentPath}/${folderName}`
                    : folderName;

                folderPaths.add(fullFolderPath);
            }
        });

        return Array.from(folderPaths).map(path => ({
            name: path,
            lastModified: new Date().toISOString(),
            etag: '',
            size: 0,
            isDir: true
        }));
    };

    // Extract only direct files
    const extractFiles = (items: BucketItem[]): BucketItem[] => {
        return items.filter(item => {
            if (item.isDir) return false;

            if (!currentPath) {
                // In root: file should not contain any slashes
                return !item.name.includes('/');
            } else {
                // In folder: file should be directly in this folder (no further slashes after current path)
                if (!item.name.startsWith(currentPath + '/')) return false;

                const afterCurrentPath = item.name.slice(currentPath.length + 1);
                return !afterCurrentPath.includes('/');
            }
        });
    };

    const folders = extractFolders(items);
    const files = extractFiles(items);
    const imageFiles = files.filter(file => isImageFile(file.name));
    const otherFiles = files.filter(file => !isImageFile(file.name));

    const filteredFolders = folders.filter(folder =>
        getFolderName(folder.name).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredImages = imageFiles.filter(file =>
        getFileName(file.name).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredOtherFiles = otherFiles.filter(file =>
        getFileName(file.name).toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto md:p-6 md:space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        MinIO Bucket Browser
                    </CardTitle>
                    <CardDescription>
                        Browse and manage your files and folders
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Search and Navigation */}
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search files and folders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                        {/* Breadcrumb with horizontal scroll for very long paths */}
                        <div className="flex flex-col gap-2 flex-1 min-w-0">
                            <div className="relative">
                                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1 -mx-2 px-2">
                                    {breadcrumbs.map((crumb, index) => (
                                        <div key={crumb.path} className="flex items-center gap-2 flex-shrink-0">
                                            {index > 0 && (
                                                <span className="text-muted-foreground text-sm flex-shrink-0">/</span>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => navigateToBreadcrumb(crumb.path)}
                                                className={`p-1 h-auto min-h-0 text-xs sm:text-sm flex-shrink-0 ${index === breadcrumbs.length - 1
                                                    ? "font-semibold text-primary"
                                                    : "text-muted-foreground hover:text-foreground"
                                                    }`}
                                            >
                                                <span className="truncate max-w-[100px] sm:max-w-[120px]">
                                                    {crumb.name === 'Root' ? 'Root' : getFolderName(crumb.name)}
                                                </span>
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                {/* Fade effect for scroll indication */}
                                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none sm:hidden" />
                            </div>

                            {/* Current path display for mobile */}
                            <div className="sm:hidden text-xs text-muted-foreground truncate px-1">
                                {currentPath || 'Root'}
                            </div>
                        </div>

                        {/* Upload Button */}
                        <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    className="flex items-center gap-2 w-full sm:w-auto sm:min-w-[140px] flex-shrink-0"
                                    size="sm"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Upload Files</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-h-[90vh] overflow-y-auto w-[95vw] max-w-[95vw] sm:max-w-md md:max-w-lg mx-auto">
                                <DialogHeader className="px-1 sm:px-0">
                                    <DialogTitle className="text-lg sm:text-xl">Upload Files</DialogTitle>
                                    <CardDescription className="text-sm sm:text-base break-words">
                                        Upload to: {currentPath || 'Root'}
                                    </CardDescription>
                                </DialogHeader>
                                <div className="px-1 sm:px-0">
                                    <MultiFileUpload
                                        onSuccess={() => {
                                            handleUploadSuccess();
                                            setUploadModalOpen(false);
                                        }}
                                        folder={currentPath || 'uploads'}
                                        maxFiles={10}
                                        maxSize={20}
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Bulk Actions */}
                    <BulkActions
                        selectedItems={selectedItems}
                        onClearSelection={() => setSelectedItems([])}
                        onBulkDelete={(items) => setDeleteDialog({
                            open: true,
                            items: items,
                            isBulk: true
                        })}
                    />

                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Folders */}
                            {filteredFolders.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Folders</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {filteredFolders.map((folder) => (
                                            <FolderCard
                                                key={folder.name}
                                                folder={folder}
                                                isSelected={selectedItems.some(item => item.name === folder.name)}
                                                onSelect={handleSelectItem}
                                                onDelete={(folder) => setDeleteDialog({
                                                    open: true,
                                                    items: [folder],
                                                    isBulk: false
                                                })}
                                                onNavigate={navigateToFolder}
                                                getFolderName={getFolderName}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Images */}
                            {filteredImages.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-lg font-semibold">
                                            Images ({filteredImages.length})
                                        </h3>
                                    </div>
                                    <div className="grid min-[100px]:grid-cols-1 min-[350px]:grid-cols-2 max-sm:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                        {filteredImages.map((file) => (
                                            <ImageCard
                                                key={file.name}
                                                file={file}
                                                isSelected={selectedItems.some(item => item.name === file.name)}
                                                onSelect={() => handleSelectItem(file)}
                                                onDelete={() => setDeleteDialog({
                                                    open: true,
                                                    items: [file],
                                                    isBulk: false
                                                })}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Other Files */}
                            {filteredOtherFiles.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                                        Files <span className="text-gray-500 dark:text-gray-400">({filteredOtherFiles.length})</span>
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                        {filteredOtherFiles.map((file) => (
                                            <OtherFileCard
                                                key={file.name}
                                                file={file}
                                                isSelected={selectedItems.some(item => item.name === file.name)}
                                                onSelect={handleSelectItem}
                                                onDelete={(file) => setDeleteDialog({
                                                    open: true,
                                                    items: [file],
                                                    isBulk: false
                                                })}
                                                getFileName={getFileName}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {filteredFolders.length === 0 && filteredImages.length === 0 && filteredOtherFiles.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    {searchTerm ? 'No items match your search' : 'This folder is empty'}
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open, items: [], isBulk: false })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {deleteDialog.isBulk
                                ? `Delete ${deleteDialog.items.length} Items?`
                                : `Delete ${deleteDialog.items[0]?.isDir ? 'Folder' : 'File'}?`
                            }
                        </AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-3">
                                {deleteDialog.isBulk ? (
                                    <>
                                        <p>This will permanently delete {deleteDialog.items.length} selected items:</p>
                                        <ul className="text-sm space-y-1">
                                            {deleteDialog.items.filter(item => item.isDir).length > 0 && (
                                                <li>• {deleteDialog.items.filter(item => item.isDir).length} folder(s)</li>
                                            )}
                                            {deleteDialog.items.filter(item => !item.isDir).length > 0 && (
                                                <li>• {deleteDialog.items.filter(item => !item.isDir).length} file(s)</li>
                                            )}
                                        </ul>
                                        <p className="font-semibold text-sm">This action cannot be undone.</p>
                                    </>
                                ) : (
                                    <p>This will permanently delete {deleteDialog.items[0]?.isDir ? 'the folder and all its contents' : 'the file'}. This action cannot be undone.</p>
                                )}
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (deleteDialog.isBulk) {
                                    handleBulkDelete(deleteDialog.items);
                                } else if (deleteDialog.items[0]) {
                                    handleSingleDelete(deleteDialog.items[0]);
                                }
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete {deleteDialog.isBulk && deleteDialog.items.length > 1 ? `(${deleteDialog.items.length})` : ''}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}