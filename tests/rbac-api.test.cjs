const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const { test, afterEach } = require("node:test");
const ts = require("typescript");

// Run the existing TypeScript modules without adding a test-runner dependency.
function loadTypeScript(relativePath, overrides = {}) {
  const filename = path.resolve(__dirname, "..", relativePath);
  const { outputText } = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: filename,
  });
  const module = { exports: {} };
  const localRequire = (name) => overrides[name] ?? require(name);
  new Function("require", "module", "exports", outputText)(localRequire, module, module.exports);
  return module.exports;
}

const api = loadTypeScript("src/lib/api/api.ts");
const rbac = loadTypeScript("src/lib/api/rbacService.ts", { "./api": api });
const originalFetch = global.fetch;
afterEach(() => {
  global.fetch = originalFetch;
  api.clearApiCache();
});

const user = { id: "user-1", fullName: "Test User", displayName: "Test", email: "test@example.com" };
const catalog = { users: [user], resources: [{ id: "calendar", name: "Calendar" }], actions: [{ id: "view", name: "View" }] };
const browse = { filter: { resource: null, action: null }, matchCount: 1, users: [{ ...user, permissions: ["calendar_view"] }] };
const authorization = {
  userId: user.id,
  personas: [{ id: "teacher", name: "Teacher", roles: [{ id: "reader", permissions: [{ code: "calendar_view", resource: "calendar", action: "view" }] }] }],
  permissions: [{ resource: "calendar", actions: ["view"] }],
};

function respond(payload, status = 200) {
  global.fetch = async () => Response.json(payload, { status });
}

test("bootstrap loads all users and filters from the authenticated catalog", async () => {
  global.fetch = async (url, init) => {
    assert.equal(url, `${api.apiBase}/rbac/admin/catalog`);
    assert.equal(init.credentials, "include");
    assert.equal(init.cache, "no-store");
    return Response.json(catalog);
  };
  assert.deepEqual(await rbac.getRbacCatalog(), catalog);
});

test("self authorization uses the authenticated uncached me route", async () => {
  global.fetch = async (url, init) => {
    assert.equal(url, `${api.apiBase}/rbac/me`);
    assert.equal(init.credentials, "include");
    assert.equal(init.cache, "no-store");
    return Response.json(authorization);
  };
  assert.deepEqual(await rbac.getMyRbac(), authorization);
});

test("catalog accepts empty collections and nullable user names", async () => {
  respond({ users: [{ ...user, fullName: null, displayName: null }], resources: [], actions: [] });
  const result = await rbac.getRbacCatalog();
  assert.equal(result.users[0].fullName, "");
  assert.deepEqual(result.resources, []);
  respond({ users: [], resources: [], actions: [] });
  assert.deepEqual((await rbac.getRbacCatalog()).users, []);
});

test("a browse result cannot be mistaken for the user catalog", async () => {
  respond(browse);
  await assert.rejects(rbac.getRbacCatalog(), /invalid response/);
});

test("user RBAC uses the admin route and URL-encodes the user ID", async () => {
  global.fetch = async (url) => {
    assert.equal(url, `${api.apiBase}/rbac/admin/users/user%2F1%3F/rbac`);
    return Response.json(authorization);
  };
  assert.deepEqual(await rbac.getUserRbac("user/1?"), authorization);
});

test("empty RBAC trees are valid", async () => {
  const empty = { userId: user.id, personas: [], permissions: [] };
  respond(empty);
  assert.deepEqual(await rbac.getUserRbac(user.id), empty);
});

test("malformed nested collections fail before they reach rendering", async () => {
  for (const payload of [null, {}, { ...authorization, personas: null }, { ...authorization, personas: [{ id: "teacher", roles: null }] }, { ...authorization, permissions: [{ resource: "calendar", actions: null }] }]) {
    respond(payload);
    await assert.rejects(rbac.getUserRbac(user.id), /invalid response/);
  }
});

test("permission browsing consumes the users envelope and encodes filters", async () => {
  global.fetch = async (url) => {
    assert.equal(url, `${api.apiBase}/rbac/admin/rbac/users?resource=calendar+%26+lessons&action=view`);
    return Response.json(browse);
  };
  assert.deepEqual(await rbac.getUsersByPermission("calendar & lessons", "view"), browse);
});

test("all-permission browsing omits empty query parameters", async () => {
  global.fetch = async (url) => {
    assert.equal(url, `${api.apiBase}/rbac/admin/rbac/users`);
    return Response.json({ ...browse, matchCount: 0, users: [] });
  };
  assert.deepEqual((await rbac.getUsersByPermission("", "")).users, []);
});

test("invalid browse payloads cannot cause permissions.length exceptions", async () => {
  for (const payload of [[user], { ...browse, users: null }, { ...browse, users: [user] }]) {
    respond(payload);
    await assert.rejects(rbac.getUsersByPermission("", ""), /invalid response/);
  }
});

test("JSON authorization failures preserve the backend message and status", async () => {
  for (const status of [401, 403, 500]) {
    respond({ message: "Access denied" }, status);
    await assert.rejects(rbac.getRbacCatalog(), (error) => error instanceof api.ApiError && error.status === status && error.message === "Access denied");
  }
});

test("HTML and plain-text failures become ApiErrors instead of JSON parser exceptions", async () => {
  for (const [status, body] of [[404, "<html>Not found</html>"], [502, "Bad Gateway"], [200, "<html>Login</html>"]]) {
    global.fetch = async () => new Response(body, { status });
    await assert.rejects(api.apiRequest("/rbac/test"), (error) => error instanceof api.ApiError && error.status === status && error.message.includes("/rbac/test"));
  }
});

test("RBAC requests bypass previously cached data and never populate the cache", async () => {
  respond(catalog);
  await api.apiRequest("/rbac/admin/catalog");
  let requests = 0;
  global.fetch = async () => {
    requests++;
    return Response.json({ ...catalog, users: [] });
  };
  assert.deepEqual((await rbac.getRbacCatalog()).users, []);
  assert.deepEqual((await rbac.getRbacCatalog()).users, []);
  assert.equal(requests, 2);
  assert.deepEqual(await api.apiRequest("/rbac/admin/catalog"), catalog);
});

test("ordinary GET caching and network error handling still work", async () => {
  let requests = 0;
  global.fetch = async () => { requests++; return Response.json({ ok: true }); };
  await api.apiRequest("/test");
  await api.apiRequest("/test");
  assert.equal(requests, 1);
  global.fetch = async () => { throw new TypeError("Failed to fetch"); };
  await assert.rejects(rbac.getRbacCatalog(), (error) => error instanceof api.ApiError && error.status === 0);
});