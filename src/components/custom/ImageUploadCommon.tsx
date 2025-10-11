"use client";
import React, { useState, useRef, useEffect } from "react";
import { IKUpload } from "imagekitio-next";
import { Loader2, ImageIcon, CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
    onSuccess?: (url: string) => void;
    value?: string;
    onChange?: (url: string) => void;
    name?: string;
    uploadService?: "imagekit" | "minio";
    folder?: string
}

export default function FileUpload({
    onSuccess = () => { },
    value = "",
    onChange,
    name,
    uploadService = "imagekit",
    folder = "products"
}: FileUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const ikUploadRef = useRef<any>(null);

    // Handle preview URLs
    useEffect(() => {
        if (selectedFile) {
            const url = URL.createObjectURL(selectedFile);
            setLocalPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setLocalPreviewUrl(null);
        }
    }, [selectedFile]);

    // Clear selection when external value changes
    useEffect(() => {
        if (value) {
            setSelectedFile(null);
        }
    }, [value]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!validTypes.includes(file.type)) {
            setError("Only JPG, PNG, and WebP images are supported");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("Image must be smaller than 5MB");
            return;
        }

        setError(null);
        setSelectedFile(file);
    };

    const handleImageKitUpload = () => {
        if (!selectedFile || !ikUploadRef.current) return;

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(selectedFile);

        const fileInput = ikUploadRef.current.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.files = dataTransfer.files;
            const changeEvent = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(changeEvent);
            setUploading(true);
        }
    };

    const handleMinIOUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("folder", folder);
            const response = await fetch("/api/upload/minio", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Upload failed");
            }

            handleUploadSuccess(result.url);
        } catch (err: any) {
            setUploading(false);
            setError(err.message || "Upload failed");
        }
    };

    const handleUpload = () => {
        if (!selectedFile) return;

        if (uploadService === "imagekit") {
            handleImageKitUpload();
        } else {
            handleMinIOUpload();
        }
    };

    const handleUploadSuccess = (url: string) => {
        setUploading(false);
        setError(null);
        setSelectedFile(null);
        onChange?.(url);
        onSuccess(url);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleIKSuccess = (response: any) => {
        handleUploadSuccess(response.url);
    };

    const handleIKError = (err: any) => {
        setUploading(false);
        setError(err.message || "Upload failed");
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Determine which preview to show
    const showPreviewUrl = selectedFile ? localPreviewUrl : value;

    return (
        <div className="space-y-4">
            <div className="relative group">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    id={`file-input-${name}`}
                    name={`${name}`}
                />
                {/* Only render ImageKit uploader when using ImageKit service */}
                {uploadService === "imagekit" && (
                    <div ref={ikUploadRef}>
                        <IKUpload
                            fileName={`image-${Date.now()}`}
                            useUniqueFileName={true}
                            folder={`/${folder}`}
                            onError={handleIKError}
                            onSuccess={handleIKSuccess}
                            onUploadStart={() => setUploading(true)}
                            className="hidden"
                        />
                    </div>
                )}

                <label
                    htmlFor={`file-input-${name}`}
                    className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all 
            ${error ? "border-red-500 bg-red-50" : showPreviewUrl ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-primary bg-gray-50"}`}
                >
                    {uploading ? (
                        <div className="flex flex-col items-center justify-center space-y-2 p-6">
                            <Loader2 className="animate-spin w-8 h-8 text-primary" />
                            <span className="text-sm font-medium text-gray-600">
                                Uploading...
                            </span>
                        </div>
                    ) : showPreviewUrl ? (
                        <div className="flex flex-col items-center justify-center space-y-2 p-4 w-full h-full">
                            <div className="relative w-full h-32">
                                <Image
                                    unoptimized
                                    fill
                                    src={showPreviewUrl || ""}
                                    alt="Preview"
                                    className="object-contain w-full h-full rounded-md"
                                />
                            </div>

                            {selectedFile ? (
                                <div className="flex space-x-2 mt-2">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleUpload();
                                        }}
                                        className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                                    >
                                        Upload
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleCancel();
                                        }}
                                        className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center text-green-600">
                                    <CheckCircle2 className="w-5 h-5 mr-1" />
                                    <span className="text-sm font-medium">Upload Successful</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center space-y-3 p-6">
                            <div className="p-3 rounded-full bg-gray-100">
                                <ImageIcon className="w-8 h-8 text-gray-500" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-700">Upload an image</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    JPG, PNG, or WebP (Max 5MB)
                                </p>
                                <p className="text-xs text-blue-500 mt-1">
                                    Using {uploadService} service
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    fileInputRef.current?.click();
                                }}
                                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
                            >
                                Select File
                            </button>
                        </div>
                    )}
                </label>
            </div>

            {error && (
                <div className="flex items-center text-red-600 text-sm p-3 bg-red-50 rounded-md">
                    <XCircle className="w-5 h-5 mr-2" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}