export interface FetchWithAuthOptions {
  /**
   * If false, do not attempt refresh/retry even on 401.
   */
  enableRefreshRetry?: boolean;
}

/**
 * Wrapper around `fetch` that:
 * - Sends cookies by default (`credentials: 'include'`)
 * - On 401, calls `/api/auth/refresh` to rotate tokens
 * - Retries the original request once after a successful refresh
 */
export async function fetchWithAuth(
  input: RequestInfo | URL,
  init: RequestInit = {},
  options: FetchWithAuthOptions = {}
): Promise<Response> {
  const { enableRefreshRetry = true } = options;

  const doFetch = () =>
    fetch(input, {
      credentials: 'include',
      ...init,
    });

  let response = await doFetch();

  if (!enableRefreshRetry || response.status !== 401) {
    return response;
  }

  try {
    const refreshResponse = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (!refreshResponse.ok) {
      // Refresh failed – return the original 401 so callers can redirect to login.
      return response;
    }

    // Retry original request once with the (hopefully) new access token.
    response = await doFetch();
    return response;
  } catch {
    // Network or other failure during refresh – propagate original 401.
    return response;
  }
}

