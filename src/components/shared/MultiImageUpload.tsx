"use client";

import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FieldDescription, FieldLabel } from "@/components/ui/field";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { validateImageFile, createImagePreview, revokeImagePreview, formatFileSize } from "@/lib/file-upload";
import { cn } from "@/lib/utils";

interface MultiImageUploadProps {
  value?: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // per file
  accept?: string;
  label?: string;
  error?: string;
}

const MultiImageUpload = ({
  value = [],
  onChange,
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024,
  accept = "image/jpeg,image/jpg,image/png,image/webp,image/gif,image/bmp,image/svg+xml,image/tiff,image/heic,image/heif,image/x-icon,.jpg,.jpeg,.png,.webp,.gif,.bmp,.svg,.tiff,.heic,.heif,.ico",
  label = "Cover Photo & Gallery Images",
  error,
}: MultiImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const cleanupPreviews = () => {
    previews.forEach((url) => revokeImagePreview(url));
  };

  const setFilesWithPreview = useCallback(
    (files: File[]) => {
      cleanupPreviews();
      const previewUrls = files.map((file) => createImagePreview(file));
      setPreviews(previewUrls);
      onChange(files);
    },
    [onChange, previews]
  );

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      const incoming = Array.from(fileList);
      const totalCount = value.length + incoming.length;
      if (totalCount > maxFiles) {
        setUploadError(`You can upload up to ${maxFiles} images. Currently selected: ${value.length}.`);
        return;
      }

      const next: File[] = [...value];
      for (const file of incoming) {
        // size validation
        if (file.size > maxSize) {
          setUploadError(`"${file.name}" exceeds ${(maxSize / (1024 * 1024)).toFixed(0)}MB limit.`);
          return;
        }
        const validation = validateImageFile(file);
        if (!validation.valid) {
          setUploadError(validation.error || "Invalid file type.");
          return;
        }
        next.push(file);
      }
      setUploadError(null);
      setFilesWithPreview(next);
    },
    [maxFiles, maxSize, setFilesWithPreview, value]
  );

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleRemove = (index: number) => {
    const next = value.filter((_, i) => i !== index);
    const nextPreviews = previews.filter((_, i) => i !== index);
    if (previews[index]) revokeImagePreview(previews[index]);
    setPreviews(nextPreviews);
    onChange(next);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const displayError = error || uploadError;

  return (
    <div className="w-full">
      {label && <FieldLabel>{label}</FieldLabel>}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
          displayError ? "border-destructive bg-destructive/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          id="multi-image-upload"
        />
        <ImageIcon className="mb-3 h-10 w-10 text-muted-foreground" />
        <p className="mb-1 text-sm font-medium">Drag and drop images</p>
        <p className="mb-3 text-xs text-muted-foreground">or</p>
        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
          <Upload className="mr-2 h-4 w-4" />
          Choose Files
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          Up to {maxFiles} images, {formatFileSize(maxSize)} each
        </p>
      </div>

      {value.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {value.map((file, idx) => (
            <div key={`${file.name}-${idx}`} className="relative rounded-lg border overflow-hidden">
              {previews[idx] ? (
                <img src={previews[idx]} alt={file.name} className="h-32 w-full object-cover" />
              ) : (
                <div className="flex h-32 items-center justify-center bg-muted text-xs text-muted-foreground">Preview</div>
              )}
              <div className="flex items-center justify-between px-2 py-1 text-xs text-muted-foreground">
                <span className="line-clamp-1">{file.name}</span>
                <span>{formatFileSize(file.size)}</span>
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-1 top-1 h-7 w-7"
                onClick={() => handleRemove(idx)}
              >
                <X className="h-4 w-4" />
              </Button>
              {idx === 0 && (
                <span className="absolute left-1 top-1 rounded bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <FieldDescription className="mt-2">
        {value.length > 0
          ? `${value.length} file${value.length > 1 ? "s" : ""} selected. First file will be the cover photo.`
          : "First file becomes the cover photo; others go to gallery."}
      </FieldDescription>

      {displayError && (
        <FieldDescription className="mt-2 text-destructive">
          {displayError}
        </FieldDescription>
      )}
    </div>
  );
};

export default MultiImageUpload;

