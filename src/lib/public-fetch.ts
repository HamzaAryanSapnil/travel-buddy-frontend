const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:5000/api/v1";

/**
 * Public fetch utility for endpoints that don't require authentication
 * Used for public travel plans, public plan details, etc.
 */
const publicFetchHelper = async (
  endpoint: string,
  options: RequestInit
): Promise<Response> => {
  const response = await fetch(`${BACKEND_API_URL}${endpoint}`, {
    ...options,
    cache: "no-store", // Ensure fresh data for SSR
  });

  return response;
};

export const publicFetch = {
  get: async (endpoint: string, options: RequestInit = {}): Promise<Response> =>
    publicFetchHelper(endpoint, { ...options, method: "GET" }),

  post: async (
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> =>
    publicFetchHelper(endpoint, { ...options, method: "POST" }),
};

