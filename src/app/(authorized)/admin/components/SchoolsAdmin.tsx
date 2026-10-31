"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api/api";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";

type Person = { id: string; userId?: string; fullName: string; email: string };
type School = {
  id: string;
  name: string;
  address: string;
  description: string;
  teacherCount: number;
  studentCount: number;
  principalCount: number;
  teachers?: Person[];
  students?: Person[];
  principals?: Person[];
};
type Permission = { view: boolean; create: boolean; edit: boolean; delete: boolean; add_teachers: boolean; add_students: boolean; add_principals: boolean };
type PermissionResponse = { actions: Permission };
type SchoolDraft = { name: string; address: string; description: string };

const blankDraft = (): SchoolDraft => ({ name: "", address: "", description: "" });
const errorMessage = (error: unknown) => error instanceof Error ? error.message : "Something went wrong.";
const RESOURCE_ACTIONS = ["view", "create", "edit", "delete", "add_principals", "add_teachers", "add_students"] as const;

export default function SchoolsAdmin() {
  const [schools, setSchools] = useState<School[]>([]);
  const [permissions, setPermissions] = useState<Permission | null>(null);
  const [people, setPeople] = useState<Record<string, Person[]>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<SchoolDraft>(blankDraft);
  const [selectedPeople, setSelectedPeople] = useState<Record<string, string[]>>({ principal: [], teacher: [], student: [] });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ text: string; error?: boolean } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<School | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const notify = useCallback((text: string, isError = false) => {
    setToast({ text, error: isError });
    window.setTimeout(() => setToast(null), 3500);
  }, []);

  const refresh = useCallback(async () => {
    setError("");
    try {
      const access = await apiRequest<PermissionResponse>("/rbac/me/permissions/schools", { cache: "no-store" });
      setPermissions(access.actions);
      if (!access.actions.view) {
        setSchools([]);
        return;
      }
      const rows = await apiRequest<School[]>("/schoolMgr/schools", { cache: "no-store" });
      setSchools(rows);
    } catch (requestError) {
      setError(errorMessage(requestError));
      setSchools([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  useEffect(() => {
    const needed: Array<[string, boolean]> = [
      ["principal", !!permissions?.add_principals],
      ["teacher", !!permissions?.add_teachers],
      ["student", !!permissions?.add_students],
    ];
    let active = true;
    void Promise.all(needed.filter(([, allowed]) => allowed).map(async ([persona]) => {
      try {
        const rows = await apiRequest<Person[]>(`/schoolMgr/schools/people/${persona}`, { cache: "no-store" });
        if (active) setPeople((current) => ({ ...current, [persona]: rows }));
      } catch { if (active) setPeople((current) => ({ ...current, [persona]: [] })); }
    }));
    return () => { active = false; };
  }, [permissions]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return schools.filter((school) =>
      [school.name, school.address, school.description].some((value) => value?.toLowerCase().includes(term)),
    );
  }, [schools, search]);

  function resetForm() { setEditingId(null); setDraft(blankDraft()); setSelectedPeople({ principal: [], teacher: [], student: [] }); }

  async function beginEdit(school: School) {
    if (!permissions?.edit) return;
    try {
      const current = await apiRequest<School>(`/schoolMgr/schools/${encodeURIComponent(school.id)}`, { cache: "no-store" });
      setSchools((rows) => rows.map((row) => row.id === current.id ? { ...row, ...current } : row));
      setEditingId(current.id);
      setDraft({ name: current.name, address: current.address, description: current.description });
      setSelectedPeople({
        principal: (current.principals ?? []).map((person) => person.userId ?? person.id),
        teacher: (current.teachers ?? []).map((person) => person.userId ?? person.id),
        student: (current.students ?? []).map((person) => person.userId ?? person.id),
      });
    } catch (requestError) { notify(errorMessage(requestError), true); }
  }

  async function saveSchool(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editingId ? !permissions?.edit : !permissions?.create) return;
    setBusy(true);
    try {
      if (editingId) {
        const access = permissions;
        if (!access) return;
        const current = await apiRequest<School>(`/schoolMgr/schools/${encodeURIComponent(editingId)}`, { cache: "no-store" });
        const id = (await apiRequest<School>(`/schoolMgr/schools/${encodeURIComponent(editingId)}`, { method: "PUT", body: JSON.stringify(draft) })).id;
        const assignments = [
          { persona: "principal" as const, path: "principals", allowed: access.add_principals, members: current.principals ?? [] },
          { persona: "teacher" as const, path: "teachers", allowed: access.add_teachers, members: current.teachers ?? [] },
          { persona: "student" as const, path: "students", allowed: access.add_students, members: current.students ?? [] },
        ];
        for (const assignment of assignments) {
          if (!assignment.allowed) continue;
          const currentIds = assignment.members.map((person) => person.userId ?? person.id);
          const nextIds = selectedPeople[assignment.persona];
          const addIds = nextIds.filter((userId) => !currentIds.includes(userId));
          const removeIds = currentIds.filter((userId) => !nextIds.includes(userId));
          if (addIds.length) await apiRequest(`/schoolMgr/schools/${encodeURIComponent(id)}/${assignment.path}`, { method: "POST", body: JSON.stringify({ userIds: addIds }) });
          await Promise.all(removeIds.map((userId) => apiRequest(`/schoolMgr/schools/${encodeURIComponent(id)}/${assignment.path}/${encodeURIComponent(userId)}`, { method: "DELETE" })));
        }
      } else {
        await apiRequest<School>("/schoolMgr/schools", {
            method: "POST",
            body: JSON.stringify({
              ...draft,
              principalIds: permissions?.add_principals ? selectedPeople.principal : [],
              teacherIds: permissions?.add_teachers ? selectedPeople.teacher : [],
              studentIds: permissions?.add_students ? selectedPeople.student : [],
            }),
          });
      }
      await refresh();
      notify(editingId ? "School updated." : "School created.");
      resetForm();
    } catch (requestError) { notify(errorMessage(requestError), true); }
    finally { setBusy(false); }
  }

  async function deleteSchool(school: School) {
    if (!permissions?.delete || busy) return;
    setDeleteError("");
    setBusy(true);
    try {
      await apiRequest(`/schoolMgr/schools/${encodeURIComponent(school.id)}`, { method: "DELETE" });
      setPendingDelete(null);
      await refresh();
      if (editingId === school.id) resetForm();
      notify("School deleted.");
    } catch (requestError) { setDeleteError(errorMessage(requestError)); }
    finally { setBusy(false); }
  }

  function togglePerson(persona: "principal" | "teacher" | "student", id: string) {
    setSelectedPeople((current) => ({
      ...current,
      [persona]: current[persona].includes(id) ? current[persona].filter((item) => item !== id) : [...current[persona], id],
    }));
  }

  if (loading) return <div className="content"><section className="panel"><div className="empty-state">Loading schools…</div></section></div>;

  if (!permissions?.view) return <div className="content"><section className="panel"><div className="empty-state">{error || "You don't have permission to view schools."}</div></section></div>;

  const assignmentOptions = [
    ["principal", "Principals", permissions.add_principals],
    ["teacher", "Teachers", permissions.add_teachers],
    ["student", "Students", permissions.add_students],
  ] as const;

  return (
    <div className="content">
      <div className="header-row">
        <div>
          <div className="eyebrow">School administration</div>
          <h1 className="page-title">Schools</h1>
          <p className="page-description">Manage schools and their principal, teacher, and student assignments.</p>
          {permissions && (
            <div className="perm-badges" aria-label="Your permissions on this resource">
              {RESOURCE_ACTIONS.map((action) => (
                <span className={`perm-badge ${permissions[action] ? "granted" : ""}`} key={action}>{action}</span>
              ))}
            </div>
          )}
        </div>
        <div className="stat-row"><div className="stat-card"><div className="stat-number">{schools.length}</div><div className="stat-label">Schools</div></div></div>
      </div>
      {error && <section className="panel"><div className="empty-state" role="alert">{error}</div></section>}
      <div className="workspace-grid">
        <section className="panel">
          <div className="panel-head"><div><h2 className="panel-title">School directory</h2><div className="panel-subtitle"></div></div><input className="search" type="search" placeholder="Search schools…" value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search schools" /></div>
          <div className="record-list">
            {filtered.map((school) => <article className="record" key={school.id}>
              <div className="record-art">⌂</div><div className="record-main"><div className="record-title">{school.name}</div><div className="record-meta"><span>{school.address || "No address"}</span><span>{school.principalCount} principals</span><span>{school.teacherCount} teachers</span><span>{school.studentCount} students</span></div></div>
              <div className="row-actions">{permissions.edit && <button className="icon-button" title="Edit school" onClick={() => beginEdit(school)}>✎</button>}{permissions.delete && <button type="button" className="icon-button danger" title="Delete school" disabled={busy} onClick={() => { setDeleteError(""); setPendingDelete(school); }}>×</button>}</div>
            </article>)}
            {filtered.length === 0 && <div className="empty-state"><div className="empty-icon">⌕</div>{search ? "No schools match your search." : "No schools found."}</div>}
          </div>
        </section>
        {(permissions.create || (permissions.edit && editingId)) && <section className="panel form-panel">
          <div className="panel-head"><div><h2 className="panel-title">{editingId ? "Edit school" : "Create a school"}</h2><div className="panel-subtitle">{editingId ? `Editing ${editingId}` : "POST · New school"}</div></div>{editingId && <button className="button secondary" onClick={resetForm}>Cancel</button>}</div>
          <form onSubmit={saveSchool}><div className="form-content">
            <div className="field"><label htmlFor="school-name">SCHOOL NAME</label><input id="school-name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} maxLength={200} required /></div>
            <div className="field"><label htmlFor="school-address">ADDRESS</label><input id="school-address" value={draft.address} onChange={(event) => setDraft({ ...draft, address: event.target.value })} maxLength={1000} /></div>
            <div className="field"><label htmlFor="school-description">DESCRIPTION</label><textarea id="school-description" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} maxLength={2000} /></div>
            {assignmentOptions.map(([persona, label, allowed]) => allowed && <fieldset className="field" key={persona}><legend>{label}</legend><div className="check-grid">{(people[persona] ?? []).map((person) => <label className="check-item" key={person.id}><input type="checkbox" checked={selectedPeople[persona].includes(person.userId ?? person.id)} onChange={() => togglePerson(persona, person.userId ?? person.id)} /><span>{person.fullName} <small>({person.email})</small></span></label>)}{!(people[persona] ?? []).length && <small>No users assigned the {persona} persona.</small>}</div></fieldset>)}
          </div><div className="form-actions"><button type="submit" className="button primary full" disabled={busy}>{busy ? "Saving…" : editingId ? "Save school changes" : "+ Create school"}</button></div></form>
        </section>}
      </div>

      <Dialog
        open={pendingDelete !== null}
        onClose={() => { if (!busy) setPendingDelete(null); }}
        aria-labelledby="delete-school-title"
        aria-describedby="delete-school-description"
      >
        <DialogTitle id="delete-school-title">Delete school?</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-school-description">
            Permanently delete &quot;{pendingDelete?.name}&quot; and its school assignments? This cannot be undone.
          </DialogContentText>
          {deleteError && <p role="alert" className="mt-4 text-red-700">{deleteError}</p>}
        </DialogContent>
        <DialogActions>
          <Button autoFocus disabled={busy} onClick={() => setPendingDelete(null)} sx={{ color: "#6f219e", fontWeight: 700, "&:hover": { backgroundColor: "#f3e8fd" } }}>Cancel</Button>
          <Button color="error" disabled={busy || !permissions?.delete} onClick={() => { if (pendingDelete) void deleteSchool(pendingDelete); }}>
            {busy ? "Deleting…" : "Delete school"}
          </Button>
        </DialogActions>
      </Dialog>
      {toast && <div className={`toast ${toast.error ? "error" : ""}`} role="status">{toast.text}</div>}
    </div>
  );
}
