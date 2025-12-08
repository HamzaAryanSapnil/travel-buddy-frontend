import z from "zod";

export const createTravelPlanValidationSchema = z
  .object({
    title: z
      .string({
        message: "Title is required",
      })
      .min(3, {
        message: "Title must be at least 3 characters",
      })
      .max(200, {
        message: "Title cannot exceed 200 characters",
      }),
    destination: z.string({
      message: "Destination is required",
    }).min(1, {
      message: "Destination is required",
    }),
    origin: z.string().optional(),
    startDate: z.string({
      message: "Start date is required",
    }).refine(
      (date) => {
        if (!date) return false;
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate > today;
      },
      {
        message: "Start date must be a future date. Past dates are not allowed.",
      }
    ),
    endDate: z.string({
      message: "End date is required",
    }),
    travelType: z.enum(["SOLO", "COUPLE", "FAMILY", "FRIENDS", "GROUP"], {
      message: "Invalid travel type. Must be SOLO, COUPLE, FAMILY, FRIENDS, or GROUP.",
    }),
    budgetMin: z
      .number({
        message: "Minimum budget must be a number",
      })
      .positive({
        message: "Minimum budget must be a positive number",
      })
      .optional(),
    budgetMax: z
      .number({
        message: "Maximum budget must be a number",
      })
      .positive({
        message: "Maximum budget must be a positive number",
      })
      .optional(),
    visibility: z.enum(["PUBLIC", "PRIVATE", "UNLISTED"], {
      message: "Please select visibility",
    }),
    description: z
      .string()
      .max(2000, {
        message: "Description cannot exceed 2000 characters",
      })
      .optional(),
    coverPhoto: z.string().url().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      return endDate >= startDate;
    },
    {
      message: "End date must be greater than or equal to start date.",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      if (data.budgetMin && data.budgetMax) {
        return data.budgetMax > data.budgetMin;
      }
      return true;
    },
    {
      message: "Maximum budget must be greater than minimum budget.",
      path: ["budgetMax"],
    }
  );

