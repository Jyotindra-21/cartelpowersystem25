'use client';

import { Button } from '@/components/ui/button';
import { File, Calendar, Eye, Trash2, Copy } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/components/hooks/use-toast';

interface BucketItem {
    name: string;
    lastModified: string;
    etag: string;
    size: number;
    isDir?: boolean;
}

interface OtherFileCardProps {
    file: BucketItem;
    isSelected: boolean;
    onSelect: (file: BucketItem) => void;
    onDelete: (file: BucketItem) => void;
    getFileName: (path: string) => string;
}

export function OtherFileCard({
    file,
    isSelected,
    onSelect,
    onDelete,
    getFileName,

}: OtherFileCardProps) {
    const { toast } = useToast();
    const handlePreviewFile = async (filename: string) => {
        try {
            const response = await fetch(`/api/upload/view`, {
                method: 'POST',
                body: JSON.stringify({ filename: filename })
            });
            if (!response.ok) throw new Error('Failed to get file URL');
            const { url } = await response.json()
            window.open(url, "_blank")
        } catch (err) {
            console.log(`Error: ${err}`);
            toast({
                title: "Error",
                description: "Failed to preview file",
                variant: "destructive"
            });
        }
    };

    const handleCopyFile = (filename: string) => {
        navigator.clipboard.writeText(filename);
        toast({
            title: "Success",
            description: `Copied file name to clipboard`,
        });
    };

    const getFileExtension = (filename: string) => {
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const fileExtension = getFileExtension(file.name);

    return (
        <div className={`relative group cursor-pointer ${isSelected ? 'ring-2 ring-primary rounded-2xl' : ''}`}>
            {/* Checkbox */}
            <div className="absolute top-3 left-3 z-10">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelect(file)}
                    className="cursor-pointer h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary bg-white"
                />
            </div>

            {/* Main Card */}
            <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                {/* File Icon with Integrated Extension */}
                <div className="relative mb-4 flex justify-center">
                    <div className={`relative p-2 rounded-xl bg-blue-50 border-blue-200 border-2 w-24 h-24 flex flex-col items-center justify-center`}>
                        <File className={`h-10 w-10 text-blue-600 mb-2`} />
                        <div className={`text-xs font-bold uppercase text-blue-600 bg-white/30 dark:bg-black/30 px-2 py-1 rounded`}>
                            .{fileExtension}
                        </div>
                    </div>
                </div>

                {/* File Info */}
                <div className="space-y-3 text-center">
                    <h6 className="font-semibold text-gray-900 dark:text-white text-base truncate">
                        {getFileName(file.name)}
                    </h6>

                    <div className="flex flex-col items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span className="text-xs">{formatDate(file.lastModified)}</span>
                        </div>
                        <span className="font-mono text-xs font-semibold bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {formatFileSize(file.size)}
                        </span>
                    </div>
                </div>

                {/* Full Card Hover Overlay */}
                <div className="absolute inset-0 bg-black/30 rounded-2xl flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-xs p-4">
                    <div className="flex gap-3">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    type='button'
                                    className="h-12 w-12 bg-white/90 hover:bg-white hover:scale-110 transition-transform shadow-lg"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCopyFile(file.name);
                                    }}
                                >
                                    <Copy className="h-6 w-6 text-primary" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Copy File Name</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-12 w-12 bg-white/90 hover:bg-white hover:scale-110 transition-transform shadow-lg"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePreviewFile(file.name);
                                    }}
                                >
                                    <Eye className="h-6 w-6 text-blue-600" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>View File</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-12 w-12 bg-white/90 hover:bg-red-50 hover:scale-110 transition-transform shadow-lg"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(file);
                                    }}
                                >
                                    <Trash2 className="h-6 w-6 text-red-600" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete File</TooltipContent>
                        </Tooltip>
                    </div>
                    <div className="text-white/80 text-sm text-center mt-2">
                        <div>{formatFileSize(file.size)}</div>
                        <div>Modified: {formatDate(file.lastModified)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}