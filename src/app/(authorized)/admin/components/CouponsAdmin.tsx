"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api/api";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";

type Coupon = {
  couponCode: string;
  bookId: string | null;
  memberId: string | null;
  applicableTo: string;
  discount: string;
  expiration: string | null;
  discountType: string;
  minimumPurchase: string | null;
  maximumDiscount: string | null;
  usageLimit: number | null;
  usageCount: number;
  userUsageLimit: number | null;
  status: string;
};
type CouponDraft = {
  couponCode: string;
  applicableTo: string;
  discount: string;
  discountType: string;
  expiration: string;
  minimumPurchase: string;
  maximumDiscount: string;
  usageLimit: string;
  userUsageLimit: string;
  status: string;
};
type ResourcePermissions = { view: boolean; create: boolean; edit: boolean; delete: boolean; publish: boolean };
type PermissionResponse = { actions: ResourcePermissions };

const RESOURCE_ACTIONS = ["view", "create", "edit", "delete", "publish"] as const;

const makeDraft = (): CouponDraft => ({
  couponCode: `DEMO${Date.now().toString().slice(-6)}`,
  applicableTo: "all",
  discount: "10",
  discountType: "percentage",
  expiration: "2026-12-31",
  minimumPurchase: "0",
  maximumDiscount: "",
  usageLimit: "",
  userUsageLimit: "1",
  status: "active",
});

function recordError(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function toDraft(coupon: Coupon): CouponDraft {
  return {
    couponCode: coupon.couponCode,
    applicableTo: coupon.applicableTo,
    discount: String(coupon.discount),
    discountType: coupon.discountType,
    expiration: coupon.expiration ?? "",
    minimumPurchase: coupon.minimumPurchase ?? "0",
    maximumDiscount: coupon.maximumDiscount ?? "",
    usageLimit: coupon.usageLimit === null ? "" : String(coupon.usageLimit),
    userUsageLimit: coupon.userUsageLimit === null ? "1" : String(coupon.userUsageLimit),
    status: coupon.status,
  };
}

export default function CouponsAdmin() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [permissions, setPermissions] = useState<ResourcePermissions | null>(null);
  const [draft, setDraft] = useState<CouponDraft>(makeDraft);
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ text: string; error?: boolean } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Coupon | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const notify = useCallback((text: string, isError = false) => {
    setToast({ text, error: isError });
    window.setTimeout(() => setToast(null), 3500);
  }, []);

  const refresh = useCallback(async () => {
    setError("");
    try {
      const access = await apiRequest<PermissionResponse>("/rbac/me/permissions/coupons", { cache: "no-store" });
      setPermissions(access.actions);
      if (!access.actions.view) {
        setCoupons([]);
        return;
      }
      const rows = await apiRequest<Coupon[]>("/couponMgr/coupons", { tags: ["coupons"] });
      setCoupons(rows);
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
    return coupons.filter((coupon) =>
      [coupon.couponCode, coupon.applicableTo, coupon.status, coupon.discountType].some((value) =>
        value?.toLowerCase().includes(term),
      ),
    );
  }, [coupons, search]);

  function reset() {
    setEditingCode(null);
    setDraft(makeDraft());
  }

  function startEdit(coupon: Coupon) {
    if (!permissions?.edit) return;
    setEditingCode(coupon.couponCode);
    setDraft(toDraft(coupon));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editingCode ? !permissions?.edit : !permissions?.create) return;
    setBusy(true);
    try {
      const payload: Record<string, unknown> = {
        applicableTo: draft.applicableTo,
        discount: draft.discount,
        discountType: draft.discountType,
        minimumPurchase: draft.minimumPurchase || "0",
        status: draft.status,
      };
      if (draft.expiration) payload.expiration = draft.expiration;
      if (draft.maximumDiscount) payload.maximumDiscount = draft.maximumDiscount;
      if (draft.usageLimit) payload.usageLimit = Number(draft.usageLimit);
      if (draft.userUsageLimit) payload.userUsageLimit = Number(draft.userUsageLimit);

      await apiRequest(
        editingCode ? `/couponMgr/coupons/${encodeURIComponent(editingCode)}` : "/couponMgr/coupons",
        {
          method: editingCode ? "PUT" : "POST",
          body: JSON.stringify(editingCode ? payload : { couponCode: draft.couponCode, ...payload }),
          invalidateTags: ["coupons"],
        },
      );
      await refresh();
      notify(editingCode ? "Coupon updated." : "Coupon created.");
      reset();
    } catch (err) {
      notify(recordError(err), true);
    } finally {
      setBusy(false);
    }
  }

  async function remove(coupon: Coupon) {
    if (!permissions?.delete) return;
    if (busy) return;
    setDeleteError("");
    setBusy(true);
    try {
      await apiRequest(`/couponMgr/coupons/${encodeURIComponent(coupon.couponCode)}`,
       { method: "DELETE", invalidateTags: ["coupons"] });

      setPendingDelete(null);
      await refresh();
      if (editingCode === coupon.couponCode) reset();
      notify("Coupon deleted.");
    } catch (err) {
      setDeleteError(recordError(err));
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <div className="content"><div className="empty-state"><i className="spinner" /> Loading coupons…</div></div>;
  }

  return (
    <div className="content">
      <div className="header-row">
        <div>
          <div className="eyebrow">Coupons management</div>
          <h1 className="page-title">Coupons</h1>
          <p className="page-description">Manage discount coupons.</p>
          {permissions && (
            <div className="perm-badges" aria-label="Your permissions on this resource">
              {RESOURCE_ACTIONS.map((action) => (
                <span className={`perm-badge ${permissions[action] ? "granted" : ""}`} key={action}>{action}</span>
              ))}
            </div>
          )}
        </div>
        <div className="stat-row">
          <div className="stat-card"><div className="stat-number">{coupons.length}</div><div className="stat-label">Coupons</div></div>
          <div className="stat-card"><div className="stat-number">{coupons.filter((c) => c.status === "active").length}</div><div className="stat-label">Active</div></div>
        </div>
      </div>

      {error ? (
        <section className="panel"><div className="empty-state">{error}</div></section>
      ) : permissions?.view ? (
        <div className="workspace-grid">
          <section className="panel">
            <div className="panel-head">
              <div><h2 className="panel-title">Coupon records</h2><div className="panel-subtitle">GET · PUT · DELETE / coupons</div></div>
              <input className="search" type="search" placeholder="Search coupons…" value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search coupons" />
            </div>
            <div className="record-list">
              {filtered.map((coupon) => (
                <article className="record" key={coupon.couponCode}>
                  <div className="record-art">%</div>
                  <div className="record-main">
                    <div className="record-title">{coupon.couponCode}</div>
                    <div className="record-meta">
                      <span className="badge">{coupon.status}</span>
                      <span>{coupon.discountType === "percentage" ? `${coupon.discount}%` : `$${coupon.discount}`} off</span>
                      <span>{coupon.applicableTo}</span>
                      {coupon.expiration && <span>expires {coupon.expiration}</span>}
                    </div>
                  </div>
                  <div className="row-actions">
                    {permissions?.edit && <button className="icon-button" title="Edit coupon" aria-label={`Edit ${coupon.couponCode}`} onClick={() => startEdit(coupon)}>✎</button>}
                    {permissions?.delete && <button type="button" className="icon-button danger" title="Delete coupon" aria-label={`Delete ${coupon.couponCode}`} disabled={busy} onClick={() => { setDeleteError(""); setPendingDelete(coupon); }}>×</button>}
                  </div>
                </article>
              ))}
              {filtered.length === 0 && <div className="empty-state"><div className="empty-icon">⌕</div>{search ? "No coupons match your search." : "No coupons yet. Create one with the form."}</div>}
            </div>
          </section>

          {(permissions?.create || (permissions?.edit && editingCode)) && (
            <section className="panel form-panel">
              <div className="panel-head">
                <div><h2 className="panel-title">{editingCode ? "Edit coupon" : "Create a coupon"}</h2><div className="panel-subtitle">{editingCode ? `Editing ${editingCode}` : "POST · New coupon"}</div></div>
                {editingCode && <button className="button secondary" onClick={reset}>Cancel edit</button>}
              </div>
              <form onSubmit={submit}>
                <div className="form-content">
                  {!editingCode && (
                    <div className="field"><label htmlFor="coupon-code">COUPON CODE</label><input id="coupon-code" value={draft.couponCode} onChange={(e) => setDraft({ ...draft, couponCode: e.target.value })} required /></div>
                  )}
                  <div className="two-columns">
                    <div className="field"><label htmlFor="coupon-discount">DISCOUNT</label><input id="coupon-discount" type="number" min="0" step="0.01" value={draft.discount} onChange={(e) => setDraft({ ...draft, discount: e.target.value })} required /></div>
                    <div className="field"><label htmlFor="coupon-type">TYPE</label><select id="coupon-type" value={draft.discountType} onChange={(e) => setDraft({ ...draft, discountType: e.target.value })}><option value="percentage">Percentage</option><option value="fixed_amount">Fixed amount</option></select></div>
                  </div>
                  <div className="two-columns">
                    <div className="field"><label htmlFor="coupon-applies">APPLIES TO</label><select id="coupon-applies" value={draft.applicableTo} onChange={(e) => setDraft({ ...draft, applicableTo: e.target.value })}><option value="all">All</option><option value="book">Book</option><option value="membership">Membership</option></select></div>
                    <div className="field"><label htmlFor="coupon-expiry">EXPIRATION</label><input id="coupon-expiry" type="date" value={draft.expiration} onChange={(e) => setDraft({ ...draft, expiration: e.target.value })} /></div>
                  </div>
                  <div className="two-columns">
                    <div className="field"><label htmlFor="coupon-min">MIN PURCHASE ($)</label><input id="coupon-min" type="number" min="0" step="0.01" value={draft.minimumPurchase} onChange={(e) => setDraft({ ...draft, minimumPurchase: e.target.value })} /></div>
                    <div className="field"><label htmlFor="coupon-max">MAX DISCOUNT ($)</label><input id="coupon-max" type="number" min="0" step="0.01" value={draft.maximumDiscount} onChange={(e) => setDraft({ ...draft, maximumDiscount: e.target.value })} placeholder="Optional" /></div>
                  </div>
                  <div className="two-columns">
                    <div className="field"><label htmlFor="coupon-usage">USAGE LIMIT</label><input id="coupon-usage" type="number" min="0" value={draft.usageLimit} onChange={(e) => setDraft({ ...draft, usageLimit: e.target.value })} placeholder="Unlimited" /></div>
                    <div className="field"><label htmlFor="coupon-per-user">PER USER LIMIT</label><input id="coupon-per-user" type="number" min="1" value={draft.userUsageLimit} onChange={(e) => setDraft({ ...draft, userUsageLimit: e.target.value })} /></div>
                  </div>
                  <div className="field"><label htmlFor="coupon-status">STATUS</label><select id="coupon-status" value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
                </div>
                <div className="form-actions">
                  <button className="button primary full" type="submit" disabled={busy}>{busy ? "Saving…" : editingCode ? "Save coupon changes" : "+ Create coupon"}</button>
                  {editingCode && <button className="button secondary" type="button" onClick={reset}>Reset</button>}
                </div>
              </form>
            </section>
          )}
        </div>
      ) : (
        <section className="panel"><div className="empty-state">You don&apos;t have permission to view coupons.</div></section>
      )}

      <Dialog
        open={pendingDelete !== null}
        onClose={() => { if (!busy) setPendingDelete(null); }}
        aria-labelledby="delete-coupon-title"
        aria-describedby="delete-coupon-description"
      >
        <DialogTitle id="delete-coupon-title">Delete coupon?</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-coupon-description">
            Permanently delete coupon &quot;{pendingDelete?.couponCode}&quot;? This cannot be undone.
          </DialogContentText>
          {deleteError && <p role="alert" className="mt-4 text-red-700">{deleteError}</p>}
        </DialogContent>
        <DialogActions>
          <Button autoFocus disabled={busy} onClick={() => setPendingDelete(null)} sx={{ color: "#6f219e", fontWeight: 700, "&:hover": { backgroundColor: "#f3e8fd" } }}>Cancel</Button>
          <Button color="error" disabled={busy || !permissions?.delete} onClick={() => { if (pendingDelete) void remove(pendingDelete); }}>
            {busy ? "Deleting…" : "Delete coupon"}
          </Button>
        </DialogActions>
      </Dialog>
      {toast && <div className={`toast ${toast.error ? "error" : ""}`} role="status">{toast.text}</div>}
    </div>
  );
}
