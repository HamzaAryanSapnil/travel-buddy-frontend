import { z } from "zod";

export const createSubscriptionSchema = z.object({
  planType: z.enum(["MONTHLY", "YEARLY"], {
    message: "Invalid plan type",
  }),
});

export const updateSubscriptionSchema = z.object({
  cancelAtPeriodEnd: z.boolean().optional(),
});

