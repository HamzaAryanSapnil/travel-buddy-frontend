/* eslint-disable @typescript-eslint/no-explicit-any */
import z from "zod";

export const loginValidationZodSchema = z.object({
  email: z.string().email({
    message: "Valid email is required",
  }),
  password: z
    .string({
      message: "Password is required",
    })
    .min(6, {
      message: "Password is required and must be at least 6 characters long",
    })
    .max(100, {
      message: "Password must be at most 100 characters long",
    }),
});

export const registerValidationZodSchema = z
  .object({
    fullName: z
      .string({
        message: "Full name is required",
      })
      .min(2, {
        message: "Full name must be at least 2 characters",
      })
      .max(100, {
        message: "Full name cannot exceed 100 characters",
      }),
    email: z.string().email({
      message: "Valid email is required",
    }),
    password: z
      .string({
        message: "Password is required",
      })
      .min(8, {
        message: "Password must be at least 8 characters long",
      })
      .max(100, {
        message: "Password must be at most 100 characters long",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least 1 uppercase letter",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least 1 number",
      })
      .regex(/[!@#$%^&*]/, {
        message: "Password must contain at least 1 special character",
      }),
    confirmPassword: z
      .string({
        message: "Confirm password is required",
      })
      .min(8, {
        message: "Confirm password must be at least 8 characters long",
      }),
  })
  .refine((data: any) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

