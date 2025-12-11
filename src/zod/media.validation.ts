import { z } from "zod";

export const uploadMediaSchema = z.object({
  planId: z.string().uuid({ message: "Invalid plan ID" }),
  files: z
    .array(z.instanceof(File))
    .min(1, { message: "At least one file is required" })
    .max(10, { message: "Maximum 10 files allowed" }),
});

