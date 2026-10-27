"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api/api";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";

type NotificationType = { id: string; name: string; description: string | null };
type AdminNotification = {
  id: string;
  notificationTypeId: string;
  typeName: string;
  title: string;
  message: string;
  postedAt: string;
};
type NotificationDraft = { notificationTypeId: string; title: string; message: string };
type ResourcePermissions = { view: boolean; create: boolean; edit: boolean; delete: boolean; publish: boolean };
type PermissionResponse = { actions: ResourcePermissions };

const RESOURCE_ACTIONS = ["view", "create", "edit", "delete", "publish"] as const;

function recordError(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export default function NotificationsAdmin() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [types, setTypes] = useState<NotificationType[]>([]);
  const [permissions, setPermissions] = useState<ResourcePermissions | null>(null);
  const [draft, setDraft] = useState<NotificationDraft>({ notificationTypeId: "", title: "", message: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ text: string; error?: boolean } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminNotification | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const notify = useCallback((text: string, isError = false) => {
    setToast({ text, error: isError });
    window.setTimeout(() => setToast(null), 3500);
  }, []);

  const refresh = useCallback(async () => {
    setError("");
    try {
      const [rows, typeRows, access] = await Promise.all([
        apiRequest<AdminNotification[]>("/notificationMgr/notifications", { tags: ["notifications"] }),
        apiRequest<NotificationType[]>("/notificationMgr/notification-types", { tags: ["notifications"] }),
        apiRequest<PermissionResponse>("/rbac/me/permissions/notifications", { tags: ["notifications"] }),
      ]);
      setNotifications(rows);
      setTypes(typeRows);
      setPermissions(access.actions);
      setDraft((current) => ({
        ...current,
        notificationTypeId: current.notificationTypeId || typeRows[0]?.id || "",
      }));
    } catch (err) {
      setError(recordError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return notifications.filter((item) =>
      [item.title, item.message, item.typeName].some((value) => value?.toLowerCase().includes(term)),
    );
  }, [notifications, search]);

  function reset() {
    setEditingId(null);
    setDraft({ notificationTypeId: types[0]?.id ?? "", title: "", message: "" });
  }

  function startEdit(item: AdminNotification) {
    if (!permissions?.edit) return;
    setEditingId(item.id);
    setDraft({ notificationTypeId: item.notificationTypeId, title: item.title, message: item.message });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editingId ? !permissions?.edit : !permissions?.create) return;
    setBusy(true);
    try {
      await apiRequest(
        editingId ? `/notificationMgr/notifications/${encodeURIComponent(editingId)}` : "/notificationMgr/notifications",
        { method: editingId ? "PUT" : "POST", body: JSON.stringify(draft), invalidateTags: ["notifications"] },
      );
      await refresh();
      notify(editingId ? "Notification updated." : "Notification published.");
      reset();
    } catch (err) {
      notify(recordError(err), true);
    } finally {
      setBusy(false);
    }
  }

  async function remove(item: AdminNotification) {
    if (!permissions?.delete || busy) return;
    setDeleteError("");
    setBusy(true);
    try {
      await apiRequest(`/notificationMgr/notifications/${encodeURIComponent(item.id)}`, { method: "DELETE", invalidateTags: ["notifications"]  });
      setPendingDelete(null);
      await refresh();
      if (editingId === item.id) reset();
      notify("Notification deleted.");
    } catch (err) {
      setDeleteError(recordError(err));
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <div className="content"><div className="empty-state"><i className="spinner" /> Loading notifications…</div></div>;
  }

  return (
    <div className="content">
      <div className="header-row">
        <div>
          <div className="eyebrow">Notifications management</div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-description">Manage notifications.</p>
          {permissions && (
            <div className="perm-badges" aria-label="Your permissions on this resource">
              {RESOURCE_ACTIONS.map((action) => (
                <span className={`perm-badge ${permissions[action] ? "granted" : ""}`} key={action}>{action}</span>
              ))}
            </div>
          )}
        </div>
        <div className="stat-row">
          <div className="stat-card"><div className="stat-number">{notifications.length}</div><div className="stat-label">Notifications</div></div>
          <div className="stat-card"><div className="stat-number">{types.length}</div><div className="stat-label">Types</div></div>
        </div>
      </div>

      {error ? (
        <section className="panel"><div className="empty-state">{error}</div></section>
      ) : permissions?.view ? (
        <div className="workspace-grid">
          <section className="panel">
            <div className="panel-head">
              <div><h2 className="panel-title">Published notifications</h2><div className="panel-subtitle">GET · PUT · DELETE / notifications</div></div>
              <input className="search" type="search" placeholder="Search notifications…" value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search notifications" />
            </div>
            <div className="record-list">
              {filtered.map((item) => (
                <article className="record" key={item.id}>
                  <div className="record-art">✉</div>
                  <div className="record-main">
                    <div className="record-title">{item.title}</div>
                    <div className="record-meta">
                      <span className="badge">{item.typeName}</span>
                      <span>{new Date(item.postedAt).toLocaleDateString()}</span>
                      <span>{item.message.length > 80 ? `${item.message.slice(0, 80)}…` : item.message}</span>
                    </div>
                  </div>
                  <div className="row-actions">
                    {permissions?.edit && <button className="icon-button" title="Edit notification" aria-label={`Edit ${item.title}`} onClick={() => startEdit(item)}>✎</button>}
                    {permissions?.delete && <button type="button" className="icon-button danger" title="Delete notification" aria-label={`Delete ${item.title}`} disabled={busy} onClick={() => { setDeleteError(""); setPendingDelete(item); }}>×</button>}
                  </div>
                </article>
              ))}
              {filtered.length === 0 && <div className="empty-state"><div className="empty-icon">⌕</div>{search ? "No notifications match your search." : "No notifications yet. Publish one with the form."}</div>}
            </div>
          </section>

          {(permissions?.create || (permissions?.edit && editingId)) && (
            <section className="panel form-panel">
              <div className="panel-head">
                <div><h2 className="panel-title">{editingId ? "Edit notification" : "Publish a notification"}</h2><div className="panel-subtitle">{editingId ? `Editing ${editingId}` : "POST · New notification"}</div></div>
                {editingId && <button className="button secondary" onClick={reset}>Cancel edit</button>}
              </div>
              <form onSubmit={submit}>
                <div className="form-content">
                  <div className="field">
                    <label htmlFor="notif-type">TYPE</label>
                    <select id="notif-type" value={draft.notificationTypeId} onChange={(e) => setDraft({ ...draft, notificationTypeId: e.target.value })} required>
                      {types.length === 0 && <option value="">No types available</option>}
                      {types.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}
                    </select>
                  </div>
                  <div className="field"><label htmlFor="notif-title">TITLE</label><input id="notif-title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} required placeholder="e.g. New lesson available" /></div>
                  <div className="field"><label htmlFor="notif-message">MESSAGE</label><textarea id="notif-message" value={draft.message} onChange={(e) => setDraft({ ...draft, message: e.target.value })} required placeholder="Write the notification message…" /></div>
                  <div className="callout"><strong>Visibility</strong><br />Published notifications appear in every user&apos;s notification feed.</div>
                </div>
                <div className="form-actions">
                  <button className="button primary full" type="submit" disabled={busy}>{busy ? "Saving…" : editingId ? "Save notification changes" : "+ Publish notification"}</button>
                  {editingId && <button className="button secondary" type="button" onClick={reset}>Reset</button>}
                </div>
              </form>
            </section>
          )}
        </div>
      ) : (
        <section className="panel"><div className="empty-state">You don&apos;t have permission to view notifications.</div></section>
      )}

      <Dialog
        open={pendingDelete !== null}
        onClose={() => { if (!busy) setPendingDelete(null); }}
        aria-labelledby="delete-notification-title"
        aria-describedby="delete-notification-description"
      >
        <DialogTitle id="delete-notification-title">Delete notification?</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-notification-description">
            Permanently delete &quot;{pendingDelete?.title}&quot; for all users? This also removes its recipient read and dismissal records and cannot be undone.
          </DialogContentText>
          {deleteError && <p role="alert" className="mt-4 text-red-700">{deleteError}</p>}
        </DialogContent>
        <DialogActions>
          <Button autoFocus disabled={busy} onClick={() => setPendingDelete(null)}>Cancel</Button>
          <Button color="error" disabled={busy || !permissions?.delete} onClick={() => { if (pendingDelete) void remove(pendingDelete); }}>
            {busy ? "Deleting…" : "Delete notification"}
          </Button>
        </DialogActions>
      </Dialog>
      {toast && <div className={`toast ${toast.error ? "error" : ""}`} role="status">{toast.text}</div>}
    </div>
  );
}
