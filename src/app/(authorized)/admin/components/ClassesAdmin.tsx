"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api/api";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";

type Person = { id: string; userId?: string; fullName: string; email: string };
type SchoolOption = { id: string; name: string };
type ClassRecord = {
  id: string;
  name: string;
  subject: string;
  description: string;
  schedule: string;
  room: string;
  schoolId: string | null;
  schoolName?: string | null;
  teacherCount: number;
  studentCount: number;
  teachers?: Person[];
  students?: Person[];
};
type Permission = { view: boolean; create: boolean; edit: boolean; delete: boolean; add_teachers: boolean; add_students: boolean };
type PermissionResponse = { actions: Permission };
type ClassDraft = { name: string; subject: string; description: string; schedule: string; room: string; schoolId: string };

const blankDraft = (): ClassDraft => ({ name: "", subject: "", description: "", schedule: "", room: "", schoolId: "" });
const errorMessage = (error: unknown) => error instanceof Error ? error.message : "Something went wrong.";
const RESOURCE_ACTIONS = ["view", "create", "edit", "delete", "add_teachers", "add_students"] as const;

export default function ClassesAdmin() {
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [permissions, setPermissions] = useState<Permission | null>(null);
  const [schools, setSchools] = useState<SchoolOption[]>([]);
  const [people, setPeople] = useState<{ teacher: Person[]; student: Person[] }>({ teacher: [], student: [] });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ClassDraft>(blankDraft);
  const [selectedPeople, setSelectedPeople] = useState<{ teacher: string[]; student: string[] }>({ teacher: [], student: [] });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ text: string; error?: boolean } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ClassRecord | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const notify = useCallback((text: string, isError = false) => {
    setToast({ text, error: isError });
    window.setTimeout(() => setToast(null), 3500);
  }, []);

  const refresh = useCallback(async () => {
    setError("");
    try {
      const access = await apiRequest<PermissionResponse>("/rbac/me/permissions/classes", { cache: "no-store" });
      setPermissions(access.actions);
      if (!access.actions.view) {
        setClasses([]);
        return;
      }
      const rows = await apiRequest<ClassRecord[]>("/classMgr/classes", { cache: "no-store" });
      setClasses(rows);
    } catch (requestError) {
      setError(errorMessage(requestError));
      setClasses([]);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  useEffect(() => {
    let active = true;
    if (permissions?.create || permissions?.edit || permissions?.add_teachers || permissions?.add_students) {
      apiRequest<SchoolOption[]>("/schoolMgr/schools", { cache: "no-store" })
        .then((rows) => { if (active) setSchools(rows); })
        .catch(() => { if (active) setSchools([]); });
    }
    void Promise.all(([["teacher", !!permissions?.add_teachers], ["student", !!permissions?.add_students]] as const)
      .filter(([, allowed]) => allowed)
      .map(async ([persona]) => {
        try {
          const rows = await apiRequest<Person[]>(`/schoolMgr/schools/people/${persona}`, { cache: "no-store" });
          if (active) setPeople((current) => ({ ...current, [persona]: rows }));
        } catch { if (active) setPeople((current) => ({ ...current, [persona]: [] })); }
      }));
    return () => { active = false; };
  }, [permissions]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return classes.filter((item) =>
      [item.name, item.subject, item.schoolName, item.description].some((value) => value?.toLowerCase().includes(term)),
    );
  }, [classes, search]);

  function resetForm() { setEditingId(null); setDraft(blankDraft()); setSelectedPeople({ teacher: [], student: [] }); }

  async function beginEdit(item: ClassRecord) {
    if (!permissions?.edit) return;
    try {
      const current = await apiRequest<ClassRecord>(`/classMgr/classes/${encodeURIComponent(item.id)}`, { cache: "no-store" });
      setClasses((rows) => rows.map((row) => row.id === current.id ? { ...row, ...current } : row));
      setEditingId(current.id);
      setDraft({ name: current.name, subject: current.subject, description: current.description, schedule: current.schedule, room: current.room, schoolId: current.schoolId ?? "" });
      setSelectedPeople({
        teacher: (current.teachers ?? []).map((person) => person.userId ?? person.id),
        student: (current.students ?? []).map((person) => person.userId ?? person.id),
      });
    } catch (requestError) { notify(errorMessage(requestError), true); }
  }

  async function saveClass(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editingId ? !permissions?.edit : !permissions?.create) return;
    setBusy(true);
    const body = { ...draft, schoolId: draft.schoolId || null };
    try {
      if (editingId) {
        const access = permissions;
        if (!access) return;
        const current = await apiRequest<ClassRecord>(`/classMgr/classes/${encodeURIComponent(editingId)}`, { cache: "no-store" });
        await apiRequest<ClassRecord>(`/classMgr/classes/${encodeURIComponent(editingId)}`, { method: "PUT", body: JSON.stringify(body) });
        const assignments = [
          { kind: "teacher" as const, path: "teachers", allowed: access.add_teachers, members: current.teachers ?? [] },
          { kind: "student" as const, path: "students", allowed: access.add_students, members: current.students ?? [] },
        ];
        for (const assignment of assignments) {
          if (!assignment.allowed) continue;
          const currentIds = assignment.members.map((person) => person.userId ?? person.id);
          const nextIds = selectedPeople[assignment.kind];
          const addIds = nextIds.filter((userId) => !currentIds.includes(userId));
          const removeIds = currentIds.filter((userId) => !nextIds.includes(userId));
          if (addIds.length) await apiRequest(`/classMgr/classes/${encodeURIComponent(editingId)}/${assignment.path}`, { method: "POST", body: JSON.stringify({ userIds: addIds }) });
          await Promise.all(removeIds.map((userId) => apiRequest(`/classMgr/classes/${encodeURIComponent(editingId)}/${assignment.path}/${encodeURIComponent(userId)}`, { method: "DELETE" })));
        }
      } else {
        await apiRequest<ClassRecord>("/classMgr/classes", { method: "POST", body: JSON.stringify({ ...body, teacherIds: permissions?.add_teachers ? selectedPeople.teacher : [], studentIds: permissions?.add_students ? selectedPeople.student : [] }) });
      }
      await refresh();
      notify(editingId ? "Class updated." : "Class created.");
      resetForm();
    } catch (requestError) { notify(errorMessage(requestError), true); }
    finally { setBusy(false); }
  }

  async function deleteClass(item: ClassRecord) {
    if (!permissions?.delete || busy) return;
    setDeleteError("");
    setBusy(true);
    try {
      await apiRequest(`/classMgr/classes/${encodeURIComponent(item.id)}`, { method: "DELETE" });
      setPendingDelete(null);
      await refresh();
      if (editingId === item.id) resetForm();
      notify("Class deleted.");
    } catch (requestError) { setDeleteError(errorMessage(requestError)); }
    finally { setBusy(false); }
  }

  function togglePerson(kind: "teacher" | "student", id: string) {
    setSelectedPeople((current) => ({ ...current, [kind]: current[kind].includes(id) ? current[kind].filter((item) => item !== id) : [...current[kind], id] }));
  }

  if (loading) return <div className="content"><section className="panel"><div className="empty-state">Loading classes…</div></section></div>;
  if (!permissions?.view) return <div className="content"><section className="panel"><div className="empty-state">{error || "You don't have permission to view classes."}</div></section></div>;

  return (
    <div className="content">
      <div className="header-row">
        <div>
          <div className="eyebrow">Class administration</div>
          <h1 className="page-title">Classes</h1>
          <p className="page-description">Manage classes and teacher/student rosters.</p>
          {permissions && (
            <div className="perm-badges" aria-label="Your permissions on this resource">
              {RESOURCE_ACTIONS.map((action) => (
                <span className={`perm-badge ${permissions[action] ? "granted" : ""}`} key={action}>{action}</span>
              ))}
            </div>
          )}
        </div>
        <div className="stat-row"><div className="stat-card"><div className="stat-number">{classes.length}</div><div className="stat-label">Classes</div></div></div>
      </div>
      {error && <section className="panel"><div className="empty-state" role="alert">{error}</div></section>}
      <div className="workspace-grid">
        <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Class directory</h2><div className="panel-subtitle"></div></div><input className="search" type="search" placeholder="Search classes…" value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search classes" /></div>
          <div className="record-list">{filtered.map((item) => <article className="record" key={item.id}><div className="record-art">♫</div><div className="record-main"><div className="record-title">{item.name}</div><div className="record-meta"><span>{item.subject || "General"}</span><span>{item.schoolName || "Organization-wide"}</span><span>{item.teacherCount} teachers</span><span>{item.studentCount} students</span></div></div><div className="row-actions">{permissions.edit && <button className="icon-button" title="Edit class" onClick={() => beginEdit(item)}>✎</button>}{permissions.delete && <button type="button" className="icon-button danger" title="Delete class" disabled={busy} onClick={() => { setDeleteError(""); setPendingDelete(item); }}>×</button>}</div></article>)}{filtered.length === 0 && <div className="empty-state"><div className="empty-icon">⌕</div>{search ? "No classes match your search." : "No classes found."}</div>}</div>
        </section>
        {(permissions.create || (permissions.edit && editingId)) && <section className="panel form-panel"><div className="panel-head"><div><h2 className="panel-title">{editingId ? "Edit class" : "Create a class"}</h2><div className="panel-subtitle">{editingId ? `Editing ${editingId}` : "POST · New class"}</div></div>{editingId && <button className="button secondary" onClick={resetForm}>Cancel</button>}</div>
          <form onSubmit={saveClass}><div className="form-content"><div className="field"><label htmlFor="class-name">CLASS NAME</label><input id="class-name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} maxLength={200} required /></div><div className="two-columns"><div className="field"><label htmlFor="class-subject">SUBJECT</label><input id="class-subject" value={draft.subject} onChange={(event) => setDraft({ ...draft, subject: event.target.value })} maxLength={100} /></div><div className="field"><label htmlFor="class-room">ROOM</label><input id="class-room" value={draft.room} onChange={(event) => setDraft({ ...draft, room: event.target.value })} maxLength={100} /></div></div><div className="two-columns"><div className="field"><label htmlFor="class-schedule">SCHEDULE</label><input id="class-schedule" value={draft.schedule} onChange={(event) => setDraft({ ...draft, schedule: event.target.value })} maxLength={200} /></div><div className="field"><label htmlFor="class-school">SCHOOL</label><select id="class-school" value={draft.schoolId} onChange={(event) => setDraft({ ...draft, schoolId: event.target.value })}><option value="">Organization-wide</option>{schools.map((school) => <option key={school.id} value={school.id}>{school.name}</option>)}</select></div></div><div className="field"><label htmlFor="class-description">DESCRIPTION</label><textarea id="class-description" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} maxLength={2000} /></div>
            {permissions.add_teachers && <fieldset className="field"><legend>Teachers</legend><div className="check-grid">{people.teacher.map((person) => <label className="check-item" key={person.id}><input type="checkbox" checked={selectedPeople.teacher.includes(person.userId ?? person.id)} onChange={() => togglePerson("teacher", person.userId ?? person.id)} /><span>{person.fullName} <small>({person.email})</small></span></label>)}{!people.teacher.length && <small>No users assigned the teacher persona.</small>}</div></fieldset>}
            {permissions.add_students && <fieldset className="field"><legend>Students</legend><div className="check-grid">{people.student.map((person) => <label className="check-item" key={person.id}><input type="checkbox" checked={selectedPeople.student.includes(person.userId ?? person.id)} onChange={() => togglePerson("student", person.userId ?? person.id)} /><span>{person.fullName} <small>({person.email})</small></span></label>)}{!people.student.length && <small>No users assigned the student persona.</small>}</div></fieldset>}
          </div><div className="form-actions"><button type="submit" className="button primary full" disabled={busy}>{busy ? "Saving…" : editingId ? "Save class changes" : "+ Create class"}</button></div></form>
        </section>}
      </div>

      <Dialog
        open={pendingDelete !== null}
        onClose={() => { if (!busy) setPendingDelete(null); }}
        aria-labelledby="delete-class-title"
        aria-describedby="delete-class-description"
      >
        <DialogTitle id="delete-class-title">Delete class?</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-class-description">
            Permanently delete &quot;{pendingDelete?.name}&quot; and its teacher/student rosters? This cannot be undone.
          </DialogContentText>
          {deleteError && <p role="alert" className="mt-4 text-red-700">{deleteError}</p>}
        </DialogContent>
        <DialogActions>
          <Button autoFocus disabled={busy} onClick={() => setPendingDelete(null)} sx={{ color: "#6f219e", fontWeight: 700, "&:hover": { backgroundColor: "#f3e8fd" } }}>Cancel</Button>
          <Button color="error" disabled={busy || !permissions?.delete} onClick={() => { if (pendingDelete) void deleteClass(pendingDelete); }}>
            {busy ? "Deleting…" : "Delete class"}
          </Button>
        </DialogActions>
      </Dialog>
      {toast && <div className={`toast ${toast.error ? "error" : ""}`} role="status">{toast.text}</div>}
    </div>
  );
}
