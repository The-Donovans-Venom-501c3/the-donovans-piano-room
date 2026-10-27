import { NextResponse, type NextRequest } from "next/server";
import { hasAdministratorPersona } from "./adminAccess";

// This runs before the admin route is rendered, including client navigation and
// prefetch requests. A client-side profile is not an authorization boundary.
export async function authorizeAdminRequest(
  request: NextRequest,
  backendBaseUrl: string,
) {
  let accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  let refreshedCookies: string[] = [];

  const finish = (response: NextResponse) => {
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, private",
    );
    for (const cookie of refreshedCookies)
      response.headers.append("Set-Cookie", cookie);
    return response;
  };
  const login = () =>
    finish(NextResponse.redirect(new URL("/login", request.url)));
  const getAuthorization = () =>
    fetch(`${backendBaseUrl}/api/rbac/me`, {
      headers: { Cookie: `access_token=${accessToken}` },
      cache: "no-store",
      redirect: "error",
    });

  try {
    let authorization = accessToken ? await getAuthorization() : null;
    if ((!authorization || authorization.status === 401) && refreshToken) {
      const refresh = await fetch(`${backendBaseUrl}/api/auth/refresh`, {
        method: "POST",
        headers: { Cookie: `refresh_token=${refreshToken}` },
        cache: "no-store",
        redirect: "error",
      });
      if (!refresh.ok) return login();

      // Some runtimes combine Set-Cookie headers. Do not split the comma in an
      // Expires date, and forward both access and rotated refresh cookies.
      const combined = refresh.headers.get("set-cookie");
      refreshedCookies = combined
        ? combined.split(/,(?=\s*[^\s;,=]+=)/).map((cookie) => cookie.trim())
        : [];
      accessToken = refreshedCookies
        .find((cookie) => cookie.startsWith("access_token="))
        ?.split(";", 1)[0]
        .slice("access_token=".length);
      if (!accessToken) return login();
      authorization = await getAuthorization();
    }

    if (!authorization || authorization.status === 401) return login();
    if (authorization.status === 403) {
      return finish(NextResponse.redirect(new URL("/dashboard", request.url)));
    }
    if (!authorization.ok) throw new Error("Authorization service unavailable");
    if (!hasAdministratorPersona(await authorization.json())) {
      return finish(NextResponse.redirect(new URL("/dashboard", request.url)));
    }

    // Make refreshed credentials available to any downstream server components.
    const headers = new Headers(request.headers);
    const cookies = new Map(
      request.cookies.getAll().map(({ name, value }) => [name, value]),
    );
    for (const cookie of refreshedCookies) {
      const pair = cookie.split(";", 1)[0];
      const equals = pair.indexOf("=");
      cookies.set(pair.slice(0, equals), pair.slice(equals + 1));
    }
    headers.set(
      "Cookie",
      Array.from(cookies, ([name, value]) => `${name}=${value}`).join("; "),
    );
    return finish(NextResponse.next({ request: { headers } }));
  } catch {
    // Fail closed on outages or invalid responses; never mount admin components.
    return finish(
      new NextResponse(
        "Unable to verify administrator access. Please try again.",
        { status: 503 },
      ),
    );
  }
}
