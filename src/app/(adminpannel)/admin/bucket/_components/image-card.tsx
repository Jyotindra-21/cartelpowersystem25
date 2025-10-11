'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Loader2, File, Eye } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ImageCardProps {
    file: {
        name: string;
        size: number;
        lastModified: string;
    };
    isSelected: boolean;
    onSelect: () => void;
    onDelete: () => void;
}

export function ImageCard({ file, isSelected, onSelect, onDelete }: ImageCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
    const [showOverlay, setShowOverlay] = useState(false);

    const getFileName = (path: string): string => {
        const parts = path.split('/');
        return parts[parts.length - 1];
    };

    const getFileExtension = (filename: string): string => {
        return filename.split('.').pop()?.toUpperCase() || 'FILE';
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
        const img = event.currentTarget;
        setImageDimensions({
            width: img.naturalWidth,
            height: img.naturalHeight
        });
        setImageLoaded(true);
    };

    const handleImageError = () => {
        setImageError(true);
        setImageLoaded(true);
    };

    const fileName = getFileName(file.name);
    const fileExtension = getFileExtension(fileName);
    const imageUrl = `${process.env.NEXT_PUBLIC_URL_ENDPOINT}/${file.name}`;

    return (
        <Card className={`overflow-hidden group hover:shadow-lg transition-all duration-200 p-0 gap-2 ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
            {/* Image Container */}
            <div
                className="relative aspect-square bg-muted/50 overflow-hidden"
                onMouseEnter={() => setShowOverlay(true)}
                onMouseLeave={() => setShowOverlay(false)}
            >
                {/* Selection Checkbox */}
                <div className="absolute top-2 right-2 z-5">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={onSelect}
                        className="cursor-pointer h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary bg-white shadow-sm"
                    />
                </div>

                {/* Extension Badge */}
                <div className="absolute top-2 left-2 z-5">
                    <Badge variant="secondary" className="text-xs font-mono bg-black/80 text-white border-0">
                        {fileExtension}
                    </Badge>
                </div>

                {/* Image */}
                {!imageError ? (
                    <>
                        {!imageLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        )}
                        <img
                            src={imageUrl}
                            alt={fileName}
                            className={`w-full h-full object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                                }`}
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                            loading="lazy"
                        />
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                        <File className="h-8 w-8 text-muted-foreground" />
                    </div>
                )}

                {/* Hover Overlay */}
                <div
                    className={`absolute inset-0 bg-black/60 transition-opacity duration-300 flex items-center justify-center gap-2 ${showOverlay ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="secondary"
                                size="xs"
                                onClick={() => window.open(imageUrl, '_blank')}
                                className="h-10 w-10 bg-white/90 hover:bg-white hover:scale-110 transition-transform shadow-lg"
                            >
                                <Eye className="h-4 w-4  text-primary" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            View Image
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="destructive"
                                size="xs"
                                onClick={onDelete}
                                className="h-10 w-10 bg-white/90 hover:bg-red-50 hover:scale-110 transition-transform shadow-lg"
                            >
                                <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            Delete Image
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>

            {/* Info Section */}
            <CardContent className="p-3 space-y-2">
                {/* File Name */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="min-w-0 cursor-default">
                            <p
                                className="text-sm font-medium truncate text-foreground"
                                title={fileName}
                            >
                                {fileName}
                            </p>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>{fileName}</TooltipContent>
                </Tooltip>

                {/* Metadata */}
                <div className=" text-xs text-muted-foreground">

                    {/* File Size */}
                    <div className="flex justify-between items-center gap-1">
                        <span>{formatFileSize(file.size)}</span>
                        {/* Dimensions */}
                        {imageDimensions && (
                            <div className="flex items-center gap-1">
                                <span className="font-mono">
                                    {imageDimensions.width} × {imageDimensions.height}
                                </span>
                            </div>
                        )}
                    </div>
                    {/* Date */}
                    <div className="text-right">
                        <div className="text-xs opacity-75">
                            {formatDate(file.lastModified)}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}