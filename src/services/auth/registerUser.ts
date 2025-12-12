/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { registerValidationZodSchema } from "@/zod/auth.validation";
import { loginUser } from "./loginUser";

export const registerUser = async (
  _currentState: any,
  formData: any
): Promise<any> => {
  try {
    const payload = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    if (zodValidator(payload, registerValidationZodSchema).success === false) {
      return zodValidator(payload, registerValidationZodSchema);
    }

    const validatedPayload: any = zodValidator(
      payload,
      registerValidationZodSchema
    ).data;

    // Prepare register data - fullName is now required
    const registerData: any = {
      email: validatedPayload.email,
      password: validatedPayload.password,
      fullName: validatedPayload.fullName,
    };

    const res = await serverFetch.post("/auth/register", {
      body: JSON.stringify(registerData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    // Handle duplicate email error (409 Conflict)
    if (res.status === 409) {
      return {
        success: false,
        message:
          "This email is already registered. Please use a different email or try logging in.",
        errors: [
          {
            field: "email",
            message: "This email is already registered",
          },
        ],
      };
    }

    // Handle other API errors
    if (!result.success) {
      return {
        success: false,
        message: result.message || "Registration failed. Please try again.",
      };
    }

    // Auto-login after successful registration
    if (result.success) {
      await loginUser(_currentState, formData);
    }

    return result;
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT errors so Next.js can handle them
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.log(error);
    return {
      success: false,
      message: `${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Registration Failed. Please try again."
      }`,
    };
  }
};
