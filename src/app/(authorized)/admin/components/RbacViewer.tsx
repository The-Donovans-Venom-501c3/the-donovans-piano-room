"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getRbacCatalog, getUserRbac, getUsersByPermission,
  type RbacCatalog, type RbacData, type BrowseResult,
} from "@/lib/api/rbacService";
import RbacTree from "./RbacTree";

type Mode = "user" | "permission";

function recordError(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export default function RbacViewer() {
  const [mode, setMode] = useState<Mode>("user");
  const [userView, setUserView] = useState<"tree" | "json">("tree");
  const [users, setUsers] = useState<RbacCatalog["users"]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [rbacData, setRbacData] = useState<RbacData | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingRbac, setLoadingRbac] = useState(false);
  const [usersError, setUsersError] = useState("");
  const [rbacError, setRbacError] = useState("");
  const [browseError, setBrowseError] = useState("");

  const [filterOptions, setFilterOptions] = useState<RbacCatalog | null>(null);
  const [filterResource, setFilterResource] = useState("");
  const [filterAction, setFilterAction] = useState("");
  const [browseResult, setBrowseResult] = useState<BrowseResult | null>(null);
  const [loadingBrowse, setLoadingBrowse] = useState(false);

  useEffect(() => {
    let active = true;
    getRbacCatalog()
      .then((catalog) => {
        if (!active) return;
        setUsers(catalog.users);
        setSelectedUserId(catalog.users[0]?.id ?? "");
        setFilterOptions(catalog);
      })
      .catch((err: unknown) => {
        if (active) setUsersError(recordError(err));
      })
      .finally(() => {
        if (active) setLoadingUsers(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (mode !== "user") return;
    let active = true;
    setRbacData(null);
    setRbacError("");
    if (!selectedUserId) return;
    setLoadingRbac(true);
    getUserRbac(selectedUserId)
      .then((data) => {
        if (active) setRbacData(data);
      })
      .catch((err: unknown) => {
        if (active) setRbacError(recordError(err));
      })
      .finally(() => {
        if (active) setLoadingRbac(false);
      });
    return () => { active = false; };
  }, [mode, selectedUserId]);

  useEffect(() => {
    if (mode !== "permission" || !filterOptions) return;
    let active = true;
    setBrowseResult(null);
    setLoadingBrowse(true);
    setBrowseError("");
    getUsersByPermission(filterResource, filterAction)
      .then((data) => {
        if (active) setBrowseResult(data);
      })
      .catch((err: unknown) => {
        if (active) setBrowseError(recordError(err));
      })
      .finally(() => {
        if (active) setLoadingBrowse(false);
      });
    return () => { active = false; };
  }, [mode, filterOptions, filterResource, filterAction]);

  const error = usersError || (mode === "user" ? rbacError : browseError);

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
          <div className="eyebrow">Access control · Admin</div>
          <h1 className="page-title">RBAC viewer</h1>
          <p className="page-description">
            Select a user to explore their personas, roles, and effective permissions as a tree or raw JSON.
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
              <div className="panel-subtitle">GET /rbac/admin/users/:id/rbac</div>
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
          {!error && (loadingUsers || loadingRbac) && <div className="empty-state"><i className="spinner" /> Loading RBAC data…</div>}
          {!error && !loadingRbac && rbacData && (
            <>
              <div className="flex gap-2 border-b border-purple-100 p-4" role="group" aria-label="User data display">
                {(["tree", "json"] as const).map((view) => (
                  <button
                    key={view}
                    type="button"
                    aria-pressed={userView === view}
                    onClick={() => setUserView(view)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-600 ${userView === view ? "bg-purple-800 text-white" : "bg-purple-50 text-purple-900 hover:bg-purple-100"}`}
                  >
                    {view === "tree" ? "Tree view" : "JSON view"}
                  </button>
                ))}
              </div>
              {userView === "tree" ? (
                <RbacTree
                  key={rbacData.userId}
                  data={rbacData}
                  userName={selectedUser?.fullName || selectedUser?.displayName || selectedUser?.email || selectedUserId}
                />
              ) : (
                <pre className="json-view" aria-label={`RBAC data for ${selectedUser?.fullName || selectedUserId}`}>
                  {JSON.stringify(rbacData, null, 2)}
                </pre>
              )}
            </>
          )}
          {!error && !loadingRbac && !rbacData && !loadingUsers && (
            <div className="empty-state">{users.length === 0 ? "No users available." : "Select a user to view their RBAC data."}</div>
          )}
        </section>
      ) : (
        <section className="panel">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Users by permission</h2>
              <div className="panel-subtitle">GET /rbac/admin/rbac/users · user_effective_permissions view</div>
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
                  <option value="">{loadingUsers ? "Loading…" : "All resources"}</option>
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
                  <option value="">{loadingUsers ? "Loading…" : "All actions"}</option>
                  {filterOptions?.actions.map((action) => (
                    <option value={action.id} key={action.id}>{action.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {error && <div className="empty-state">{error}</div>}
          {!error && (loadingUsers || loadingBrowse) && <div className="empty-state"><i className="spinner" /> Querying view…</div>}
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
