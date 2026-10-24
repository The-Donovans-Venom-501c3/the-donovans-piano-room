"use client";

import { apiRequest } from "@/lib/api/api";
import { CSSProperties, FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type CalendarScope = "organization" | "user";
type EventType = "lesson" | "concert" | "recital" | "meeting" | "practice" | "other";
type CalendarView = "day" | "week" | "month" | "year";

type CalendarReminder = {
  id: string;
  userId: string | null;
  scope: CalendarScope;
  eventId: string | null;
  title: string;
  description: string;
  daysBefore: number;
  hoursBefore: number;
  minutesBefore: number;
  remindAt: string;
  color: string;
};

type CalendarEvent = {
  id: string;
  userId: string | null;
  scope: CalendarScope;
  eventType: EventType;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  allDay: boolean;
  color: string;
  reminders?: CalendarReminder[];
};

type CalendarPermissions = { actions: { view: boolean; create: boolean; edit: boolean; delete: boolean; publish: boolean } };

type ReminderOffsetDraft = { days: number; hours: number; minutes: number };

type EventDraft = {
  title: string;
  description: string;
  scope: CalendarScope;
  eventType: EventType;
  startAt: string;
  endAt: string;
  allDay: boolean;
  color: string;
  reminders: ReminderOffsetDraft[];
};

type ReminderDraft = {
  title: string;
  description: string;
  scope: CalendarScope;
  remindAt: string;
  color: string;
};

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: "lesson", label: "Lesson" },
  { value: "concert", label: "Concert" },
  { value: "recital", label: "Recital" },
  { value: "meeting", label: "Meeting" },
  { value: "practice", label: "Practice" },
  { value: "other", label: "Other" },
];

const DEFAULT_EVENT_COLOR = "#24694e";
const DEFAULT_REMINDER_COLOR = "#e98255";

function startOfDay(value: Date) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function startOfWeek(value: Date) {
  const date = startOfDay(value);
  date.setDate(date.getDate() - date.getDay());
  return date;
}

function monthStart(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), 1);
}

function addDays(value: Date, days: number) {
  const date = new Date(value);
  date.setDate(date.getDate() + days);
  return date;
}

function toLocalInput(value: Date) {
  const local = new Date(value.getTime() - value.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function parseDraftDate(value: string, allDay: boolean) {
  if (allDay && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  return new Date(value);
}

function createEventDraft(date: Date): EventDraft {
  const start = new Date(date);
  start.setHours(9, 0, 0, 0);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  return {
    title: "",
    description: "",
    scope: "user",
    eventType: "lesson",
    startAt: toLocalInput(start),
    endAt: toLocalInput(end),
    allDay: false,
    color: DEFAULT_EVENT_COLOR,
    reminders: [],
  };
}

function createReminderDraft(date: Date): ReminderDraft {
  const remindAt = new Date(date);
  remindAt.setHours(9, 0, 0, 0);
  return {
    title: "",
    description: "",
    scope: "user",
    remindAt: toLocalInput(remindAt),
    color: DEFAULT_REMINDER_COLOR,
  };
}

function rangeForView(date: Date, view: CalendarView) {
  if (view === "year") {
    return { from: new Date(date.getFullYear(), 0, 1), to: new Date(date.getFullYear() + 1, 0, 1) };
  }
  if (view === "day") {
    return { from: startOfDay(date), to: addDays(startOfDay(date), 1) };
  }
  if (view === "week") {
    const from = startOfWeek(date);
    return { from, to: addDays(from, 7) };
  }
  const first = monthStart(date);
  const from = startOfWeek(first);
  return { from, to: addDays(from, 42) };
}

function formatHeading(date: Date, view: CalendarView) {
  if (view === "year") return String(date.getFullYear());
  if (view === "day") return new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(date);
  if (view === "week") {
    const end = addDays(startOfWeek(date), 6);
    const sameYear = date.getFullYear() === end.getFullYear();
    const left = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(startOfWeek(date));
    const right = new Intl.DateTimeFormat(undefined, { month: sameYear ? undefined : "short", day: "numeric", year: "numeric" }).format(end);
    return `${left} – ${right}`;
  }
  return new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(date);
}

function sameDate(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate();
}

function eventVisibleOnDate(item: CalendarEvent, date: Date) {
  const start = startOfDay(new Date(item.startAt));
  const end = startOfDay(new Date(item.endAt));
  const target = startOfDay(date);
  return target >= start && target <= end;
}

function reminderVisibleOnDate(reminder: CalendarReminder, date: Date) {
  return sameDate(new Date(reminder.remindAt), date);
}

function formatOffset(reminder: { daysBefore: number; hoursBefore: number; minutesBefore: number }) {
  const parts: string[] = [];
  if (reminder.daysBefore) parts.push(`${reminder.daysBefore}d`);
  if (reminder.hoursBefore) parts.push(`${reminder.hoursBefore}h`);
  if (reminder.minutesBefore) parts.push(`${reminder.minutesBefore}m`);
  return parts.length ? `${parts.join(" ")} before` : "At event time";
}

export default function Calendar() {
  const [view, setView] = useState<CalendarView>("month");
  const [date, setDate] = useState(() => new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [standaloneReminders, setStandaloneReminders] = useState<CalendarReminder[]>([]);
  const [permissions, setPermissions] = useState<CalendarPermissions["actions"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [eventDraft, setEventDraft] = useState<EventDraft | null>(null);
  const [reminderDraft, setReminderDraft] = useState<ReminderDraft | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editingReminderId, setEditingReminderId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const range = useMemo(() => rangeForView(date, view), [date, view]);
  const loadItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const query = new URLSearchParams({ from: range.from.toISOString(), to: range.to.toISOString() });
      const [eventRows, reminderRows] = await Promise.all([
        apiRequest<CalendarEvent[]>(`/calendar/events?${query.toString()}`),
        apiRequest<CalendarReminder[]>(`/calendar/reminders?${query.toString()}`),
      ]);
      setEvents(eventRows);
      setStandaloneReminders(reminderRows.filter((reminder) => !reminder.eventId));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load calendar items.");
    } finally {
      setLoading(false);
    }
  }, [range.from, range.to]);

  useEffect(() => { void loadItems(); }, [loadItems]);

  useEffect(() => {
    let active = true;
    apiRequest<CalendarPermissions>("/rbac/me/permissions/calendar")
      .then((result) => { if (active) setPermissions(result.actions); })
      .catch((permissionError) => {
        if (active) setError(permissionError instanceof Error ? permissionError.message : "Unable to load calendar permissions.");
      });
    return () => { active = false; };
  }, []);

  const canEditItem = (scope: CalendarScope) => !!permissions?.edit && (scope !== "organization" || !!permissions?.publish);

  const move = (direction: number) => {
    const next = new Date(date);
    if (view === "day") next.setDate(next.getDate() + direction);
    else if (view === "week") next.setDate(next.getDate() + direction * 7);
    else if (view === "month") next.setMonth(next.getMonth() + direction);
    else next.setFullYear(next.getFullYear() + direction);
    setDate(next);
  };

  const openCreateEvent = (day = date) => {
    if (!permissions?.create) return;
    setEditingEventId(null);
    setEventDraft(createEventDraft(day));
  };

  const openEditEvent = (item: CalendarEvent) => {
    if (!canEditItem(item.scope)) return;
    setEditingEventId(item.id);
    setEventDraft({
      title: item.title,
      description: item.description ?? "",
      scope: item.scope,
      eventType: item.eventType,
      startAt: toLocalInput(new Date(item.startAt)),
      endAt: toLocalInput(new Date(item.endAt)),
      allDay: item.allDay,
      color: item.color,
      reminders: (item.reminders ?? [])
        .filter((reminder) => reminder.scope === item.scope)
        .map((reminder) => ({ days: reminder.daysBefore, hours: reminder.hoursBefore, minutes: reminder.minutesBefore })),
    });
  };

  const openCreateReminder = (day = date) => {
    if (!permissions?.create) return;
    setEditingReminderId(null);
    setReminderDraft(createReminderDraft(day));
  };

  const openEditReminder = (reminder: CalendarReminder) => {
    if (!canEditItem(reminder.scope)) return;
    setEditingReminderId(reminder.id);
    setReminderDraft({
      title: reminder.title,
      description: reminder.description ?? "",
      scope: reminder.scope,
      remindAt: toLocalInput(new Date(reminder.remindAt)),
      color: reminder.color,
    });
  };

  const saveEvent = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    if (!eventDraft) return;
    if (editingEventId ? !permissions?.edit : !permissions?.create) return;
    setSaving(true);
    setError("");
    try {
      const start = parseDraftDate(eventDraft.startAt, eventDraft.allDay);
      const end = parseDraftDate(eventDraft.endAt, eventDraft.allDay);
      if (eventDraft.allDay) {
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
      }
      if (end < start) throw new Error("The end time must be after the start time.");
      const body = JSON.stringify({
        title: eventDraft.title.trim(),
        description: eventDraft.description,
        scope: eventDraft.scope,
        eventType: eventDraft.eventType,
        startAt: start.toISOString(),
        endAt: end.toISOString(),
        allDay: eventDraft.allDay,
        color: eventDraft.color,
        reminders: eventDraft.reminders,
      });
      await apiRequest<CalendarEvent>(editingEventId ? `/calendar/events/${encodeURIComponent(editingEventId)}` : "/calendar/events", {
        method: editingEventId ? "PUT" : "POST",
        body,
      });
      setEventDraft(null);
      setEditingEventId(null);
      await loadItems();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save this event.");
    } finally {
      setSaving(false);
    }
  };

  const saveReminder = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    if (!reminderDraft) return;
    if (editingReminderId ? !permissions?.edit : !permissions?.create) return;
    setSaving(true);
    setError("");
    try {
      const remindAt = new Date(reminderDraft.remindAt);
      if (!Number.isFinite(remindAt.getTime())) throw new Error("Provide a valid reminder time.");
      const body = JSON.stringify({
        title: reminderDraft.title.trim(),
        description: reminderDraft.description,
        scope: reminderDraft.scope,
        remindAt: remindAt.toISOString(),
        color: reminderDraft.color,
      });
      await apiRequest<CalendarReminder>(editingReminderId ? `/calendar/reminders/${encodeURIComponent(editingReminderId)}` : "/calendar/reminders", {
        method: editingReminderId ? "PUT" : "POST",
        body,
      });
      setReminderDraft(null);
      setEditingReminderId(null);
      await loadItems();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save this reminder.");
    } finally {
      setSaving(false);
    }
  };

  const deleteEvent = async () => {
    if (!permissions?.delete || !editingEventId || !window.confirm("Delete this event and its reminders?")) return;
    setSaving(true);
    try {
      await apiRequest(`/calendar/events/${encodeURIComponent(editingEventId)}`, { method: "DELETE" });
      setEventDraft(null);
      setEditingEventId(null);
      await loadItems();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete this event.");
    } finally {
      setSaving(false);
    }
  };

  const deleteReminder = async () => {
    if (!permissions?.delete || !editingReminderId || !window.confirm("Delete this reminder?")) return;
    setSaving(true);
    try {
      await apiRequest(`/calendar/reminders/${encodeURIComponent(editingReminderId)}`, { method: "DELETE" });
      setReminderDraft(null);
      setEditingReminderId(null);
      await loadItems();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete this reminder.");
    } finally {
      setSaving(false);
    }
  };

  const weekStart = startOfWeek(date);
  const monthGridStart = startOfWeek(monthStart(date));
  const daysInView = view === "day" ? [startOfDay(date)] : Array.from({ length: view === "week" ? 7 : 42 }, (_, index) => addDays(view === "week" ? weekStart : monthGridStart, index));
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const scopeBadge = (scope: CalendarScope) => scope === "organization" ? <span className="calendar-badge">Org</span> : null;

  const renderEvent = (item: CalendarEvent, compact = false) => (
    <button type="button" disabled={!canEditItem(item.scope)} className={`calendar-event ${compact ? "compact" : ""}`} key={`event-${item.id}`} style={{ "--event-color": item.color } as CSSProperties} onClick={(clickEvent) => { clickEvent.stopPropagation(); openEditEvent(item); }} title={`${item.title} (${item.eventType})${item.description ? ` — ${item.description}` : ""}`}>
      <span className="calendar-event-dot" />
      <span className="calendar-event-title">{item.title}</span>
      {(item.reminders?.length ?? 0) > 0 && <span className="calendar-bell" title={item.reminders!.map(formatOffset).join(", ")}>🔔</span>}
      {!compact && !item.allDay && <time>{new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(item.startAt))}</time>}
      {!compact && scopeBadge(item.scope)}
    </button>
  );

  const renderReminder = (reminder: CalendarReminder, compact = false) => (
    <button type="button" disabled={!canEditItem(reminder.scope)} className={`calendar-event reminder ${compact ? "compact" : ""}`} key={`reminder-${reminder.id}`} style={{ "--event-color": reminder.color } as CSSProperties} onClick={(clickEvent) => { clickEvent.stopPropagation(); openEditReminder(reminder); }} title={`${reminder.title} (reminder)${reminder.description ? ` — ${reminder.description}` : ""}`}>
      <span className="calendar-event-dot" />
      <span className="calendar-event-title">{reminder.title}</span>
      {!compact && <time>{new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(reminder.remindAt))}</time>}
      {!compact && scopeBadge(reminder.scope)}
    </button>
  );

  const itemsForDay = (day: Date) => {
    const dayEvents = events.filter((item) => eventVisibleOnDate(item, day)).map((item) => ({ kind: "event" as const, item, sortKey: new Date(item.startAt).getTime() }));
    const dayReminders = standaloneReminders.filter((reminder) => reminderVisibleOnDate(reminder, day)).map((reminder) => ({ kind: "reminder" as const, item: reminder, sortKey: new Date(reminder.remindAt).getTime() }));
    return [...dayEvents, ...dayReminders].sort((left, right) => left.sortKey - right.sortKey);
  };

  const renderYear = () => (
    <div className="year-grid">
      {Array.from({ length: 12 }, (_, month) => {
        const first = new Date(date.getFullYear(), month, 1);
        const firstGridDay = startOfWeek(first);
        return (
          <button className="year-month" key={month} onClick={() => { setDate(first); setView("month"); }}>
            <strong>{new Intl.DateTimeFormat(undefined, { month: "long" }).format(first)}</strong>
            <div className="year-weekdays">{weekdays.map((day) => <span key={day}>{day[0]}</span>)}</div>
            <div className="year-days">
              {Array.from({ length: 42 }, (_, dayIndex) => {
                const day = addDays(firstGridDay, dayIndex);
                const count = itemsForDay(day).length;
                return <span className={`${day.getMonth() === month ? "" : "outside"} ${sameDate(day, new Date()) ? "today" : ""} ${count ? "has-items" : ""}`} key={dayIndex} title={count ? `${count} calendar item${count > 1 ? "s" : ""}` : undefined}>{day.getDate()}</span>;
              })}
            </div>
          </button>
        );
      })}
    </div>
  );

  const renderDays = () => (
    <div className={`calendar-days ${view === "day" ? "single-day" : ""}`}>
      {view !== "day" && <div className="calendar-weekdays">{weekdays.map((day) => <div key={day}>{day}</div>)}</div>}
      <div className="calendar-day-grid" style={{ "--calendar-columns": view === "day" ? 1 : 7, "--calendar-rows": view === "month" ? 6 : 1 } as CSSProperties}>
        {daysInView.map((day) => {
          const dayItems = itemsForDay(day);
          const inCurrentMonth = day.getMonth() === date.getMonth();
          return (
            <div className={`calendar-day ${view === "month" && !inCurrentMonth ? "outside" : ""} ${sameDate(day, new Date()) ? "today" : ""}`} key={day.toISOString()} role={permissions?.create ? "button" : undefined} tabIndex={permissions?.create ? 0 : -1} aria-label={permissions?.create ? `Create an event on ${new Intl.DateTimeFormat(undefined, { dateStyle: "full" }).format(day)}` : new Intl.DateTimeFormat(undefined, { dateStyle: "full" }).format(day)} onClick={() => permissions?.create && openCreateEvent(day)} onKeyDown={(keyEvent) => { if (permissions?.create && (keyEvent.key === "Enter" || keyEvent.key === " ")) { keyEvent.preventDefault(); openCreateEvent(day); } }}>
              <span className="calendar-day-number">{view === "week" && <small>{weekdays[day.getDay()]}</small>}{day.getDate()}</span>
              <span className="calendar-day-items">{dayItems.slice(0, view === "month" ? 3 : 12).map((entry) => entry.kind === "event" ? renderEvent(entry.item as CalendarEvent, view === "month") : renderReminder(entry.item as CalendarReminder, view === "month"))}{dayItems.length > (view === "month" ? 3 : 12) && <span className="calendar-more">+{dayItems.length - (view === "month" ? 3 : 12)} more</span>}{dayItems.length === 0 && view !== "month" && <span className="calendar-empty-hint">No items planned</span>}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="content calendar-content">
      <div className="header-row calendar-header-row">
        <div>
          <div className="eyebrow">Plan your practice</div>
          <h1 className="page-title">Calendar</h1>
          <p className="page-description">Organization events appear for everyone; your events and reminders stay private to you.</p>
          {permissions && <div className="perm-badges" aria-label="Your calendar permissions">{(["view", "create", "edit", "delete", "publish"] as const).map((action) => <span className={`perm-badge ${permissions[action] ? "granted" : ""}`} key={action}>{action}</span>)}</div>}
        </div>
        {permissions?.create && <div className="calendar-create-group"><button className="button primary calendar-create" onClick={() => openCreateEvent()}>＋ Add event</button><button className="button secondary calendar-create" onClick={() => openCreateReminder()}>＋ Add reminder</button></div>}
      </div>

      <section className="panel calendar-panel">
        <div className="calendar-toolbar">
          <div className="calendar-date-navigation">
            <button className="calendar-arrow" aria-label="Previous period" onClick={() => move(-1)}>‹</button>
            <button className="calendar-today-button" onClick={() => setDate(new Date())}>Today</button>
            <button className="calendar-arrow" aria-label="Next period" onClick={() => move(1)}>›</button>
            <h2>{formatHeading(date, view)}</h2>
          </div>
          <div className="calendar-toolbar-actions">
            <div className="calendar-view-switch" aria-label="Calendar view">
              {(["day", "week", "month", "year"] as CalendarView[]).map((option) => <button key={option} className={view === option ? "selected" : ""} onClick={() => setView(option)}>{option[0].toUpperCase() + option.slice(1)}</button>)}
            </div>
            <button className="calendar-refresh" aria-label="Refresh calendar" title="Refresh calendar" onClick={() => void loadItems()}>↻</button>
          </div>
        </div>
        <div className="calendar-legend"><span><i className="event-legend" />Events</span><span><i className="reminder-legend" />Reminders</span><span><span className="calendar-badge">Org</span>Shared with everyone</span><span className="calendar-cache-note">Calendar data refreshes automatically and is briefly cached.</span></div>
        {error && <div className="calendar-error" role="alert">{error}</div>}
        {loading ? <div className="calendar-loading"><i className="spinner" /> Loading your calendar…</div> : view === "year" ? renderYear() : renderDays()}
      </section>

      {eventDraft && <div className="calendar-modal-backdrop" role="presentation" onMouseDown={(mouseEvent) => { if (mouseEvent.target === mouseEvent.currentTarget && !saving) setEventDraft(null); }}>
        <section className="calendar-modal" role="dialog" aria-modal="true" aria-labelledby="event-form-title">
          <div className="calendar-modal-heading"><div><div className="eyebrow">{editingEventId ? "Update event" : "Add to the calendar"}</div><h2 id="event-form-title">{editingEventId ? "Edit event" : "New event"}</h2></div><button className="icon-button" aria-label="Close dialog" onClick={() => setEventDraft(null)}>×</button></div>
          <form onSubmit={saveEvent}>
            <div className="form-content">
              <div className="two-columns">
                <div className="field"><label htmlFor="event-type">EVENT TYPE</label><select id="event-type" value={eventDraft.eventType} onChange={(changeEvent) => setEventDraft({ ...eventDraft, eventType: changeEvent.target.value as EventType })}>{EVENT_TYPES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
                <div className="field"><label htmlFor="event-scope">VISIBILITY</label><select id="event-scope" value={eventDraft.scope} onChange={(changeEvent) => setEventDraft({ ...eventDraft, scope: changeEvent.target.value as CalendarScope })}><option value="user">Only me</option>{permissions?.publish && <option value="organization">Organization (everyone)</option>}</select></div>
              </div>
              <div className="field"><label htmlFor="event-title">TITLE</label><input id="event-title" autoFocus maxLength={160} value={eventDraft.title} onChange={(changeEvent) => setEventDraft({ ...eventDraft, title: changeEvent.target.value })} placeholder="Piano lesson" required /></div>
              <div className="field"><label htmlFor="event-description">NOTES</label><textarea id="event-description" maxLength={2000} value={eventDraft.description} onChange={(changeEvent) => setEventDraft({ ...eventDraft, description: changeEvent.target.value })} placeholder="Add details about this event…" /></div>
              <label className="calendar-all-day"><input type="checkbox" checked={eventDraft.allDay} onChange={(changeEvent) => { const allDay = changeEvent.target.checked; setEventDraft({ ...eventDraft, allDay, startAt: allDay ? eventDraft.startAt.slice(0, 10) : toLocalInput(parseDraftDate(eventDraft.startAt, true)), endAt: allDay ? eventDraft.endAt.slice(0, 10) : toLocalInput(parseDraftDate(eventDraft.endAt, true)) }); }} /> All day</label>
              <div className="two-columns">
                <div className="field"><label htmlFor="event-start">START</label><input id="event-start" type={eventDraft.allDay ? "date" : "datetime-local"} value={eventDraft.allDay ? eventDraft.startAt.slice(0, 10) : eventDraft.startAt} onChange={(changeEvent) => { const startAt = changeEvent.target.value; const end = new Date(startAt); if (!eventDraft.allDay) end.setHours(end.getHours() + 1); setEventDraft({ ...eventDraft, startAt, endAt: eventDraft.allDay ? (eventDraft.endAt < startAt ? startAt : eventDraft.endAt) : toLocalInput(end) }); }} required /></div>
                <div className="field"><label htmlFor="event-end">END</label><input id="event-end" type={eventDraft.allDay ? "date" : "datetime-local"} value={eventDraft.allDay ? eventDraft.endAt.slice(0, 10) : eventDraft.endAt} min={eventDraft.startAt} onChange={(changeEvent) => setEventDraft({ ...eventDraft, endAt: changeEvent.target.value })} required /></div>
              </div>
              <div className="field"><label htmlFor="event-color">COLOR</label><input id="event-color" type="color" value={eventDraft.color} onChange={(changeEvent) => setEventDraft({ ...eventDraft, color: changeEvent.target.value })} /></div>
              <div className="field">
                <label>REMIND ME IN ADVANCE</label>
                <div className="reminder-offset-list">
                  {eventDraft.reminders.map((reminder, index) => (
                    <div className="reminder-offset-row" key={index}>
                      <div className="field"><label>Days</label><input type="number" min={0} max={365} value={reminder.days} onChange={(changeEvent) => { const reminders = [...eventDraft.reminders]; reminders[index] = { ...reminder, days: Number(changeEvent.target.value) }; setEventDraft({ ...eventDraft, reminders }); }} /></div>
                      <div className="field"><label>Hours</label><input type="number" min={0} max={23} value={reminder.hours} onChange={(changeEvent) => { const reminders = [...eventDraft.reminders]; reminders[index] = { ...reminder, hours: Number(changeEvent.target.value) }; setEventDraft({ ...eventDraft, reminders }); }} /></div>
                      <div className="field"><label>Minutes</label><input type="number" min={0} max={59} value={reminder.minutes} onChange={(changeEvent) => { const reminders = [...eventDraft.reminders]; reminders[index] = { ...reminder, minutes: Number(changeEvent.target.value) }; setEventDraft({ ...eventDraft, reminders }); }} /></div>
                      <button type="button" className="button secondary reminder-offset-remove" aria-label="Remove reminder" onClick={() => setEventDraft({ ...eventDraft, reminders: eventDraft.reminders.filter((_, reminderIndex) => reminderIndex !== index) })}>×</button>
                    </div>
                  ))}
                  {eventDraft.reminders.length < 10 && <button type="button" className="button secondary reminder-add-row" onClick={() => setEventDraft({ ...eventDraft, reminders: [...eventDraft.reminders, { days: 0, hours: 1, minutes: 0 }] })}>＋ Add a reminder</button>}
                </div>
              </div>
            </div>
            <div className="calendar-form-footer">{editingEventId && permissions?.delete && <button className="button danger" type="button" onClick={() => void deleteEvent()} disabled={saving}>Delete</button>}<div className="calendar-form-spacer" /><button className="button secondary" type="button" onClick={() => setEventDraft(null)} disabled={saving}>Cancel</button><button className="button primary" type="submit" disabled={saving || (editingEventId ? !permissions?.edit : !permissions?.create)}>{saving ? "Saving…" : editingEventId ? "Save changes" : "Create event"}</button></div>
          </form>
        </section>
      </div>}

      {reminderDraft && <div className="calendar-modal-backdrop" role="presentation" onMouseDown={(mouseEvent) => { if (mouseEvent.target === mouseEvent.currentTarget && !saving) setReminderDraft(null); }}>
        <section className="calendar-modal" role="dialog" aria-modal="true" aria-labelledby="reminder-form-title">
          <div className="calendar-modal-heading"><div><div className="eyebrow">{editingReminderId ? "Update reminder" : "Add a reminder"}</div><h2 id="reminder-form-title">{editingReminderId ? "Edit reminder" : "New reminder"}</h2></div><button className="icon-button" aria-label="Close dialog" onClick={() => setReminderDraft(null)}>×</button></div>
          <form onSubmit={saveReminder}>
            <div className="form-content">
              <div className="two-columns">
                <div className="field"><label htmlFor="reminder-at">REMIND AT</label><input id="reminder-at" type="datetime-local" value={reminderDraft.remindAt} onChange={(changeEvent) => setReminderDraft({ ...reminderDraft, remindAt: changeEvent.target.value })} required /></div>
                <div className="field"><label htmlFor="reminder-scope">VISIBILITY</label><select id="reminder-scope" value={reminderDraft.scope} onChange={(changeEvent) => setReminderDraft({ ...reminderDraft, scope: changeEvent.target.value as CalendarScope })}><option value="user">Only me</option>{permissions?.publish && <option value="organization">Organization (everyone)</option>}</select></div>
              </div>
              <div className="field"><label htmlFor="reminder-title">TITLE</label><input id="reminder-title" autoFocus maxLength={160} value={reminderDraft.title} onChange={(changeEvent) => setReminderDraft({ ...reminderDraft, title: changeEvent.target.value })} placeholder="Practice scales" required /></div>
              <div className="field"><label htmlFor="reminder-description">NOTES</label><textarea id="reminder-description" maxLength={2000} value={reminderDraft.description} onChange={(changeEvent) => setReminderDraft({ ...reminderDraft, description: changeEvent.target.value })} placeholder="Add a reminder note…" /></div>
              <div className="field"><label htmlFor="reminder-color">COLOR</label><input id="reminder-color" type="color" value={reminderDraft.color} onChange={(changeEvent) => setReminderDraft({ ...reminderDraft, color: changeEvent.target.value })} /></div>
            </div>
            <div className="calendar-form-footer">{editingReminderId && permissions?.delete && <button className="button danger" type="button" onClick={() => void deleteReminder()} disabled={saving}>Delete</button>}<div className="calendar-form-spacer" /><button className="button secondary" type="button" onClick={() => setReminderDraft(null)} disabled={saving}>Cancel</button><button className="button primary" type="submit" disabled={saving || (editingReminderId ? !permissions?.edit : !permissions?.create)}>{saving ? "Saving…" : editingReminderId ? "Save changes" : "Create reminder"}</button></div>
          </form>
        </section>
      </div>}
    </div>
  );
}
