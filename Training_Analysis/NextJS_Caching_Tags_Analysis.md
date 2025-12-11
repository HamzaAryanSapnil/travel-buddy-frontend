# Next.js Caching Tags Analysis

## Overview

In Next.js, efficient data fetching and caching are crucial for performance. This document analyzes the two primary approaches for caching: `unstable_cache` and standard `fetch` with tags, and establishes the standard for our project.

## Approaches

### 1. `unstable_cache`
- **What it does:** Caches the *result* of an expensive operation (like a database query or complex calculation).
- **Usage:** Wraps an async function.
- **Pros:** Can cache anything (DB results, processed data).
- **Cons:** "Unstable" API (experimental), adds wrapper boilerplate.

### 2. Standard `fetch` with `next: { tags: [] }`
- **What it does:** Caches the raw Response object from a `fetch` request.
- **Usage:** Passed as an option in the `fetch` call's second argument (`init`).
- **Pros:** Native Web API extension, standard Next.js pattern, simpler syntax if just proxying API calls.
- **Cons:** Only works with `fetch` (not direct DB calls).

## Project Standard

For this project, we utilize a separate backend API via `fetch`. Therefore, the **Standard `fetch` with tags** approach is preferred.

### Implementation Pattern

We have `serverFetch` and `publicFetch` utilities that wrap the native `fetch`. These utilities accept `RequestInit` options, allowing us to pass `next` config directly.

#### GET Requests (Caching)

When fetching data that should be cached and revalidated on demand:

```typescript
// src/services/example/getData.ts
import { serverFetch } from "@/lib/server-fetch";

export async function getData() {
  const res = await serverFetch.get("/endpoint", {
    next: { 
      tags: ["my-data-tag"],       // Tag for on-demand revalidation
      revalidate: 3600             // Time-based revalidation (optional fallback)
    }
  });
  return res.json();
}
```

#### Mutations (Revalidating)

When creating, updating, or deleting data, we invalidate the cache using `revalidateTag`.

```typescript
// src/services/example/updateData.ts
"use server";
import { revalidateTag } from "next/cache";

export async function updateData(id: string, data: any) {
  // ... perform update ...
  
  if (success) {
    revalidateTag("my-data-tag"); // Invalidates all fetch calls with this tag
  }
}
```

## Benefits for Our Architecture

1.  **Simplicity:** Leverages the existing `serverFetch` wrapper without additional imports or wrappers like `unstable_cache`.
2.  **Granularity:** Allows us to invalidate specific subsets of data (e.g., "travel-plans", "user-profile") selectively.
3.  **Real-time Updates:** Ensures users see fresh data immediately after mutations by coupling mutations with revalidation.

