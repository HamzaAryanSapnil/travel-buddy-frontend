"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldLabel, FieldDescription } from "@/components/ui/field";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { validateImageFile, createImagePreview, revokeImagePreview, formatFileSize } from "@/lib/file-upload";
import { uploadToImgBB } from "@/lib/imgbb";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  maxSize?: number;
  accept?: string;
  label?: string;
  error?: string;
  autoUpload?: boolean; // If true, automatically upload to imgBB when file is selected
  onUpload?: (url: string) => void; // Callback with imgBB URL after upload
  onUploadError?: (error: string) => void; // Callback if upload fails
}

const ImageUpload = ({
  value,
  onChange,
  maxSize = 32 * 1024 * 1024, // 32MB default (imgBB free tier)
  accept = "image/jpeg,image/jpg,image/png,image/webp,image/gif,image/bmp,image/svg+xml,.jpg,.jpeg,.png,.webp,.gif,.bmp,.svg",
  label = "Cover Photo",
  error,
  autoUpload = false,
  onUpload,
  onUploadError,
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    // Clear previous error
    setUploadError(null);

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      const errorMsg = validation.error || "Invalid file";
      setUploadError(errorMsg);
      onUploadError?.(errorMsg);
      return;
    }

    // Create preview
    if (previewUrlRef.current) {
      revokeImagePreview(previewUrlRef.current);
    }
    const previewUrl = createImagePreview(file);
    previewUrlRef.current = previewUrl;
    setPreview(previewUrl);

    // Update parent with file
    onChange(file);

    // Auto-upload to imgBB if enabled
    if (autoUpload && onUpload) {
      setIsUploading(true);
      try {
        const imageUrl = await uploadToImgBB(file);
        onUpload(imageUrl);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Failed to upload image";
        setUploadError(errorMsg);
        onUploadError?.(errorMsg);
      } finally {
        setIsUploading(false);
      }
    }
  }, [onChange, autoUpload, onUpload, onUploadError]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleRemove = () => {
    if (previewUrlRef.current) {
      revokeImagePreview(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreview(null);
    setUploadError(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }  
  };

  const displayError = error || uploadError;

  return (
    <div className="w-full">
      {/* {label && <FieldLabel>{label}</FieldLabel>} */}
      
      {preview ? (
        <div className="relative w-full">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {value && (
            <p className="mt-2 text-xs text-muted-foreground">
              {value.name} ({formatFileSize(value.size)})
            </p>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
            displayError
              ? "border-destructive bg-destructive/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
          />
          <ImageIcon className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="mb-2 text-sm font-medium">Drag and drop an image</p>
          <p className="mb-4 text-xs text-muted-foreground">or</p>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            Choose File
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            JPG, JPEG, PNG, WebP, GIF, BMP, SVG up to 32MB
          </p>
          {isUploading && (
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Uploading to imgBB...</span>
            </div>
          )}
        </div>
      )}

      {displayError && (
        <FieldDescription className="mt-2 text-destructive">
          {displayError}
        </FieldDescription>
      )}
    </div>
  );
};

export default ImageUpload;

