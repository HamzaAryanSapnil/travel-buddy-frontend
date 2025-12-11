import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z
    .string({
      message: "Full name is required",
    })
    .min(2, {
      message: "Full name must be at least 2 characters",
    })
    .max(100, {
      message: "Full name cannot exceed 100 characters",
    })
    .optional(),
  bio: z
    .string({
      message: "Bio must be a string",
    })
    .max(500, {
      message: "Bio cannot exceed 500 characters",
    })
    .optional()
    .or(z.literal("")),
  location: z
    .string({
      message: "Location must be a string",
    })
    .max(100, {
      message: "Location cannot exceed 100 characters",
    })
    .optional()
    .or(z.literal("")),
  interests: z
    .array(z.string())
    .optional()
    .default([]),
  visitedCountries: z
    .array(z.string())
    .optional()
    .default([]),
});

