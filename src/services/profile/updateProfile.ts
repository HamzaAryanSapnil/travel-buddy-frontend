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
        ? typeof interestsStr === "string"
          ? JSON.parse(interestsStr)
          : []
        : [],
      visitedCountries: visitedCountriesStr
        ? typeof visitedCountriesStr === "string"
          ? JSON.parse(visitedCountriesStr)
          : []
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

    if (!validatedPayload || typeof validatedPayload !== "object") {
      return {
        success: false,
        message: "Invalid profile data",
      };
    }

    // Prepare update data (profile image is handled separately via /users/me/photo)
    const updateData: any = {};

    if (validatedPayload.fullName) {
      updateData.fullName = validatedPayload.fullName;
    }
    if (validatedPayload.bio !== undefined) {
      updateData.bio = validatedPayload.bio;
    }
    if (validatedPayload.location !== undefined) {
      updateData.location = validatedPayload.location;
    }
    if (validatedPayload.interests) {
      updateData.interests = validatedPayload.interests;
    }
    if (validatedPayload.visitedCountries) {
      updateData.visitedCountries = validatedPayload.visitedCountries;
    }

    // Send request to API with JSON body
    const response = await serverFetch.patch("/users/me", {
      body: JSON.stringify(updateData),
      headers: {
        "Content-Type": "application/json",
      },
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
