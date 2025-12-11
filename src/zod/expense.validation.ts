import { z } from "zod";

const expenseSplitSchema = z.object({
  userId: z.string().uuid({ message: "Invalid user ID" }),
  amount: z.coerce.number().min(0.01, { message: "Amount must be at least 0.01" }),
});

export const createExpenseSchema = z
  .object({
    planId: z.string().uuid({ message: "Invalid plan ID" }),
    title: z
      .string()
      .min(3, { message: "Title must be at least 3 characters" })
      .max(200, { message: "Title must not exceed 200 characters" }),
    description: z
      .string()
      .max(1000, { message: "Description too long" })
      .optional(),
    amount: z.coerce
      .number()
      .min(0.01, { message: "Amount must be at least 0.01" }),
    category: z.enum(
      ["FOOD", "TRANSPORT", "ACCOMMODATION", "ACTIVITY", "SHOPPING", "OTHER"],
      { message: "Invalid category" }
    ),
    payerId: z.string().uuid({ message: "Invalid user ID" }),
    splitType: z.enum(["EQUAL", "CUSTOM"], { message: "Invalid split type" }),
    splits: z.array(expenseSplitSchema).optional(),
    expenseDate: z
      .string()
      .datetime({ message: "Expense date must be a valid ISO datetime" })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.splitType === "CUSTOM") {
        if (!data.splits || data.splits.length === 0) {
          return false;
        }
        const totalSplit = data.splits.reduce(
          (sum, split) => sum + split.amount,
          0
        );
        // Allow small rounding differences (0.01)
        return Math.abs(totalSplit - data.amount) < 0.02;
      }
      return true;
    },
    {
      message: "Sum of splits must equal total amount",
      path: ["splits"],
    }
  );

export const updateExpenseSchema = createExpenseSchema
  .partial()
  .omit({ planId: true });

