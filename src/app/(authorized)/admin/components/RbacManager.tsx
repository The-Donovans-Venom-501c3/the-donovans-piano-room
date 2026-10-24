"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api/api";

// ---- Types matching the /rbac/admin/catalog response ----------------------
type ResourceRow = { id: string; name: string; description: string };
type ActionRow = { id: string; name: string; description: string };
type PermissionRow = { id: string; code: string; resourceId: string; actionId: string; description: string };
type RoleRow = { id: string; code: string; name: string; description: string; permissionIds: string[] };
type PersonaRow = { id: string; code: string; name: string; description: string; roleIds: string[] };
type UserRow = { id: string; fullName: string; displayName: string; email: string; personaIds: string[] };
type Catalog = {
  resources: ResourceRow[];
  actions: ActionRow[];
  permissions: PermissionRow[];
  roles: RoleRow[];
  personas: PersonaRow[];
  users: UserRow[];
};

type Tab = "resources" | "actions" | "permissions" | "roles" | "personas" | "users";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "resources", label: "Resources", icon: "▤" },
  { id: "actions", label: "Actions", icon: "⚡" },
  { id: "permissions", label: "Permissions", icon: "✓" },
  { id: "roles", label: "Roles", icon: "⛨" },
  { id: "personas", label: "Personas", icon: "⚿" },
  { id: "users", label: "User assignments", icon: "☺" },
];

function recordError(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export default function RbacManager() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [forbidden, setForbidden] = useState(false);
  const [tab, setTab] = useState<Tab>("resources");
  const [toast, setToast] = useState<{ text: string; error?: boolean } | null>(null);
  const [busy, setBusy] = useState(false);

  const notify = useCallback((text: string, isError = false) => {
    setToast({ text, error: isError });
    window.setTimeout(() => setToast(null), 3500);
  }, []);

  const loadCatalog = useCallback(async () => {
    setError("");
    try {
      setCatalog(await apiRequest<Catalog>("/rbac/admin/catalog"));
      setForbidden(false);
    } catch (err) {
      if (err instanceof Error && "status" in err && (err as { status: number }).status === 403) {
        setForbidden(true);
      } else {
        setError(recordError(err));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  const run = useCallback(
    async (work: () => Promise<unknown>, success: string) => {
      setBusy(true);
      try {
        await work();
        await loadCatalog();
        notify(success);
        return true;
      } catch (err) {
        notify(recordError(err), true);
        return false;
      } finally {
        setBusy(false);
      }
    },
    [loadCatalog, notify],
  );

  const stats = useMemo(() => {
    if (!catalog) return { resources: 0, actions: 0, permissions: 0, roles: 0, personas: 0, users: 0 };
    return {
      resources: catalog.resources.length,
      actions: catalog.actions.length,
      permissions: catalog.permissions.length,
      roles: catalog.roles.length,
      personas: catalog.personas.length,
      users: catalog.users.length,
    };
  }, [catalog]);

  if (loading) {
    return <div className="empty-state"><i className="spinner" /> Loading RBAC catalog…</div>;
  }

  if (forbidden) {
    return (
      <div className="content">
        <section className="panel">
          <div className="empty-state">
            <div className="empty-icon">⛨</div>
            You don&apos;t have permission to manage access control.
            <br />
            <small>This page requires the <code>rbac_manager</code> persona.</small>
          </div>
        </section>
      </div>
    );
  }

  if (!catalog) {
    return (
      <div className="content">
        <section className="panel">
          <div className="empty-state">{error || "Failed to load the RBAC catalog."}</div>
        </section>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="header-row">
        <div>
          <div className="eyebrow">Access control · Admin</div>
          <h1 className="page-title">RBAC manager</h1>
          <p className="page-description">
            Create and manage resources, actions, permissions, roles, personas, and user assignments.
          </p>
        </div>
        <div className="stat-row">
          <div className="stat-card"><div className="stat-number">{stats.resources}</div><div className="stat-label">Resources</div></div>
          <div className="stat-card"><div className="stat-number">{stats.actions}</div><div className="stat-label">Actions</div></div>
          <div className="stat-card"><div className="stat-number">{stats.roles}</div><div className="stat-label">Roles</div></div>
          <div className="stat-card"><div className="stat-number">{stats.personas}</div><div className="stat-label">Personas</div></div>
        </div>
      </div>

      <div className="rbac-mode-bar" role="tablist" aria-label="RBAC manager sections">
        {TABS.map((item) => (
          <button
            key={item.id}
            className={`rbac-mode ${tab === item.id ? "active" : ""}`}
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </div>

      {tab === "resources" && <ResourcesSection catalog={catalog} run={run} busy={busy} />}
      {tab === "actions" && <ActionsSection catalog={catalog} run={run} busy={busy} />}
      {tab === "permissions" && <PermissionsSection catalog={catalog} run={run} busy={busy} />}
      {tab === "roles" && <RolesSection catalog={catalog} run={run} busy={busy} />}
      {tab === "personas" && <PersonasSection catalog={catalog} run={run} busy={busy} />}
      {tab === "users" && <UsersSection catalog={catalog} run={run} busy={busy} />}

      {toast && <div className={`toast ${toast.error ? "error" : ""}`} role="status">{toast.text}</div>}
    </div>
  );
}

type SectionProps = {
  catalog: Catalog;
  busy: boolean;
  run: (work: () => Promise<unknown>, success: string) => Promise<boolean>;
};

// ---- Shared form field ----------------------------------------------------
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}

// ---- Resources ------------------------------------------------------------
function ResourcesSection({ catalog, run, busy }: SectionProps) {
  const [draft, setDraft] = useState({ id: "", name: "", description: "" });
  const [editing, setEditing] = useState<string | null>(null);

  function startEdit(row: ResourceRow) {
    setEditing(row.id);
    setDraft({ id: row.id, name: row.name, description: row.description });
  }
  function reset() {
    setEditing(null);
    setDraft({ id: "", name: "", description: "" });
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const body = { name: draft.name, description: draft.description };
    const ok = await run(
      () =>
        editing
          ? apiRequest(`/rbac/admin/resources/${encodeURIComponent(editing)}`, { method: "PUT", body: JSON.stringify(body) })
          : apiRequest("/rbac/admin/resources", { method: "POST", body: JSON.stringify({ id: draft.id, ...body }) }),
      editing ? "Resource updated." : "Resource created.",
    );
    if (ok) reset();
  }

  return (
    <div className="workspace-grid">
      <section className="panel">
        <div className="panel-head">
          <div><h2 className="panel-title">Resources</h2><div className="panel-subtitle">GET · PUT · DELETE /rbac/admin/resources</div></div>
        </div>
        <div className="record-list">
          {catalog.resources.map((row) => (
            <article className="record" key={row.id}>
              <div className="record-art">▤</div>
              <div className="record-main">
                <div className="record-title">{row.name}</div>
                <div className="record-meta"><span className="badge">{row.id}</span><span>{row.description}</span></div>
              </div>
              <div className="row-actions">
                <button className="icon-button" title="Edit" onClick={() => startEdit(row)}>✎</button>
                <button className="icon-button danger" title="Delete" onClick={() => {
                  if (window.confirm(`Delete resource "${row.id}"? Its permissions will also be removed.`))
                    run(() => apiRequest(`/rbac/admin/resources/${encodeURIComponent(row.id)}`, { method: "DELETE" }), "Resource deleted.");
                }}>×</button>
              </div>
            </article>
          ))}
          {catalog.resources.length === 0 && <div className="empty-state">No resources yet.</div>}
        </div>
      </section>

      <section className="panel form-panel">
        <div className="panel-head">
          <div><h2 className="panel-title">{editing ? "Edit resource" : "Create resource"}</h2><div className="panel-subtitle">{editing ? `Editing ${editing}` : "POST · New resource"}</div></div>
          {editing && <button className="button secondary" onClick={reset}>Cancel</button>}
        </div>
        <form onSubmit={submit}>
          <div className="form-content">
            <Field label="ID (code)"><input value={draft.id} onChange={(e) => setDraft({ ...draft, id: e.target.value })} disabled={Boolean(editing)} required placeholder="e.g. books" /></Field>
            <Field label="NAME"><input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} required placeholder="e.g. Books" /></Field>
            <Field label="DESCRIPTION"><textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="What this resource represents" /></Field>
          </div>
          <div className="form-actions">
            <button className="button primary full" type="submit" disabled={busy}>{busy ? "Saving…" : editing ? "Save changes" : "+ Create resource"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}

// ---- Actions --------------------------------------------------------------
function ActionsSection({ catalog, run, busy }: SectionProps) {
  const [draft, setDraft] = useState({ id: "", name: "", description: "" });
  const [editing, setEditing] = useState<string | null>(null);

  function startEdit(row: ActionRow) {
    setEditing(row.id);
    setDraft({ id: row.id, name: row.name, description: row.description });
  }
  function reset() {
    setEditing(null);
    setDraft({ id: "", name: "", description: "" });
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const body = { name: draft.name, description: draft.description };
    const ok = await run(
      () =>
        editing
          ? apiRequest(`/rbac/admin/actions/${encodeURIComponent(editing)}`, { method: "PUT", body: JSON.stringify(body) })
          : apiRequest("/rbac/admin/actions", { method: "POST", body: JSON.stringify({ id: draft.id, ...body }) }),
      editing ? "Action updated." : "Action created.",
    );
    if (ok) reset();
  }

  return (
    <div className="workspace-grid">
      <section className="panel">
        <div className="panel-head">
          <div><h2 className="panel-title">Actions</h2><div className="panel-subtitle">GET · PUT · DELETE /rbac/admin/actions</div></div>
        </div>
        <div className="record-list">
          {catalog.actions.map((row) => (
            <article className="record" key={row.id}>
              <div className="record-art game">⚡</div>
              <div className="record-main">
                <div className="record-title">{row.name}</div>
                <div className="record-meta"><span className="badge">{row.id}</span><span>{row.description}</span></div>
              </div>
              <div className="row-actions">
                <button className="icon-button" title="Edit" onClick={() => startEdit(row)}>✎</button>
                <button className="icon-button danger" title="Delete" onClick={() => {
                  if (window.confirm(`Delete action "${row.id}"? Related permissions will also be removed.`))
                    run(() => apiRequest(`/rbac/admin/actions/${encodeURIComponent(row.id)}`, { method: "DELETE" }), "Action deleted.");
                }}>×</button>
              </div>
            </article>
          ))}
          {catalog.actions.length === 0 && <div className="empty-state">No actions yet.</div>}
        </div>
      </section>

      <section className="panel form-panel">
        <div className="panel-head">
          <div><h2 className="panel-title">{editing ? "Edit action" : "Create action"}</h2><div className="panel-subtitle">{editing ? `Editing ${editing}` : "POST · New action"}</div></div>
          {editing && <button className="button secondary" onClick={reset}>Cancel</button>}
        </div>
        <form onSubmit={submit}>
          <div className="form-content">
            <Field label="ID (code)"><input value={draft.id} onChange={(e) => setDraft({ ...draft, id: e.target.value })} disabled={Boolean(editing)} required placeholder="e.g. view" /></Field>
            <Field label="NAME"><input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} required placeholder="e.g. View" /></Field>
            <Field label="DESCRIPTION"><textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="What this action does" /></Field>
          </div>
          <div className="form-actions">
            <button className="button primary full" type="submit" disabled={busy}>{busy ? "Saving…" : editing ? "Save changes" : "+ Create action"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}

// ---- Permissions ----------------------------------------------------------
function PermissionsSection({ catalog, run, busy }: SectionProps) {
  const [draft, setDraft] = useState({ resourceId: "", actionId: "", description: "" });

  const resourceName = useMemo(() => Object.fromEntries(catalog.resources.map((r) => [r.id, r.name])), [catalog.resources]);
  const actionName = useMemo(() => Object.fromEntries(catalog.actions.map((a) => [a.id, a.name])), [catalog.actions]);

  useEffect(() => {
    setDraft((d) => ({
      ...d,
      resourceId: d.resourceId || catalog.resources[0]?.id || "",
      actionId: d.actionId || catalog.actions[0]?.id || "",
    }));
  }, [catalog.resources, catalog.actions]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const ok = await run(
      () => apiRequest("/rbac/admin/permissions", { method: "POST", body: JSON.stringify(draft) }),
      "Permission created.",
    );
    if (ok) setDraft({ resourceId: catalog.resources[0]?.id || "", actionId: catalog.actions[0]?.id || "", description: "" });
  }

  return (
    <div className="workspace-grid">
      <section className="panel">
        <div className="panel-head">
          <div><h2 className="panel-title">Permissions</h2><div className="panel-subtitle">resource × action pairs · DELETE /rbac/admin/permissions/:id</div></div>
        </div>
        <div className="record-list">
          {catalog.permissions.map((row) => (
            <article className="record" key={row.id}>
              <div className="record-art">✓</div>
              <div className="record-main">
                <div className="record-title">{resourceName[row.resourceId] ?? row.resourceId} · {actionName[row.actionId] ?? row.actionId}</div>
                <div className="record-meta"><span className="badge">{row.code}</span><span>{row.description}</span></div>
              </div>
              <div className="row-actions">
                <button className="icon-button danger" title="Delete" onClick={() => {
                  if (window.confirm(`Delete permission "${row.code}"?`))
                    run(() => apiRequest(`/rbac/admin/permissions/${encodeURIComponent(row.id)}`, { method: "DELETE" }), "Permission deleted.");
                }}>×</button>
              </div>
            </article>
          ))}
          {catalog.permissions.length === 0 && <div className="empty-state">No permissions yet.</div>}
        </div>
      </section>

      <section className="panel form-panel">
        <div className="panel-head">
          <div><h2 className="panel-title">Create permission</h2><div className="panel-subtitle">POST · Pair a resource with an action</div></div>
        </div>
        <form onSubmit={submit}>
          <div className="form-content">
            <Field label="RESOURCE">
              <select value={draft.resourceId} onChange={(e) => setDraft({ ...draft, resourceId: e.target.value })} required>
                {catalog.resources.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </Field>
            <Field label="ACTION">
              <select value={draft.actionId} onChange={(e) => setDraft({ ...draft, actionId: e.target.value })} required>
                {catalog.actions.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </Field>
            <Field label="DESCRIPTION"><textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="Optional" /></Field>
            <div className="callout">The permission code is generated as <code>resource_action</code>.</div>
          </div>
          <div className="form-actions">
            <button className="button primary full" type="submit" disabled={busy}>+ Create permission</button>
          </div>
        </form>
      </section>
    </div>
  );
}

// ---- Roles ----------------------------------------------------------------
function RolesSection({ catalog, run, busy }: SectionProps) {
  const empty = { code: "", name: "", description: "", permissionIds: [] as string[] };
  const [draft, setDraft] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);

  function startEdit(row: RoleRow) {
    setEditing(row.id);
    setDraft({ code: row.code, name: row.name, description: row.description, permissionIds: [...row.permissionIds] });
  }
  function reset() {
    setEditing(null);
    setDraft(empty);
  }
  function toggle(id: string) {
    setDraft((d) => ({ ...d, permissionIds: d.permissionIds.includes(id) ? d.permissionIds.filter((p) => p !== id) : [...d.permissionIds, id] }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const body = { name: draft.name, description: draft.description, permissionIds: draft.permissionIds };
    const ok = await run(
      () =>
        editing
          ? apiRequest(`/rbac/admin/roles/${encodeURIComponent(editing)}`, { method: "PUT", body: JSON.stringify(body) })
          : apiRequest("/rbac/admin/roles", { method: "POST", body: JSON.stringify({ code: draft.code, ...body }) }),
      editing ? "Role updated." : "Role created.",
    );
    if (ok) reset();
  }

  return (
    <div className="workspace-grid">
      <section className="panel">
        <div className="panel-head">
          <div><h2 className="panel-title">Roles</h2><div className="panel-subtitle">Roles bundle permissions</div></div>
        </div>
        <div className="record-list">
          {catalog.roles.map((row) => (
            <article className="record" key={row.id}>
              <div className="record-art">⛨</div>
              <div className="record-main">
                <div className="record-title">{row.name}</div>
                <div className="record-meta"><span className="badge">{row.code}</span><span>{row.permissionIds.length} permission{row.permissionIds.length === 1 ? "" : "s"}</span></div>
              </div>
              <div className="row-actions">
                <button className="icon-button" title="Edit" onClick={() => startEdit(row)}>✎</button>
                <button className="icon-button danger" title="Delete" onClick={() => {
                  if (window.confirm(`Delete role "${row.code}"?`))
                    run(() => apiRequest(`/rbac/admin/roles/${encodeURIComponent(row.id)}`, { method: "DELETE" }), "Role deleted.");
                }}>×</button>
              </div>
            </article>
          ))}
          {catalog.roles.length === 0 && <div className="empty-state">No roles yet.</div>}
        </div>
      </section>

      <section className="panel form-panel">
        <div className="panel-head">
          <div><h2 className="panel-title">{editing ? "Edit role" : "Create role"}</h2><div className="panel-subtitle">{editing ? `Editing ${editing}` : "POST · New role"}</div></div>
          {editing && <button className="button secondary" onClick={reset}>Cancel</button>}
        </div>
        <form onSubmit={submit}>
          <div className="form-content">
            <Field label="CODE"><input value={draft.code} onChange={(e) => setDraft({ ...draft, code: e.target.value })} disabled={Boolean(editing)} required placeholder="e.g. books_manager_role" /></Field>
            <Field label="NAME"><input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} required placeholder="e.g. Books manager" /></Field>
            <Field label="DESCRIPTION"><textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="What this role can do" /></Field>
            <Field label={`PERMISSIONS (${draft.permissionIds.length})`}>
              <div className="check-grid">
                {catalog.permissions.map((p) => (
                  <label key={p.id} className="check-item">
                    <input type="checkbox" checked={draft.permissionIds.includes(p.id)} onChange={() => toggle(p.id)} />
                    <span>{p.code}</span>
                  </label>
                ))}
              </div>
            </Field>
          </div>
          <div className="form-actions">
            <button className="button primary full" type="submit" disabled={busy}>{busy ? "Saving…" : editing ? "Save changes" : "+ Create role"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}

// ---- Personas -------------------------------------------------------------
function PersonasSection({ catalog, run, busy }: SectionProps) {
  const empty = { code: "", name: "", description: "", roleIds: [] as string[] };
  const [draft, setDraft] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);

  function startEdit(row: PersonaRow) {
    setEditing(row.id);
    setDraft({ code: row.code, name: row.name, description: row.description, roleIds: [...row.roleIds] });
  }
  function reset() {
    setEditing(null);
    setDraft(empty);
  }
  function toggle(id: string) {
    setDraft((d) => ({ ...d, roleIds: d.roleIds.includes(id) ? d.roleIds.filter((r) => r !== id) : [...d.roleIds, id] }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const body = { name: draft.name, description: draft.description, roleIds: draft.roleIds };
    const ok = await run(
      () =>
        editing
          ? apiRequest(`/rbac/admin/personas/${encodeURIComponent(editing)}`, { method: "PUT", body: JSON.stringify(body) })
          : apiRequest("/rbac/admin/personas", { method: "POST", body: JSON.stringify({ code: draft.code, ...body }) }),
      editing ? "Persona updated." : "Persona created.",
    );
    if (ok) reset();
  }

  return (
    <div className="workspace-grid">
      <section className="panel">
        <div className="panel-head">
          <div><h2 className="panel-title">Personas</h2><div className="panel-subtitle">Personas bundle roles</div></div>
        </div>
        <div className="record-list">
          {catalog.personas.map((row) => (
            <article className="record" key={row.id}>
              <div className="record-art">⚿</div>
              <div className="record-main">
                <div className="record-title">{row.name}</div>
                <div className="record-meta"><span className="badge">{row.code}</span><span>{row.roleIds.length} role{row.roleIds.length === 1 ? "" : "s"}</span></div>
              </div>
              <div className="row-actions">
                <button className="icon-button" title="Edit" onClick={() => startEdit(row)}>✎</button>
                <button className="icon-button danger" title="Delete" onClick={() => {
                  if (window.confirm(`Delete persona "${row.code}"?`))
                    run(() => apiRequest(`/rbac/admin/personas/${encodeURIComponent(row.id)}`, { method: "DELETE" }), "Persona deleted.");
                }}>×</button>
              </div>
            </article>
          ))}
          {catalog.personas.length === 0 && <div className="empty-state">No personas yet.</div>}
        </div>
      </section>

      <section className="panel form-panel">
        <div className="panel-head">
          <div><h2 className="panel-title">{editing ? "Edit persona" : "Create persona"}</h2><div className="panel-subtitle">{editing ? `Editing ${editing}` : "POST · New persona"}</div></div>
          {editing && <button className="button secondary" onClick={reset}>Cancel</button>}
        </div>
        <form onSubmit={submit}>
          <div className="form-content">
            <Field label="CODE"><input value={draft.code} onChange={(e) => setDraft({ ...draft, code: e.target.value })} disabled={Boolean(editing)} required placeholder="e.g. rbac_manager" /></Field>
            <Field label="NAME"><input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} required placeholder="e.g. RBAC manager" /></Field>
            <Field label="DESCRIPTION"><textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="Who this persona is for" /></Field>
            <Field label={`ROLES (${draft.roleIds.length})`}>
              <div className="check-grid">
                {catalog.roles.map((r) => (
                  <label key={r.id} className="check-item">
                    <input type="checkbox" checked={draft.roleIds.includes(r.id)} onChange={() => toggle(r.id)} />
                    <span>{r.code}</span>
                  </label>
                ))}
              </div>
            </Field>
          </div>
          <div className="form-actions">
            <button className="button primary full" type="submit" disabled={busy}>{busy ? "Saving…" : editing ? "Save changes" : "+ Create persona"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}

// ---- User assignments -----------------------------------------------------
function UsersSection({ catalog, run, busy }: SectionProps) {
  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    setSelectedUserId((current) => current || catalog.users[0]?.id || "");
  }, [catalog.users]);

  const selected = useMemo(() => catalog.users.find((u) => u.id === selectedUserId) ?? null, [catalog.users, selectedUserId]);
  const [draftPersonaIds, setDraftPersonaIds] = useState<string[]>([]);

  useEffect(() => {
    setDraftPersonaIds(selected?.personaIds ?? []);
  }, [selected]);

  function toggle(id: string) {
    setDraftPersonaIds((ids) => (ids.includes(id) ? ids.filter((p) => p !== id) : [...ids, id]));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;
    await run(
      () => apiRequest(`/rbac/admin/users/${encodeURIComponent(selected.id)}/personas`, { method: "PUT", body: JSON.stringify({ personaIds: draftPersonaIds }) }),
      `Personas updated for ${selected.fullName}.`,
    );
  }

  return (
    <div className="workspace-grid">
      <section className="panel">
        <div className="panel-head">
          <div><h2 className="panel-title">Users</h2><div className="panel-subtitle">Select a user to assign personas</div></div>
        </div>
        <div className="record-list">
          {catalog.users.map((row) => (
            <button
              key={row.id}
              className={`rbac-match ${selectedUserId === row.id ? "selected" : ""}`}
              onClick={() => setSelectedUserId(row.id)}
              style={{ margin: "4px 12px" }}
            >
              <span className="rbac-match-name">{row.fullName}</span>
              <span className="rbac-match-email">{row.email}</span>
              <span className="badge">{row.personaIds.length} persona{row.personaIds.length === 1 ? "" : "s"}</span>
            </button>
          ))}
          {catalog.users.length === 0 && <div className="empty-state">No users found.</div>}
        </div>
      </section>

      <section className="panel form-panel">
        <div className="panel-head">
          <div><h2 className="panel-title">Assign personas</h2><div className="panel-subtitle">{selected ? `Editing ${selected.fullName}` : "Select a user"}</div></div>
        </div>
        {selected ? (
          <form onSubmit={submit}>
            <div className="form-content">
              <p className="form-intro">{selected.email}</p>
              <Field label={`PERSONAS (${draftPersonaIds.length})`}>
                <div className="check-grid">
                  {catalog.personas.map((p) => (
                    <label key={p.id} className="check-item">
                      <input type="checkbox" checked={draftPersonaIds.includes(p.id)} onChange={() => toggle(p.id)} />
                      <span>{p.name} <small style={{ color: "var(--muted)" }}>({p.code})</small></span>
                    </label>
                  ))}
                </div>
              </Field>
            </div>
            <div className="form-actions">
              <button className="button primary full" type="submit" disabled={busy}>{busy ? "Saving…" : "Save persona assignments"}</button>
            </div>
          </form>
        ) : (
          <div className="empty-state">Select a user from the list.</div>
        )}
      </section>
    </div>
  );
}
