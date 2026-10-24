/* export const apiBase =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "/api";

const GET_CACHE_TTL_MS = 20_000;
const responseCache = new Map<string, { expiresAt: number; value: unknown }>();

export function clearApiCache() {
  responseCache.clear();
}

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const method = (init.method ?? "GET").toUpperCase();
  const cacheKey = `${apiBase}${path}`;
  if (method === "GET") {
    const cached = responseCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) return cached.value as T;
    if (cached) responseCache.delete(cacheKey);
  } else if (path.startsWith("/calendar/events") || path.startsWith("/calendar/reminders")  || path.startsWith("/coupons")) {
    for (const key of responseCache.keys()) {
      if (key.includes("/calendar/events") || key.includes("/calendar/reminders") || key.includes("/coupons")) responseCache.delete(key);
    }
  }

  let response: Response;
  try {
    response = await fetch(`${apiBase}${path}`, {
      ...init,
      credentials: "include",
      headers: {
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...init.headers,
      },
    });
  } catch {
    throw new ApiError(`Can't reach the backend at ${apiBase}. Start the local backend and try again.`, 0);
  }

  const text = await response.text();
  const payload = text ? (JSON.parse(text) as unknown) : undefined;
  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "message" in payload
        ? String((payload as { message: unknown }).message)
        : `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status);
  }
  if (method === "GET") {
    responseCache.set(cacheKey, { expiresAt: Date.now() + GET_CACHE_TTL_MS, value: payload });
  }
  return payload as T;
}
 */

export const apiBase =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "/api";

const GET_CACHE_TTL_MS = 20_000;

// 1. EXTEND THE CACHE VALUE INTERFACE
// We now store an array of string tags alongside the data.
const responseCache = new Map<
  string, 
  { expiresAt: number; value: unknown; tags: string[] }
>();

// 2. DEFINE THE EXTENDED OPTIONS INTERFACE
// This allows callers to pass tags to GET requests and tags to invalidate on mutations.
export interface ExtendedRequestInit extends RequestInit {
  tags?: string[];            // Applied to GET requests to categorize the data
  invalidateTags?: string[];  // Applied to mutations (POST, PUT, DELETE) to bust the cache
}

export function clearApiCache() {
  responseCache.clear();
}

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(
  path: string, 
  init: ExtendedRequestInit = {} // Uses the new ExtendedRequestInit type
): Promise<T> {
  const method = (init.method ?? "GET").toUpperCase();
  const cacheKey = `${apiBase}${path}`;

  // --- CACHE READ LAYER ---
  if (method === "GET") {
    const cached = responseCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) return cached.value as T;
    if (cached) responseCache.delete(cacheKey);
  } 
  
  // --- CACHE INVALIDATION LAYER ---
  // Replaces the hardcoded endpoints with dynamic tag checking
  else if (init.invalidateTags && init.invalidateTags.length > 0) {
    for (const [key, cachedItem] of responseCache.entries()) {
      // Check if the cached item has any tag that matches the invalidation list
      const shouldInvalidate = cachedItem.tags.some(tag => 
        init.invalidateTags!.includes(tag)
      );
      
      if (shouldInvalidate) {
        responseCache.delete(key);
      }
    }
  }

  // --- NETWORK REQUEST LAYER ---
  let response: Response;
  try {
    // Strip our custom properties out before passing to native fetch
    const { tags, invalidateTags, ...nativeInit } = init;
    
    response = await fetch(`${apiBase}${path}`, {
      ...nativeInit,
      credentials: "include",
      headers: {
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...init.headers,
      },
    });
  } catch {
    throw new ApiError(`Can't reach the backend at ${apiBase}. Start the local backend and try again.`, 0);
  }

  const text = await response.text();
  const payload = text ? (JSON.parse(text) as unknown) : undefined;
  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "message" in payload
        ? String((payload as { message: unknown }).message)
        : `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status);
  }

  // --- CACHE WRITE LAYER ---
  if (method === "GET") {
    responseCache.set(cacheKey, { 
      expiresAt: Date.now() + GET_CACHE_TTL_MS, 
      value: payload,
      tags: init.tags ?? [] // 3. TAGS ARE SAVED HERE WITH THE CACHE ENTRY
    });
  }
  
  return payload as T;
}
