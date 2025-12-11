import { z } from "zod";

export const sendMessageSchema = z.object({
  message: z
    .string()
    .min(3, { message: "Message must be at least 3 characters" })
    .max(1000, { message: "Message must not exceed 1000 characters" }),
  sessionId: z.string().uuid({ message: "Invalid session ID" }).optional(),
  answer: z.string().optional(), // For step answers
  uiStep: z
    .enum([
      "destination",
      "groupSize",
      "budget",
      "tripDuration",
      "interests",
      "specialRequirements",
      "Final",
    ])
    .optional(),
});

export const createSessionSchema = z.object({
  planId: z.string().uuid({ message: "Invalid plan ID" }).optional(),
});

export const addStepSchema = z.object({
  sessionId: z.string().uuid({ message: "Invalid session ID" }),
  question: z.string(),
  answer: z.string().min(1, { message: "Answer is required" }),
  uiStep: z.enum([
    "destination",
    "groupSize",
    "budget",
    "tripDuration",
    "interests",
    "specialRequirements",
    "Final",
  ]),
});

export const completeSessionSchema = z.object({
  sessionId: z.string().uuid({ message: "Invalid session ID" }),
  finalOutput: z.object({
    title: z.string().min(3).max(200),
    destination: z.string().min(1),
    origin: z.string().optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    travelType: z.enum(["SOLO", "COUPLE", "FAMILY", "FRIENDS", "GROUP"]),
    budgetMin: z.number().min(0),
    budgetMax: z.number().min(0).optional(),
    description: z.string().optional(),
    estimatedCost: z.number().optional(),
  }),
});

