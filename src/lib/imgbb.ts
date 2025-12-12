/**
 * imgBB Image Upload Utility
 * 
 * Client-side utility for uploading images to imgBB.
 * This must be used in client components only (browser API).
 */

export interface ImgBBUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload a single image file to imgBB
 * @param file - The image file to upload
 * @returns Promise resolving to the image URL or error
 */
export async function uploadToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error(
      "imgBB API key is not configured. Please set NEXT_PUBLIC_IMGBB_API_KEY in your environment variables."
    );
  }

  // Create FormData for imgBB API
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      const errorMessage =
        data.error?.message ||
        data.error ||
        `Image upload failed: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    if (!data.data?.url) {
      throw new Error("Image upload succeeded but no URL was returned");
    }

    return data.data.url;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to upload image to imgBB");
  }
}

/**
 * Upload multiple images to imgBB in parallel
 * @param files - Array of image files to upload
 * @returns Promise resolving to array of image URLs (in same order as input)
 */
export async function uploadMultipleToImgBB(
  files: File[]
): Promise<string[]> {
  try {
    const uploadPromises = files.map((file) => uploadToImgBB(file));
    const urls = await Promise.all(uploadPromises);
    console.log("Uploaded images to imgBB from uploadMultipleToImgBB: ", urls);
    return urls;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to upload images to imgBB");
  }
}

