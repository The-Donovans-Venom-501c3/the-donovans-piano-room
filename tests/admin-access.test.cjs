const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const { test, afterEach } = require("node:test");
const ts = require("typescript");
const { NextRequest } = require("next/server");

function loadTypeScript(relativePath, overrides = {}) {
  const filename = path.resolve(__dirname, "..", relativePath);
  const { outputText } = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: filename,
  });
  const module = { exports: {} };
  new Function("require", "module", "exports", outputText)(
    (name) => overrides[name] ?? require(name), module, module.exports,
  );
  return module.exports;
}

const access = loadTypeScript("src/lib/auth/adminAccess.ts");
const route = loadTypeScript("src/lib/auth/adminRoute.ts", { "./adminAccess": access });
const middleware = loadTypeScript("src/middleware.ts", { "./lib/auth/adminRoute": route });
const originalFetch = global.fetch;
afterEach(() => { global.fetch = originalFetch; });
const admin = { userId: "user-1", personas: [{ id: "persona-uuid", code: "admin", name: "Administrator" }] };
const backend = "http://backend.test";
const request = (cookie = "access_token=valid", pathname = "/admin") => new NextRequest(
  `http://frontend.test${pathname}`, { headers: { Cookie: cookie } },
);

test("administrator access requires the exact persona code in a valid envelope", () => {
  assert.equal(access.hasAdministratorPersona(admin), true);
  for (const payload of [
    null, {}, { personas: admin.personas }, { ...admin, personas: null },
    { ...admin, personas: [] },
    { ...admin, personas: [{ code: "rbac_manager" }] },
    { ...admin, personas: [{ code: "administrator" }] },
    { ...admin, personas: [{ id: "administrator", name: "Administrator" }] },
    { ...admin, personas: [{ code: "Administrator" }] },
  ]) assert.equal(access.hasAdministratorPersona(payload), false);
});

test("admin route and all descendants are included in middleware", () => {
  assert.ok(middleware.config.matcher.includes("/admin/:path*"));
});

test("Planner requires login but does not require the administrator persona", async () => {
  assert.ok(middleware.config.matcher.includes("/planner/:path*"));
  const anonymous = await middleware.middleware(request("", "/planner"));
  assert.equal(anonymous.headers.get("location"), "http://frontend.test/login");
  global.fetch = async (url) => {
    assert.ok(url.endsWith("/api/user/"));
    return Response.json({ id: "student-1" });
  };
  const signedIn = await middleware.middleware(request("access_token=student", "/planner"));
  assert.equal(signedIn.headers.get("x-middleware-next"), "1");
});

test("unauthenticated requests redirect to login without fetching admin data", async () => {
  global.fetch = async () => { throw new Error("must not fetch"); };
  const response = await route.authorizeAdminRequest(request(""), backend);
  assert.equal(response.headers.get("location"), "http://frontend.test/login");
  assert.match(response.headers.get("cache-control"), /no-store/);
});

test("non-admin direct links and prefetches are redirected before rendering", async () => {
  global.fetch = async () => Response.json({ userId: "user-1", personas: [{ code: "teacher" }] });
  for (const pathname of ["/admin", "/admin/settings", "/admin?tab=rbacmanager", "/admin/nested.svg"]) {
    const req = request("access_token=valid", pathname);
    req.headers.set("next-router-prefetch", "1");
    const response = await middleware.middleware(req);
    assert.equal(response.headers.get("location"), "http://frontend.test/dashboard");
    assert.equal(response.headers.get("x-middleware-next"), null);
  }
});

test("administrator passes only after trusted uncached self-RBAC verification", async () => {
  global.fetch = async (url, init) => {
    assert.equal(url, `${backend}/api/rbac/me`);
    assert.equal(init.headers.Cookie, "access_token=valid");
    assert.equal(init.cache, "no-store");
    return Response.json(admin);
  };
  const response = await route.authorizeAdminRequest(request(), backend);
  assert.equal(response.headers.get("x-middleware-next"), "1");
});

test("refresh must re-check persona using the new token and forward both cookies", async () => {
  const calls = [];
  global.fetch = async (url, init) => {
    calls.push(url);
    if (url.endsWith("/auth/refresh")) {
      assert.equal(init.headers.Cookie, "refresh_token=refresh");
      return Response.json({}, { headers: {
        "Set-Cookie": "access_token=new-access; Path=/; HttpOnly; Expires=Wed, 28 Oct 2026 10:00:00 GMT, refresh_token=new-refresh; Path=/; HttpOnly",
      } });
    }
    if (init.headers.Cookie === "access_token=expired") return new Response(null, { status: 401 });
    assert.equal(init.headers.Cookie, "access_token=new-access");
    return Response.json(admin);
  };
  const response = await route.authorizeAdminRequest(request("access_token=expired; refresh_token=refresh"), backend);
  assert.equal(calls.length, 3);
  assert.equal(response.headers.get("x-middleware-next"), "1");
  assert.match(response.headers.get("set-cookie"), /refresh_token=new-refresh/);
  assert.match(response.headers.get("x-middleware-request-cookie"), /access_token=new-access/);
  assert.match(response.headers.get("x-middleware-request-cookie"), /refresh_token=new-refresh/);
});

test("refresh alone never grants administrator access", async () => {
  global.fetch = async (url) => url.endsWith("/auth/refresh")
    ? Response.json({}, { headers: { "Set-Cookie": "access_token=new; Path=/" } })
    : Response.json({ userId: "user-1", personas: [] });
  const response = await route.authorizeAdminRequest(request("refresh_token=refresh"), backend);
  assert.equal(response.headers.get("location"), "http://frontend.test/dashboard");
  assert.match(response.headers.get("set-cookie"), /access_token=new/);
});

test("missing refreshed access cookie or rejected refresh redirects to login", async () => {
  for (const refresh of [Response.json({}), new Response(null, { status: 401 })]) {
    global.fetch = async () => refresh;
    const response = await route.authorizeAdminRequest(request("refresh_token=refresh"), backend);
    assert.equal(response.headers.get("location"), "http://frontend.test/login");
  }
});

test("unavailable, malformed, and denied authorization never renders admin", async () => {
  for (const mock of [
    async () => { throw new Error("offline"); },
    async () => new Response(null, { status: 500 }),
    async () => new Response("not json"),
    async () => new Response(null, { status: 403 }),
    async () => Response.json({}),
  ]) {
    global.fetch = mock;
    const response = await route.authorizeAdminRequest(request(), backend);
    assert.equal(response.headers.get("x-middleware-next"), null);
    assert.ok([307, 503].includes(response.status));
  }
});