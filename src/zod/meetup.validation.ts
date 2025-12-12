import { z } from "zod";

export const createMeetupSchema = z
  .object({
    planId: z.string().uuid({ message: "Invalid plan ID" }),
    title: z
      .string()
      .min(3, { message: "Title must be at least 3 characters" })
      .max(200, { message: "Title must not exceed 200 characters" }),
    description: z
      .string()
      .max(2000, { message: "Description too long" })
      .optional(),
    location: z
      .string()
      .min(1, { message: "Location is required" })
      .max(500, { message: "Location must not exceed 500 characters" }),
    scheduledAt: z
      .string()
      .datetime({ message: "Scheduled date must be a valid ISO datetime" }),
    endAt: z
      .string()
      .datetime({ message: "End date must be a valid ISO datetime" })
      .optional(),
    videoRoomLink: z
      .string()
      .url({ message: "Invalid meeting link URL" })
      .optional()
      .or(z.literal("")), // Allow empty string
  })
  .refine(
    (data) => {
      if (data.endAt) {
        return new Date(data.endAt) >= new Date(data.scheduledAt);
      }
      return true;
    },
    {
      message: "End date must be after scheduled date",
      path: ["endAt"],
    }
  )
  .refine(
    (data) => {
      const scheduledDate = new Date(data.scheduledAt);
      const now = new Date();
      return scheduledDate > now;
    },
    {
      message: "Scheduled date must be in the future",
      path: ["scheduledAt"],
    }
  );

export const updateMeetupSchema = createMeetupSchema
  .partial()
  .omit({ planId: true })
  .extend({
    status: z.enum(["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED", "PENDING"], {
      message: "Invalid meetup status",
    }).optional(),
  })
  .refine(
    (data) => {
      // If scheduledAt is being updated and status is not COMPLETED/CANCELLED, check if it's in the future
      if (data.scheduledAt && data.status !== "COMPLETED" && data.status !== "CANCELLED") {
        const scheduledDate = new Date(data.scheduledAt);
        const now = new Date();
        return scheduledDate > now;
      }
      return true;
    },
    {
      message: "Scheduled date must be in the future",
      path: ["scheduledAt"],
    }
  )
  .refine(
    (data) => {
      // If both dates are provided, ensure endAt is after scheduledAt
      if (data.scheduledAt && data.endAt) {
        return new Date(data.endAt) >= new Date(data.scheduledAt);
      }
      return true;
    },
    {
      message: "End date must be after scheduled date",
      path: ["endAt"],
    }
  );

export const rsvpSchema = z.object({
  meetupId: z.string().uuid({ message: "Invalid meetup ID" }),
  status: z.enum(["ACCEPTED", "DECLINED", "PENDING", "MAYBE"], {
    message: "Invalid RSVP status",
  }),
});
