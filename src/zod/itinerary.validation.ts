import { z } from "zod";

export const createItineraryItemSchema = z
  .object({
    planId: z.string(),
    dayIndex: z.coerce
      .number({ message: "Day index must be a number" })
      .int({ message: "Day index must be an integer" })
      .min(1, { message: "Day must be at least 1" }),
    title: z
      .string()
      .min(3, { message: "Title must be at least 3 characters" })
      .max(200, { message: "Title must not exceed 200 characters" }),
    description: z
      .string()
      .max(2000, { message: "Description too long" })
      .optional(),
    startAt: z.iso
      .datetime({ message: "Start time must be a valid ISO datetime" })
      .optional(),
    endAt: z.iso
      .datetime({ message: "Start time must be a valid ISO datetime" })
      .optional(),
    locationId: z.uuid({ message: "Invalid location ID" }).optional(),
    order: z.coerce
      .number({ message: "Order must be a number" })
      .int({ message: "Order must be an integer" })
      .nonnegative({ message: "Order must be >= 0" })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.startAt && data.endAt) {
        return new Date(data.endAt) >= new Date(data.startAt);
      }
      return true;
    },
    {
      message: "End time must be after start time",
      path: ["endAt"],
    }
  );

export const updateItineraryItemSchema = createItineraryItemSchema
  .partial()
  .omit({ planId: true });
