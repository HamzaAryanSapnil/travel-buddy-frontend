import { z } from "zod";

export const inviteMemberSchema = z.object({
  email: z
    .string({
      message: "Email is required",
    })
    .email("Invalid email address"),
  role: z.enum(["ADMIN", "EDITOR", "VIEWER"], {
    message: "Role is required",
  }),
});

