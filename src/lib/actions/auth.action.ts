"use server";

import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { parse } from "cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { loginValidationZodSchema, registerValidationZodSchema } from "@/zod/auth.validation";
import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
  UserRole,
} from "@/lib/auth-utils";
import { verifyAccessToken } from "@/lib/jwtHandlers";
import { toInputErrorState } from "@/lib/getInputFieldError";

type ParsedCookie = ReturnType<typeof parse>;

function lastParsedCookie(headers: string[], name: string): ParsedCookie | null {
  let found: ParsedCookie | null = null;
  for (const header of headers) {
    const parsed = parse(header);
    if (parsed[name]) {
      found = parsed;
    }
  }
  return found;
}

function cookieMaxAge(value: string | undefined, fallback: number): number {
  if (typeof value !== "string") return fallback;
  return parseInt(value, 10) || fallback;
}

function cookieSameSite(value: string | undefined): "lax" | "strict" | "none" {
  if (value === "lax" || value === "strict" || value === "none") return value;
  if (value === "Lax" || value === "Strict" || value === "None") {
    return value.toLowerCase() as "lax" | "strict" | "none";
  }
  return "none";
}

export const setCookie = async (
  key: string,
  value: string,
  options: Partial<ResponseCookie>
) => {
  const cookieStore = await cookies();
  cookieStore.set(key, value, options);
};

export const getCookie = async (key: string) => {
  const cookieStore = await cookies();
  return cookieStore.get(key)?.value || null;
};

export const deleteCookie = async (key: string) => {
  const cookieStore = await cookies();
  cookieStore.delete(key);
};

type FieldErrors = { field: string; message: string }[];
type AuthFormState = ActionResponse<unknown> & { errors: FieldErrors };

/**
 * Get new access token using refresh token
 * This function handles automatic token refresh
 */
export async function getNewAccessToken() {
  try {
    const accessToken = await getCookie("accessToken");
    const refreshToken = await getCookie("refreshToken");

    // Case 1: Both tokens are missing - user is logged out
    if (!accessToken && !refreshToken) {
      return {
        tokenRefreshed: false,
      };
    }

    // Case 2 : Access Token exist- and need to verify
    if (accessToken) {
        const verifiedToken = await verifyAccessToken(accessToken);

        if (verifiedToken.success) {
            return {
                tokenRefreshed: false,
            }
        }
    }

    //Case 3 : refresh Token is missing- user is logged out
    if (!refreshToken) {
        return {
            tokenRefreshed: false,
        }
    }

    //Case 4: Access Token is invalid/expired- try to get a new one using refresh token
    // This is the only case we need to call the API

    // Now we know: accessToken is invalid/missing AND refreshToken exists
    // Safe to call the API

    // API Call - serverFetch will skip getNewAccessToken for /auth/refresh-token endpoint
    const response = await serverFetch.post("/auth/refresh-token", {
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    const result = await response.json();

    console.log("access token refreshed!!");

    const setCookieHeaders = response.headers.getSetCookie();

    if (!setCookieHeaders || setCookieHeaders.length === 0) {
        throw new Error("No Set-Cookie header found");
    }

    const accessTokenObject = lastParsedCookie(setCookieHeaders, "accessToken");
    const refreshTokenObject = lastParsedCookie(setCookieHeaders, "refreshToken");

    if (!accessTokenObject?.accessToken) {
        throw new Error("Tokens not found in cookies");
    }

    if (!refreshTokenObject?.refreshToken) {
        throw new Error("Tokens not found in cookies");
    }

    await deleteCookie("accessToken");
    await setCookie("accessToken", accessTokenObject.accessToken, {
        secure: true,
        httpOnly: true,
        maxAge: cookieMaxAge(accessTokenObject["Max-Age"], 1000 * 60 * 60),
        path: accessTokenObject.Path || "/",
        sameSite: cookieSameSite(accessTokenObject["SameSite"]),
    });

    await deleteCookie("refreshToken");
    await setCookie("refreshToken", refreshTokenObject.refreshToken, {
        secure: true,
        httpOnly: true,
        maxAge: cookieMaxAge(
          refreshTokenObject["Max-Age"],
          1000 * 60 * 60 * 24 * 90
        ),
        path: refreshTokenObject.Path || "/",
        sameSite: cookieSameSite(refreshTokenObject["SameSite"]),
    });

    if (!result.success) {
        throw new Error(result.message || "Token refresh failed");
    }


    return {
        tokenRefreshed: true,
        success: true,
        message: "Token refreshed successfully"
    };


} catch (error: unknown) {
    return {
        tokenRefreshed: false,
        success: false,
        message: (error instanceof Error ? error.message : undefined) || "Something went wrong",
    };
}
}

export const loginUser = async (
  _currentState: unknown,
  formData: FormData
): Promise<AuthFormState> => {
  try {
    const redirectTo = formData.get("redirect") || null;
    const payload = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const validation = zodValidator(payload, loginValidationZodSchema);
    if (validation.success === false) {
      return {
        success: false,
        errors: toInputErrorState(validation).errors,
      };
    }

    const validatedPayload = validation.data;

    const res = await serverFetch.post("/auth/login", {
      body: JSON.stringify(validatedPayload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        errors: [],
        message: result.message || "Login failed",
      };
    }

    const setCookieHeaders = res.headers.getSetCookie();

    if (!setCookieHeaders || setCookieHeaders.length === 0) {
      return {
        success: false,
        errors: [],
        message: result.message || "Login failed",
      };
    }

    const accessTokenObject = lastParsedCookie(setCookieHeaders, "accessToken");
    const refreshTokenObject = lastParsedCookie(setCookieHeaders, "refreshToken");

    if (!accessTokenObject?.accessToken) {
      throw new Error("Tokens not found in cookies");
    }

    if (!refreshTokenObject?.refreshToken) {
      throw new Error("Tokens not found in cookies");
    }

    await setCookie("accessToken", accessTokenObject.accessToken, {
      secure: true,
      httpOnly: true,
      maxAge: cookieMaxAge(accessTokenObject["Max-Age"], 1000 * 60 * 60),
      path: accessTokenObject.Path || "/",
      sameSite: cookieSameSite(accessTokenObject["SameSite"]),
    });

    await setCookie("refreshToken", refreshTokenObject.refreshToken, {
      secure: true,
      httpOnly: true,
      maxAge: cookieMaxAge(
        refreshTokenObject["Max-Age"],
        1000 * 60 * 60 * 24 * 90
      ),
      path: refreshTokenObject.Path || "/",
      sameSite: cookieSameSite(refreshTokenObject["SameSite"]),
    });

    const verifiedToken: JwtPayload | string = jwt.verify(
      accessTokenObject.accessToken,
      process.env.JWT_SECRET as string
    );

    if (typeof verifiedToken === "string") {
      throw new Error("Invalid token");
    }

    const userRole: UserRole = verifiedToken.role;

    if (!result.success) {
      throw new Error(result.message || "Login failed");
    }

    revalidatePath("/", "layout"); 
    revalidatePath("/dashboard");

    if (redirectTo && result.data.needPasswordChange) {
      const requestedPath = redirectTo.toString();
      if (isValidRedirectForRole(requestedPath, userRole)) {
        redirect(`/reset-password?redirect=${requestedPath}`);
      } else {
        redirect("/reset-password");
      }
    }

    if (result.data.needPasswordChange) {
      redirect("/reset-password");
    }

    if (redirectTo) {
      const requestedPath = redirectTo.toString();
      if (isValidRedirectForRole(requestedPath, userRole)) {
        redirect(`${requestedPath}?loggedIn=true`);
      } else {
        redirect(`${getDefaultDashboardRoute(userRole)}?loggedIn=true`);
      }
    } else {
      redirect(`${getDefaultDashboardRoute(userRole)}?loggedIn=true`);
    }
  } catch (error: unknown) {
    // Re-throw NEXT_REDIRECT errors so Next.js can handle them
    if (
        typeof error === "object" &&
        error !== null &&
        "digest" in error &&
        typeof (error as { digest?: unknown }).digest === "string" &&
        (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
      ) {
        throw error;
      }
    console.log(error);
    return {
      success: false,
      errors: [],
      message: `${
        process.env.NODE_ENV === "development"
          ? (error instanceof Error ? error.message : undefined)
          : "Login Failed. You might have entered incorrect email or password."
      }`,
    };
  }
};

export const registerUser = async (
  _currentState: unknown,
  formData: FormData
): Promise<AuthFormState> => {
  try {
    const payload = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    const validation = zodValidator(payload, registerValidationZodSchema);
    if (validation.success === false) {
      return {
        success: false,
        errors: toInputErrorState(validation).errors,
      };
    }

    const validatedPayload = validation.data;
    if (!validatedPayload || typeof validatedPayload !== "object") {
      return {
        success: false,
        errors: [],
        message: "Invalid registration data",
      };
    }

    // Prepare register data - fullName is now required
    const registerData: Record<string, unknown> = {
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
        errors: toInputErrorState(result).errors,
        message: result.message || "Registration failed. Please try again.",
      };
    }

    // Auto-login after successful registration
    if (result.success) {
      await loginUser(_currentState, formData);
    }

    return {
      success: true,
      errors: [],
      message: typeof result.message === "string" ? result.message : undefined,
      data: result.data,
    };
  } catch (error: unknown) {
    // Re-throw NEXT_REDIRECT errors so Next.js can handle them
    if (
        typeof error === "object" &&
        error !== null &&
        "digest" in error &&
        typeof (error as { digest?: unknown }).digest === "string" &&
        (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
      ) {
        throw error;
      }
    console.log(error);
    return {
      success: false,
      errors: [],
      message: `${
        process.env.NODE_ENV === "development"
          ? (error instanceof Error ? error.message : undefined)
          : "Registration Failed. Please try again."
      }`,
    };
  }
};

/**
 * Logout user by deleting authentication cookies
 * @returns Promise that resolves when cookies are deleted
 */
export async function logoutUser(): Promise<{ success: boolean; message?: string }> {
  try {
    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");

    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error: unknown) {
    console.error("Logout error:", error);
    return {
      success: false,
      message: (error instanceof Error ? error.message : undefined) || "Failed to logout",
    };
  }
}

export const getUserInfo = async (): Promise<UserInfo> => {
    try {
        const response = await serverFetch.get("/auth/me", {
            cache: "force-cache",
            next: { tags: ["user-info"] }
        })

        const result = await response.json();

        if (result.success && result.data) {
            const accessToken = await getCookie("accessToken");

            if (!accessToken) {
                throw new Error("No access token found");
            }

            const verifiedToken = jwt.verify(accessToken, process.env.JWT_SECRET as string) as JwtPayload;

            const userInfo: UserInfo = {
                id: result?.data?.id || verifiedToken.userId || "",
                name: result?.data?.fullName || result.data.name || verifiedToken.name || "Unknown User",
                email: result?.data?.email || verifiedToken.email || "",
                role: result?.data?.role || verifiedToken.role || "USER",
                profileImage: result?.data?.profileImage,
                fullName: result?.data?.fullName,
                bio: result?.data?.bio,
                location: result?.data?.location,
                interests: result?.data?.interests,
                visitedCountries: result?.data?.visitedCountries,
                isVerified: result?.data?.isVerified,
                status: result?.data?.status,
                createdAt: result.data.createdAt,
                updatedAt: result.data.updatedAt,
            };

       
            return userInfo;
        }

        // Fallback if API call fails
        const accessToken = await getCookie("accessToken");
        if (accessToken) {
            const verifiedToken = jwt.verify(accessToken, process.env.JWT_SECRET as string) as JwtPayload;
            return {
                id: verifiedToken.userId || "",
                name: verifiedToken.name || "Unknown User",
                email: verifiedToken.email || "",
                role: verifiedToken.role || "USER",
            };
        }

        throw new Error("No access token found");
    } catch (error: unknown) {
        console.error("Get user info error:", error);
        return {
            id: "",
            name: "Unknown User",
            email: "",
            role: "USER",
        };
    }
}

export async function checkAuthStatus(): Promise<boolean> {
  try {
    const accessToken = await getCookie("accessToken");
    return !!accessToken;
  } catch (error) {
    console.error("Error checking auth status:", error);
    return false;
  }
}
