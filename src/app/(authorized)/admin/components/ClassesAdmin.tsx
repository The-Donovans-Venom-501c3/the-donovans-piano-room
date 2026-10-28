"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api/api";

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

export default function ClassesAdmin() {
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [permissions, setPermissions] = useState<Permission | null>(null);
  const [schools, setSchools] = useState<SchoolOption[]>([]);
  const [people, setPeople] = useState<{ teacher: Person[]; student: Person[] }>({ teacher: [], student: [] });
  const [selectedId, setSelectedId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ClassDraft>(blankDraft);
  const [selectedPeople, setSelectedPeople] = useState<{ teacher: string[]; student: string[] }>({ teacher: [], student: [] });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

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
      setSelectedId((current) => rows.some((row) => row.id === current) ? current : rows[0]?.id ?? "");
    } catch (requestError) {
      setError(errorMessage(requestError));
      setClasses([]);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const selectedClass = useMemo(() => classes.find((item) => item.id === selectedId) ?? null, [classes, selectedId]);

  useEffect(() => {
    if (!selectedId) return;
    let active = true;
    apiRequest<ClassRecord>(`/classMgr/classes/${encodeURIComponent(selectedId)}`, { cache: "no-store" })
      .then((row) => { if (active) setClasses((current) => current.map((item) => item.id === row.id ? { ...item, ...row } : item)); })
      .catch((requestError) => { if (active) setError(errorMessage(requestError)); });
    return () => { active = false; };
  }, [selectedId]);

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

  function resetForm() { setEditingId(null); setDraft(blankDraft()); }

  async function beginEdit(item: ClassRecord) {
    if (!permissions?.edit) return;
    setError("");
    try {
      const current = await apiRequest<ClassRecord>(`/classMgr/classes/${encodeURIComponent(item.id)}`, { cache: "no-store" });
      setClasses((rows) => rows.map((row) => row.id === current.id ? { ...row, ...current } : row));
      setEditingId(current.id);
      setDraft({ name: current.name, subject: current.subject, description: current.description, schedule: current.schedule, room: current.room, schoolId: current.schoolId ?? "" });
      setSelectedPeople({
        teacher: (current.teachers ?? []).map((person) => person.userId ?? person.id),
        student: (current.students ?? []).map((person) => person.userId ?? person.id),
      });
    } catch (requestError) { setError(errorMessage(requestError)); }
  }

  async function saveClass(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editingId ? !permissions?.edit : !permissions?.create) return;
    setBusy(true);
    setError("");
    const body = { ...draft, schoolId: draft.schoolId || null };
    try {
      let result: ClassRecord;
      if (editingId) {
        const access = permissions;
        if (!access) return;
        const current = await apiRequest<ClassRecord>(`/classMgr/classes/${encodeURIComponent(editingId)}`, { cache: "no-store" });
        result = await apiRequest<ClassRecord>(`/classMgr/classes/${encodeURIComponent(editingId)}`, { method: "PUT", body: JSON.stringify(body) });
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
        result = await apiRequest<ClassRecord>("/classMgr/classes", { method: "POST", body: JSON.stringify({ ...body, teacherIds: permissions?.add_teachers ? selectedPeople.teacher : [], studentIds: permissions?.add_students ? selectedPeople.student : [] }) });
      }
      await refresh();
      setSelectedId(result.id);
      resetForm();
    } catch (requestError) { setError(errorMessage(requestError)); }
    finally { setBusy(false); }
  }

  async function deleteClass(item: ClassRecord) {
    if (!permissions?.delete || !window.confirm(`Delete class ${item.name}?`)) return;
    setBusy(true);
    try {
      await apiRequest(`/classMgr/classes/${encodeURIComponent(item.id)}`, { method: "DELETE" });
      await refresh();
      if (editingId === item.id) resetForm();
    } catch (requestError) { setError(errorMessage(requestError)); }
    finally { setBusy(false); }
  }

  async function changeRoster(kind: "teacher" | "student", nextIds: string[]) {
    if (!selectedClass) return;
    const allowed = kind === "teacher" ? permissions?.add_teachers : permissions?.add_students;
    if (!allowed) return;
    const path = kind === "teacher" ? "teachers" : "students";
    const members = kind === "teacher" ? selectedClass.teachers ?? [] : selectedClass.students ?? [];
    const currentIds = members.map((person) => person.userId ?? person.id);
    const addIds = nextIds.filter((id) => !currentIds.includes(id));
    const removeIds = currentIds.filter((id) => !nextIds.includes(id));
    setBusy(true);
    try {
      if (addIds.length) await apiRequest(`/classMgr/classes/${encodeURIComponent(selectedClass.id)}/${path}`, { method: "POST", body: JSON.stringify({ userIds: addIds }) });
      await Promise.all(removeIds.map((id) => apiRequest(`/classMgr/classes/${encodeURIComponent(selectedClass.id)}/${path}/${encodeURIComponent(id)}`, { method: "DELETE" })));
      const updated = await apiRequest<ClassRecord>(`/classMgr/classes/${encodeURIComponent(selectedClass.id)}`, { cache: "no-store" });
      setClasses((current) => current.map((row) => row.id === updated.id ? { ...row, ...updated } : row));
      setError("");
    } catch (requestError) { setError(errorMessage(requestError)); }
    finally { setBusy(false); }
  }

  function togglePerson(kind: "teacher" | "student", id: string) {
    setSelectedPeople((current) => ({ ...current, [kind]: current[kind].includes(id) ? current[kind].filter((item) => item !== id) : [...current[kind], id] }));
  }

  if (loading) return <div className="content"><section className="panel"><div className="empty-state">Loading classes…</div></section></div>;
  if (!permissions?.view) return <div className="content"><section className="panel"><div className="empty-state">{error || "You don't have permission to view classes."}</div></section></div>;

  return (
    <div className="content">
      <div className="header-row"><div><div className="eyebrow">Class administration</div><h1 className="page-title">Classes</h1><p className="page-description">Manage classes and teacher/student rosters.</p></div><div className="stat-row"><div className="stat-card"><div className="stat-number">{classes.length}</div><div className="stat-label">Classes</div></div></div></div>
      {error && <section className="panel"><div className="empty-state" role="alert">{error}</div></section>}
      <div className="workspace-grid">
        <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Class directory</h2><div className="panel-subtitle">{classes.length} classes</div></div>{permissions.create && <button className="button primary" onClick={() => { resetForm(); setSelectedPeople({ teacher: [], student: [] }); }}>＋ New class</button>}</div>
          <div className="record-list">{classes.map((item) => <article className={`record ${selectedId === item.id ? "selected" : ""}`} key={item.id}><div className="record-art">♫</div><div className="record-main"><div className="record-title">{item.name}</div><div className="record-meta"><span>{item.subject || "General"}</span><span>{item.schoolName || "Organization-wide"}</span><span>{item.teacherCount} teachers</span><span>{item.studentCount} students</span></div></div><div className="row-actions"><button className="icon-button" title="View class" onClick={() => setSelectedId(item.id)}>◉</button>{permissions.edit && <button className="icon-button" title="Edit class" onClick={() => beginEdit(item)}>✎</button>}{permissions.delete && <button className="icon-button danger" title="Delete class" onClick={() => void deleteClass(item)}>×</button>}</div></article>)}{!classes.length && <div className="empty-state">No classes found.</div>}</div>
        </section>
        {(permissions.create || (permissions.edit && editingId)) && <section className="panel form-panel"><div className="panel-head"><div><h2 className="panel-title">{editingId ? "Edit class" : "Create class"}</h2><div className="panel-subtitle">{editingId ? `Editing ${editingId}` : "Class details"}</div></div>{editingId && <button className="button secondary" onClick={resetForm}>Cancel</button>}</div>
          <form onSubmit={saveClass}><div className="form-content"><div className="field"><label htmlFor="class-name">CLASS NAME</label><input id="class-name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} maxLength={200} required /></div><div className="two-columns"><div className="field"><label htmlFor="class-subject">SUBJECT</label><input id="class-subject" value={draft.subject} onChange={(event) => setDraft({ ...draft, subject: event.target.value })} maxLength={100} /></div><div className="field"><label htmlFor="class-room">ROOM</label><input id="class-room" value={draft.room} onChange={(event) => setDraft({ ...draft, room: event.target.value })} maxLength={100} /></div></div><div className="two-columns"><div className="field"><label htmlFor="class-schedule">SCHEDULE</label><input id="class-schedule" value={draft.schedule} onChange={(event) => setDraft({ ...draft, schedule: event.target.value })} maxLength={200} /></div><div className="field"><label htmlFor="class-school">SCHOOL</label><select id="class-school" value={draft.schoolId} onChange={(event) => setDraft({ ...draft, schoolId: event.target.value })}><option value="">Organization-wide</option>{schools.map((school) => <option key={school.id} value={school.id}>{school.name}</option>)}</select></div></div><div className="field"><label htmlFor="class-description">DESCRIPTION</label><textarea id="class-description" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} maxLength={2000} /></div>
            {permissions.add_teachers && <fieldset className="field"><legend>Teachers</legend><div className="check-grid">{people.teacher.map((person) => <label className="check-item" key={person.id}><input type="checkbox" checked={selectedPeople.teacher.includes(person.userId ?? person.id)} onChange={() => togglePerson("teacher", person.userId ?? person.id)} /><span>{person.fullName} <small>({person.email})</small></span></label>)}{!people.teacher.length && <small>No users assigned the teacher persona.</small>}</div></fieldset>}
            {permissions.add_students && <fieldset className="field"><legend>Students</legend><div className="check-grid">{people.student.map((person) => <label className="check-item" key={person.id}><input type="checkbox" checked={selectedPeople.student.includes(person.userId ?? person.id)} onChange={() => togglePerson("student", person.userId ?? person.id)} /><span>{person.fullName} <small>({person.email})</small></span></label>)}{!people.student.length && <small>No users assigned the student persona.</small>}</div></fieldset>}
          </div><div className="form-actions"><button type="submit" className="button primary full" disabled={busy}>{busy ? "Saving…" : editingId ? "Save class changes" : "Create class"}</button></div></form>
        </section>}
        {selectedClass && <section className="panel"><div className="panel-head"><div><h2 className="panel-title">{selectedClass.name}</h2><div className="panel-subtitle">Class rosters</div></div></div>
          {(["teacher", "student"] as const).map((kind) => { const allowed = kind === "teacher" ? permissions.add_teachers : permissions.add_students; const members = kind === "teacher" ? selectedClass.teachers ?? [] : selectedClass.students ?? []; return <div className="form-content" key={kind}><h3 className="panel-title">{kind === "teacher" ? "Teachers" : "Students"}</h3>{allowed ? <div className="check-grid">{people[kind].map((person) => { const assigned = members.some((member) => (member.userId ?? member.id) === person.id); return <label className="check-item" key={person.id}><input type="checkbox" checked={assigned} disabled={busy} onChange={(event) => { const current = members.map((member) => member.userId ?? member.id); void changeRoster(kind, event.target.checked ? [...current, person.id] : current.filter((id) => id !== person.id)); }} /><span>{person.fullName} <small>({person.email})</small></span></label>; })}{!people[kind].length && <small>No users assigned the {kind} persona.</small>}</div> : <p className="form-intro">{members.map((person) => `${person.fullName} (${person.email})`).join(", ") || `No ${kind}s assigned.`}</p>}</div>; })}
        </section>}
      </div>
    </div>
  );
}
