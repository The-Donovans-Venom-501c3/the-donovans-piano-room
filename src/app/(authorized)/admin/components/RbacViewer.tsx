"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api/api";

type UserSummary = {
  id: string;
  fullName: string;
  displayName: string;
  email: string;
};

type RolePermission = { code: string; resource: string; action: string };
type RoleNode = { id: string; code: string; name: string; permissions: RolePermission[] };
type PersonaNode = {
  id: string;
  code: string;
  name: string;
  profile: unknown;
  roles: RoleNode[];
};
type RbacData = {
  userId: string;
  personas: PersonaNode[];
  permissions: { resource: string; actions: string[] }[];
};
type FilterOptions = {
  resources: { id: string; name: string }[];
  actions: { id: string; name: string }[];
};
type BrowseResult = {
  filter: { resource: string | null; action: string | null };
  matchCount: number;
  users: (UserSummary & { permissions: string[] })[];
};

type Mode = "user" | "permission";

function recordError(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export default function RbacViewer() {
  const [mode, setMode] = useState<Mode>("user");
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [rbacData, setRbacData] = useState<RbacData | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingRbac, setLoadingRbac] = useState(false);
  const [error, setError] = useState("");

  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [filterResource, setFilterResource] = useState("");
  const [filterAction, setFilterAction] = useState("");
  const [browseResult, setBrowseResult] = useState<BrowseResult | null>(null);
  const [loadingBrowse, setLoadingBrowse] = useState(false);

  useEffect(() => {
    apiRequest<UserSummary[]>("/dev/crud/users")
      .then((rows) => {
        setUsers(rows);
        if (rows.length > 0) setSelectedUserId(rows[0].id);
      })
      .catch((err: unknown) => setError(recordError(err)))
      .finally(() => setLoadingUsers(false));
    apiRequest<FilterOptions>("/dev/crud/rbac/filters")
      .then((options) => {
        setFilterOptions(options);
        if (options.resources.length > 0) setFilterResource(options.resources[0].id);
        if (options.actions.length > 0) setFilterAction(options.actions[0].id);
      })
      .catch(() => setFilterOptions(null));
  }, []);

  const loadRbacData = useCallback(async (userId: string) => {
    if (!userId) {
      setRbacData(null);
      return;
    }
    setLoadingRbac(true);
    setError("");
    try {
      setRbacData(await apiRequest<RbacData>(`/dev/crud/users/${encodeURIComponent(userId)}/rbac`));
    } catch (err) {
      setRbacData(null);
      setError(recordError(err));
    } finally {
      setLoadingRbac(false);
    }
  }, []);

  const loadBrowse = useCallback(async (resource: string, action: string) => {
    setLoadingBrowse(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (resource) params.set("resource", resource);
      if (action) params.set("action", action);
      setBrowseResult(await apiRequest<BrowseResult>(`/dev/crud/rbac/users?${params.toString()}`));
    } catch (err) {
      setBrowseResult(null);
      setError(recordError(err));
    } finally {
      setLoadingBrowse(false);
    }
  }, []);

  useEffect(() => {
    if (mode === "user") loadRbacData(selectedUserId);
  }, [mode, selectedUserId, loadRbacData]);

  useEffect(() => {
    if (mode === "permission") loadBrowse(filterResource, filterAction);
  }, [mode, filterResource, filterAction, loadBrowse]);

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) ?? null,
    [users, selectedUserId],
  );

  const stats = useMemo(() => {
    if (!rbacData) return { personas: 0, roles: 0, permissions: 0 };
    return {
      personas: rbacData.personas.length,
      roles: rbacData.personas.reduce((total, persona) => total + persona.roles.length, 0),
      permissions: rbacData.permissions.reduce((total, entry) => total + entry.actions.length, 0),
    };
  }, [rbacData]);

  function inspectUser(userId: string) {
    setSelectedUserId(userId);
    setMode("user");
  }

  return (
    <div className="content">
      <div className="header-row">
        <div>
          <div className="eyebrow">Access control · Local only</div>
          <h1 className="page-title">RBAC viewer</h1>
          <p className="page-description">
            Select a user to inspect their personas, roles, and effective permissions as raw JSON.
          </p>
        </div>
        <div className="stat-row">
          {mode === "user" ? (
            <>
              <div className="stat-card"><div className="stat-number">{stats.personas}</div><div className="stat-label">Personas</div></div>
              <div className="stat-card"><div className="stat-number">{stats.roles}</div><div className="stat-label">Roles</div></div>
              <div className="stat-card"><div className="stat-number">{stats.permissions}</div><div className="stat-label">Permissions</div></div>
            </>
          ) : (
            <div className="stat-card"><div className="stat-number">{browseResult?.matchCount ?? 0}</div><div className="stat-label">Matching users</div></div>
          )}
        </div>
      </div>

      <div className="rbac-mode-bar" role="tablist" aria-label="Explorer mode">
        <button
          className={`rbac-mode ${mode === "user" ? "active" : ""}`}
          role="tab"
          aria-selected={mode === "user"}
          onClick={() => setMode("user")}
        >Per user</button>
        <button
          className={`rbac-mode ${mode === "permission" ? "active" : ""}`}
          role="tab"
          aria-selected={mode === "permission"}
          onClick={() => setMode("permission")}
        >Browse by permission</button>
      </div>

      {mode === "user" ? (
        <section className="panel">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">User authorization data</h2>
              <div className="panel-subtitle">GET /dev/crud/users/:id/rbac</div>
            </div>
            <div className="field rbac-user-picker">
              <label htmlFor="rbac-user">USER</label>
              <select
                id="rbac-user"
                value={selectedUserId}
                onChange={(event) => setSelectedUserId(event.target.value)}
                disabled={loadingUsers || users.length === 0}
              >
                {users.length === 0 && <option value="">No users available</option>}
                {users.map((user) => (
                  <option value={user.id} key={user.id}>
                    {user.fullName} · {user.email}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && <div className="empty-state">{error}</div>}
          {!error && loadingRbac && <div className="empty-state"><i className="spinner" /> Loading RBAC data…</div>}
          {!error && !loadingRbac && rbacData && (
            <pre className="json-view" aria-label={`RBAC data for ${selectedUser?.fullName ?? selectedUserId}`}>
              {JSON.stringify(rbacData, null, 2)}
            </pre>
          )}
          {!error && !loadingRbac && !rbacData && !loadingUsers && (
            <div className="empty-state">Select a user to view their RBAC data.</div>
          )}
        </section>
      ) : (
        <section className="panel">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Users by permission</h2>
              <div className="panel-subtitle">GET /dev/crud/rbac/users · user_effective_permissions view</div>
            </div>
            <div className="rbac-filter-row">
              <div className="field">
                <label htmlFor="rbac-resource">RESOURCE</label>
                <select
                  id="rbac-resource"
                  value={filterResource}
                  onChange={(event) => setFilterResource(event.target.value)}
                  disabled={!filterOptions}
                >
                  {!filterOptions && <option value="">Loading…</option>}
                  {filterOptions?.resources.map((resource) => (
                    <option value={resource.id} key={resource.id}>{resource.name}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="rbac-action">ACTION</label>
                <select
                  id="rbac-action"
                  value={filterAction}
                  onChange={(event) => setFilterAction(event.target.value)}
                  disabled={!filterOptions}
                >
                  {!filterOptions && <option value="">Loading…</option>}
                  {filterOptions?.actions.map((action) => (
                    <option value={action.id} key={action.id}>{action.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {error && <div className="empty-state">{error}</div>}
          {!error && loadingBrowse && <div className="empty-state"><i className="spinner" /> Querying view…</div>}
          {!error && !loadingBrowse && browseResult && browseResult.users.length === 0 && (
            <div className="empty-state">No users have this permission.</div>
          )}
          {!error && !loadingBrowse && browseResult && browseResult.users.length > 0 && (
            <>
              <div className="rbac-match-list">
                {browseResult.users.map((user) => (
                  <button className="rbac-match" key={user.id} onClick={() => inspectUser(user.id)} title="Inspect this user">
                    <span className="rbac-match-name">{user.fullName}</span>
                    <span className="rbac-match-email">{user.email}</span>
                    <span className="badge">{user.permissions.length} permission{user.permissions.length === 1 ? "" : "s"}</span>
                  </button>
                ))}
              </div>
              <pre className="json-view" aria-label="Users matching the selected permission">
                {JSON.stringify(browseResult, null, 2)}
              </pre>
            </>
          )}
        </section>
      )}
    </div>
  );
}
