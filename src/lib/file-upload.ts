import { UPLOAD_LIMITS } from "./constants";

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate image file type and size
 */
export function validateImageFile(file: File): FileValidationResult {
  // Normalize file type (some systems use image/jpg instead of image/jpeg)
  const normalizedType = file.type.toLowerCase();
  const isJpeg = normalizedType === "image/jpeg" || normalizedType === "image/jpg";
  const normalizedFileType = isJpeg ? "image/jpeg" : normalizedType;

  // Check file type
  if (!UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES.includes(normalizedFileType as typeof UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES[number])) {
    // Also check by file extension as fallback
    const fileName = file.name.toLowerCase();
    const validExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".svg"];
    const hasValidExtension = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!hasValidExtension) {
      return {
        valid: false,
        error: "Please upload a valid image file (JPG, JPEG, PNG, WebP, GIF, BMP, or SVG)",
      };
    }
  }

  // Check file size (5MB max for cover photo)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File size must be less than 5MB",
    };
  }

  return { valid: true };
}

/**
 * Create image preview URL from file
 */
export function createImagePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revoke object URL to free memory
 */
export function revokeImagePreview(url: string): void {
  URL.revokeObjectURL(url);
}

/**
 * Format file size to human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

