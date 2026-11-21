"use server";

import { z } from "zod";
import { zodValidator } from "@/lib/zodValidator";

// Contact form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});


export const submitContactForm = async (
  _currentState: unknown,
  formData: FormData
): Promise<ActionResponse<unknown> & { errors?: unknown }> => {
  try {
    const payload = {
      name: formData.get("name")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      subject: formData.get("subject")?.toString() || "",
      message: formData.get("message")?.toString() || "",
    };

    // Validate using Zod
    const validationResult = zodValidator(payload, contactFormSchema);

    if (!validationResult.success) {
      return validationResult;
    }

    // In a real application, you would send this to your backend API
    // For now, we'll simulate a successful submission
    // TODO: Implement actual backend API call
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      message: "Your message has been sent successfully! We'll get back to you soon.",
      errors: null,
    };
  } catch (error: unknown) {
    console.error("Contact form submission error:", error);
    return {
      success: false,
      message: "Failed to send message. Please try again later.",
      errors: null,
    };
  }
};
