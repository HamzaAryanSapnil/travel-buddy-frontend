"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { updateProfileSchema } from "@/zod/user.validation";
import { revalidateTag } from "next/cache";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const updateProfile = async (
  _currentState: any,
  formData: FormData
): Promise<any> => {
  try {
    // Parse interests and visitedCountries from FormData
    const interestsStr = formData.get("interests");
    const visitedCountriesStr = formData.get("visitedCountries");

    const payload: any = {
      fullName: formData.get("fullName") || undefined,
      bio: formData.get("bio") || undefined,
      location: formData.get("location") || undefined,
      interests: interestsStr
        ? (typeof interestsStr === "string"
            ? JSON.parse(interestsStr)
            : [])
        : [],
      visitedCountries: visitedCountriesStr
        ? (typeof visitedCountriesStr === "string"
            ? JSON.parse(visitedCountriesStr)
            : [])
        : [],
    };

    // Remove undefined and empty string values
    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined || payload[key] === "") {
        delete payload[key];
      }
    });

    // Validate using Zod
    const validationResult = zodValidator(payload, updateProfileSchema);

    if (!validationResult.success) {
      return validationResult;
    }

    const validatedPayload = validationResult.data;

    // Create FormData for multipart upload (for image)
    const outgoing = new FormData();
    if (typeof validatedPayload === "object" && validatedPayload !== null) {
      Object.entries(validatedPayload).forEach(([key, value]) => {
        if (key === "interests" || key === "visitedCountries") {
          // Stringify arrays
          outgoing.append(key, JSON.stringify(value));
        } else {
          outgoing.append(key, String(value));
        }
      });
    }

    // Handle profile image upload
    const profileImage = formData.get("profileImage");
    if (profileImage && profileImage instanceof File) {
      outgoing.append("profileImage", profileImage);
    }

    // Send request to API
    const response = await serverFetch.patch("/auth/profile", {
      body: outgoing,
      // No explicit Content-Type; fetch will set multipart boundary
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle 401 - unauthorized
      if (response.status === 401) {
        return {
          success: false,
          message: "Please log in to update your profile",
        };
      }

      // Handle 403 - forbidden
      if (response.status === 403) {
        return {
          success: false,
          message: "You don't have permission to update this profile",
        };
      }

      // Handle validation errors
      if (data.errors && Array.isArray(data.errors)) {
        return {
          success: false,
          message: data.message || "Failed to update profile",
          errors: data.errors,
        };
      }

      // Ensure message is always a string
      const errorMessage =
        typeof data.message === "string"
          ? data.message
          : data.message && typeof data.message === "object"
          ? JSON.stringify(data.message)
          : "Failed to update profile";

      return {
        success: false,
        message: errorMessage,
      };
    }

    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("user-info");

    // Ensure message is always a string
    const message =
      typeof data.message === "string"
        ? data.message
        : data.message && typeof data.message === "object"
        ? JSON.stringify(data.message)
        : "Profile updated successfully";

    return {
      success: true,
      message: message,
      data: data.data,
    };
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT errors if any
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Update profile error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message || "Failed to update profile"
          : "Failed to update profile. Please try again.",
    };
  }
};

