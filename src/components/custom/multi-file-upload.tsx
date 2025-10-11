"use client";
import React, { useState, useRef, useCallback, useMemo } from "react";
import { Loader2, Upload, File, Image, X, CheckCircle2, XCircle, FileText, CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface UploadResult {
  fileName: string;
  uploadedName: string;
  url: string;
  size: number;
  type: string;
  success: boolean;
  error?: string;
}

interface FileWithPreview {
  file: File;
  previewUrl?: string;
  id: string;
}

interface MultiFileUploadProps {
  onSuccess?: (results: UploadResult[]) => void;
  onUploadStart?: () => void;
  maxFiles?: number;
  maxSize?: number;
  acceptedTypes?: string;
  folder?: string;
}

export default function MultiFileUpload({
  onSuccess = () => {},
  onUploadStart = () => {},
  maxFiles = 10,
  maxSize = 10,
  acceptedTypes = "image/*,.pdf,.doc,.docx,.txt",
  folder = "uploads"
}: MultiFileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create preview URLs for images only
  const createPreviewUrl = useCallback((file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        resolve('');
      }
    });
  }, []);

  // Handle file selection
  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    if (fileArray.length === 0) return;

    // Check max files limit
    if (selectedFiles.length + fileArray.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed. You have ${selectedFiles.length} files selected.`);
      return;
    }

    setError(null);

    // Validate and process files
    const validFiles: FileWithPreview[] = [];
    
    for (const file of fileArray) {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        setError(`File "${file.name}" exceeds ${maxSize}MB limit`);
        continue;
      }

      // Create preview only for images
      const previewUrl = file.type.startsWith('image/') ? await createPreviewUrl(file) : undefined;
      
      validFiles.push({
        file,
        previewUrl,
        id: Math.random().toString(36).substring(2, 15)
      });
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
    // Reset input to allow selecting same files again
    e.target.value = '';
  };

  // Handle Add More files
  const handleAddMore = () => {
    fileInputRef.current?.click();
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const removeFile = (id: string) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setError(null);
    onUploadStart();

    try {
      const formData = new FormData();
      selectedFiles.forEach(fileWithPreview => {
        formData.append('files', fileWithPreview.file);
      });
      formData.append('folder', folder);

      const response = await fetch("/api/upload/minio-multi", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      setUploadResults(result.results);
      handleUploadSuccess(result.results);

    } catch (err: any) {
      setUploading(false);
      setError(err.message || "Upload failed");
    }
  };

  const handleUploadSuccess = (results: UploadResult[]) => {
    setUploading(false);
    setError(null);
    setSelectedFiles([]);
    onSuccess(results);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="w-4 h-4 text-blue-500" />;
    }
    if (fileType === 'application/pdf') {
      return <FileText className="w-4 h-4 text-red-500" />;
    }
    return <File className="w-4 h-4 text-gray-500" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isAllUploaded = useMemo(() => {
    return uploadResults.length > 0 && uploadResults.every(result => result.success);
  }, [uploadResults]);

  // Truncate long file names
  const truncateFileName = (fileName: string, maxLength: number = 28) => {
    if (fileName.length <= maxLength) return fileName;
    const extension = fileName.split('.').pop();
    const nameWithoutExtension = fileName.slice(0, fileName.lastIndexOf('.'));
    const truncatedName = nameWithoutExtension.slice(0, maxLength - (extension?.length || 0) - 3);
    return `${truncatedName}...${extension ? `.${extension}` : ''}`;
  };

  return (
    <div className="space-y-4 w-full">
      {/* Instructions - Mobile optimized */}
      <div className="text-center px-1">
        <p className="text-sm text-muted-foreground">
          Max {maxFiles} files • {maxSize}MB each
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Images, PDF, DOC, TXT
        </p>
      </div>

      {/* Drag & Drop Area - Mobile optimized */}
      <div
        className={`border-2 border-dashed rounded-lg transition-all duration-200 w-full ${
          isDragOver
            ? 'border-primary bg-primary/5'
            : selectedFiles.length === 0
            ? 'border-gray-300 bg-gray-50/50 hover:border-primary hover:bg-primary/5'
            : 'border-border bg-background'
        } ${
          selectedFiles.length === 0 ? 'p-4 md:p-8' : 'p-3 md:p-4'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={acceptedTypes}
          multiple
          className="hidden"
          id="multi-file-input"
        />
        
        <label
          htmlFor="multi-file-input"
          className="cursor-pointer block w-full"
        >
          <div className={`flex flex-col items-center justify-center space-y-3 w-full ${
            selectedFiles.length > 0 ? 'py-1 md:py-2' : ''
          }`}>
            {selectedFiles.length === 0 ? (
              // Empty state - Mobile optimized
              <>
                <div className="p-2 md:p-3 rounded-full bg-gray-100">
                  <CloudUpload className="w-5 h-5 md:w-6 md:h-6 text-gray-500" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium text-gray-700">
                    Drag & drop files
                  </p>
                  <p className="text-xs text-gray-500">
                    or tap to browse
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full max-w-[200px]"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select Files
                </Button>
              </>
            ) : (
              // When files are selected - Mobile compact
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full text-center sm:text-left">
                <div className="flex justify-center sm:justify-start">
                  <CloudUpload className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    Drag & drop to add more files
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    or tap to browse
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto mt-2 sm:mt-0 flex-shrink-0"
                  onClick={handleAddMore}
                >
                  Add Files
                </Button>
              </div>
            )}
          </div>
        </label>
      </div>

      {/* Selected Files List - Mobile optimized */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3 w-full">
          {/* Header with upload button - Stack on mobile */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="text-center sm:text-left min-w-0">
              <h4 className="text-sm font-medium truncate">
                {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
              </h4>
              <p className="text-xs text-muted-foreground truncate">
                Ready to upload
              </p>
            </div>
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 flex-shrink-0"
              size="sm"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              Upload{selectedFiles.length > 1 ? ` All` : ''}
            </Button>
          </div>

          {/* Files List - Scrollable on mobile */}
          <div className="space-y-2 max-h-48 md:max-h-64 overflow-y-auto w-full">
            {selectedFiles.map((fileWithPreview) => (
              <div
                key={fileWithPreview.id}
                className="flex items-center justify-between p-2 md:p-3 border rounded-lg bg-background hover:bg-accent/50 transition-colors w-full"
              >
                <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
                  {fileWithPreview.previewUrl ? (
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded border overflow-hidden flex-shrink-0">
                      <img
                        src={fileWithPreview.previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded border flex items-center justify-center bg-muted flex-shrink-0">
                      {getFileIcon(fileWithPreview.file.type)}
                    </div>
                  )}
                  
                  <div className="min-w-0 flex-1">
                    <p 
                      className="text-xs md:text-sm font-medium truncate"
                      title={fileWithPreview.file.name}
                    >
                      {truncateFileName(fileWithPreview.file.name)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(fileWithPreview.file.size)}
                    </p>
                  </div>
                </div>

                {!uploading && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(fileWithPreview.id)}
                    className="flex-shrink-0 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                  >
                    <X className="w-3 h-3 md:w-4 md:h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-3 p-2 w-full">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium truncate">Uploading files...</span>
            <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
          </div>
          <Progress value={50} />
        </div>
      )}

      {/* Upload Results - Mobile optimized */}
      {uploadResults.length > 0 && (
        <div className="space-y-3 w-full">
          <div className={`flex items-center space-x-2 p-3 rounded-lg ${
            isAllUploaded ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'
          }`}>
            {isAllUploaded ? (
              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
            )}
            <span className="text-sm font-medium truncate">
              {isAllUploaded ? 'All files uploaded!' : 'Some files failed'}
            </span>
          </div>

          <div className="space-y-2 max-h-48 md:max-h-64 overflow-y-auto w-full">
            {uploadResults.map((result, index) => (
              <div
                key={index}
                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg space-y-2 sm:space-y-0 w-full ${
                  result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {result.success ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p 
                      className="text-sm font-medium truncate"
                      title={result.fileName}
                    >
                      {truncateFileName(result.fileName)}
                    </p>
                    {result.success ? (
                      <p className="text-xs text-green-600 truncate">Uploaded successfully</p>
                    ) : (
                      <p 
                        className="text-xs text-red-600 truncate"
                        title={result.error}
                      >
                        {result.error}
                      </p>
                    )}
                  </div>
                </div>
                {result.success && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(result.url)}
                    className="w-full sm:w-auto text-xs mt-2 sm:mt-0 flex-shrink-0"
                  >
                    Copy URL
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Display - Mobile optimized */}
      {error && (
        <div className="flex items-start space-x-2 p-3 bg-red-50 text-red-700 rounded-lg w-full">
          <XCircle className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" />
          <span className="text-sm break-words flex-1">{error}</span>
        </div>
      )}
    </div>
  );
}