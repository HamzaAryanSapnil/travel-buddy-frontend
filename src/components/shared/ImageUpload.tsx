"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldLabel, FieldDescription } from "@/components/ui/field";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { validateImageFile, createImagePreview, revokeImagePreview, formatFileSize } from "@/lib/file-upload";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  maxSize?: number;
  accept?: string;
  label?: string;
  error?: string;
}

const ImageUpload = ({
  value,
  onChange,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = "image/jpeg,image/jpg,image/png,image/webp,image/gif,image/bmp,image/svg+xml,.jpg,.jpeg,.png,.webp,.gif,.bmp,.svg",
  label = "Cover Photo",
  error,
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    // Clear previous error
    setUploadError(null);

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || "Invalid file");
      return;
    }

    // Create preview
    if (previewUrlRef.current) {
      revokeImagePreview(previewUrlRef.current);
    }
    const previewUrl = createImagePreview(file);
    previewUrlRef.current = previewUrl;
    setPreview(previewUrl);

    // Update parent
    onChange(file);
  }, [onChange]);

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
            JPG, JPEG, PNG, WebP, GIF, BMP, SVG up to 5MB
          </p>
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

