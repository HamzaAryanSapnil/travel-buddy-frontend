/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { serverFetch } from "@/lib/server-fetch";
import { UserInfo } from "@/types/user.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getCookie } from "./tokenHandlers";

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
                id: result.data.id || verifiedToken.userId || "",
                name: result.data.fullName || result.data.name || verifiedToken.name || "Unknown User",
                email: result.data.email || verifiedToken.email || "",
                role: result.data.role || verifiedToken.role || "USER",
                profileImage: result.data.profileImage,
                fullName: result.data.fullName,
                bio: result.data.bio,
                location: result.data.location,
                interests: result.data.interests,
                visitedCountries: result.data.visitedCountries,
                isVerified: result.data.isVerified,
                status: result.data.status,
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
    } catch (error: any) {
        console.error("Get user info error:", error);
        return {
            id: "",
            name: "Unknown User",
            email: "",
            role: "USER",
        };
    }
}

