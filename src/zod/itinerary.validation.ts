import { z } from "zod";

export const createItineraryItemSchema = z
  .object({
    planId: z.string().uuid({ message: "Invalid plan ID" }),
    dayIndex: z.coerce.number().min(1, { message: "Day must be at least 1" }),
    title: z
      .string()
      .min(3, { message: "Title must be at least 3 characters" })
      .max(200, { message: "Title must not exceed 200 characters" }),
    description: z
      .string()
      .max(2000, { message: "Description too long" })
      .optional(),
    startAt: z
      .string()
      .refine((val) => !val || !isNaN(new Date(val).getTime()), {
        message: "Invalid start date format",
      })
      .optional(),
    endAt: z
      .string()
      .refine((val) => !val || !isNaN(new Date(val).getTime()), {
        message: "Invalid end date format",
      })
      .optional(),
    locationId: z.string().uuid({ message: "Invalid location ID" }).optional(),
    order: z.coerce.number().min(0).optional(),
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
