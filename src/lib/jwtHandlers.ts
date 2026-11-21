"use server";

import jwt from "jsonwebtoken";

/**
 * Verify access token and return payload
 */
export const verifyAccessToken = async (token: string) => {
  try {
    const verifiedAccessToken = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as jwt.JwtPayload;

    return {
      success: true,
      message: "Token is valid",
      payload: verifiedAccessToken,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error && error.message ? error.message : "Invalid token";
    return {
      success: false,
      message,
    };
  }
};

