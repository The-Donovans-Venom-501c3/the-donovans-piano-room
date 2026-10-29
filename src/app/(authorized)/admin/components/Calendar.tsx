"use client";

import { apiRequest } from "@/lib/api/api";
import { CALENDAR_COLOR_CATEGORIES, CALENDAR_PALETTE_STORAGE_KEY, DEFAULT_CALENDAR_PALETTE, calendarColorKey, parseCalendarPalette, type CalendarPalette } from "@/lib/calendarColors";
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

type ViewingItem = { kind: "event"; item: CalendarEvent } | { kind: "reminder"; item: CalendarReminder };

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
const PERSONAL_CALENDAR_ACTIONS = { view: true, create: true, edit: true, delete: true, publish: false };

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

const fullDayFormat = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
const shortDateFormat = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" });
const timeFormat = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });

function formatEventWhen(item: CalendarEvent) {
  const start = new Date(item.startAt);
  const end = new Date(item.endAt);
  if (item.allDay) {
    return sameDate(start, end) ? `${fullDayFormat.format(start)} · All day` : `${shortDateFormat.format(start)} – ${shortDateFormat.format(end)} · All day`;
  }
  return sameDate(start, end)
    ? `${fullDayFormat.format(start)} · ${timeFormat.format(start)} – ${timeFormat.format(end)}`
    : `${shortDateFormat.format(start)} ${timeFormat.format(start)} – ${shortDateFormat.format(end)} ${timeFormat.format(end)}`;
}

export type CalendarProps = {
  title?: string;
  eyebrow?: string;
  description?: string;
  initialView?: CalendarView;
  showPermissionBadges?: boolean;
  personalEditsOnly?: boolean;
};

export default function Calendar({
  title = "Calendar",
  eyebrow = "Plan your practice",
  description = "Organization events appear for everyone; your events and reminders stay private to you.",
  initialView = "month",
  showPermissionBadges = true,
  personalEditsOnly: personalEditsOnly = false,
}: CalendarProps = {}) {
  const [view, setView] = useState<CalendarView>(initialView);
  const [date, setDate] = useState(() => new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [standaloneReminders, setStandaloneReminders] = useState<CalendarReminder[]>([]);
  const [adminPermissions, setPermissions] = useState<CalendarPermissions["actions"] | null>(null);
  const permissions = personalEditsOnly ? PERSONAL_CALENDAR_ACTIONS : adminPermissions;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [eventDraft, setEventDraft] = useState<EventDraft | null>(null);
  const [reminderDraft, setReminderDraft] = useState<ReminderDraft | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editingReminderId, setEditingReminderId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [palette, setPalette] = useState<CalendarPalette>(DEFAULT_CALENDAR_PALETTE);
  // New state stays below the existing useState calls: tests mock hooks positionally.
  const [selectedDay, setSelectedDay] = useState<Date>(() => startOfDay(new Date()));
  const [viewingItem, setViewingItem] = useState<ViewingItem | null>(null);

  useEffect(() => {
    try {
      setPalette(parseCalendarPalette(JSON.parse(localStorage.getItem(CALENDAR_PALETTE_STORAGE_KEY) ?? "null")));
    } catch { /* Defaults still work when storage is unavailable or invalid. */ }
    const syncPalette = (event: StorageEvent) => {
      if (event.key === CALENDAR_PALETTE_STORAGE_KEY || event.key === null) {
        try { setPalette(parseCalendarPalette(JSON.parse(event.newValue ?? "null"))); } catch { setPalette(DEFAULT_CALENDAR_PALETTE); }
      }
    };
    window.addEventListener("storage", syncPalette);
    return () => window.removeEventListener("storage", syncPalette);
  }, []);

  const updatePalette = (next: CalendarPalette) => {
    setPalette(next);
    try { localStorage.setItem(CALENDAR_PALETTE_STORAGE_KEY, JSON.stringify(next)); } catch { /* Keep session customization usable. */ }
  };

  const range = useMemo(() => rangeForView(date, view), [date, view]);
  const loadItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const query = new URLSearchParams({ from: range.from.toISOString(), to: range.to.toISOString() });
      const [eventRows, reminderRows] = await Promise.all([
        apiRequest<CalendarEvent[]>(`/calendar/events?${query.toString()}`, { cache: "no-store" }),
        apiRequest<CalendarReminder[]>(`/calendar/reminders?${query.toString()}`, { cache: "no-store" }),
      ]);
      // The backend returns organization items plus the authenticated user's own
      // items. Planner keeps the shared items visible, but read-only.
      setEvents(eventRows);
      setStandaloneReminders(reminderRows.filter((reminder) => !reminder.eventId));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load calendar items.");
    } finally {
      setLoading(false);
    }
  }, [range.from, range.to]);

  useEffect(() => {
    // Personal calendar access is authenticated ownership, not a persona grant.
    if (personalEditsOnly) return;
    let active = true;
    apiRequest<CalendarPermissions>("/rbac/me/permissions/calendar", { cache: "no-store" })
      .then((result) => { if (active) setPermissions(result.actions); })
      .catch((permissionError) => {
        if (active) {
          setPermissions({ view: false, create: false, edit: false, delete: false, publish: false });
          setError(permissionError instanceof Error ? permissionError.message : "Unable to load calendar permissions.");
        }
      });
    return () => { active = false; };
  }, [personalEditsOnly]);

  useEffect(() => {
    if (!personalEditsOnly && !adminPermissions) return;
    if (!personalEditsOnly && !adminPermissions?.view) {
      setEvents([]);
      setStandaloneReminders([]);
      setLoading(false);
      return;
    }
    void loadItems();
  }, [adminPermissions, loadItems, personalEditsOnly]);

  const canEditItem = (scope: CalendarScope) => !!permissions?.edit && (!personalEditsOnly || scope === "user") && (scope !== "organization" || !!permissions?.publish);
  const canCreateItem = !!permissions?.create && (personalEditsOnly || !!permissions.publish);

  if (!personalEditsOnly && permissions && !permissions.view) {
    return (
      <div className="content">
        <section className="panel">
          <div className="empty-state">
            {error || "You don't have permission to view the admin calendar."}
          </div>
        </section>
      </div>
    );
  }

  const move = (direction: number) => {
    const next = new Date(date);
    if (view === "day") next.setDate(next.getDate() + direction);
    else if (view === "week") next.setDate(next.getDate() + direction * 7);
    else if (view === "month") next.setMonth(next.getMonth() + direction);
    else next.setFullYear(next.getFullYear() + direction);
    setDate(next);
    setSelectedDay(startOfDay(next));
  };

  const goToday = () => {
    const today = new Date();
    setDate(today);
    setSelectedDay(startOfDay(today));
  };

  const openCreateEvent = (day = selectedDay) => {
    if (!canCreateItem) return;
    setEditingEventId(null);
    setEventDraft({
      ...createEventDraft(day),
      scope: personalEditsOnly ? "user" : "organization",
    });
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

  const openCreateReminder = (day = selectedDay) => {
    if (!canCreateItem) return;
    setEditingReminderId(null);
    setReminderDraft({
      ...createReminderDraft(day),
      scope: personalEditsOnly ? "user" : "organization",
    });
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

  // Items the user cannot edit still open a read-only detail view on click.
  const openEvent = (item: CalendarEvent) => {
    if (canEditItem(item.scope)) openEditEvent(item);
    else setViewingItem({ kind: "event", item });
  };

  const openReminderItem = (reminder: CalendarReminder) => {
    if (canEditItem(reminder.scope)) openEditReminder(reminder);
    else setViewingItem({ kind: "reminder", item: reminder });
  };

  const saveEvent = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    if (!eventDraft) return;
    if (personalEditsOnly && editingEventId && eventDraft.scope !== "user") return;
    if (editingEventId ? !permissions?.edit : !canCreateItem) return;
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
        scope: editingEventId
          ? eventDraft.scope
          : personalEditsOnly
            ? "user"
            : "organization",
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
    if (personalEditsOnly && editingReminderId && reminderDraft.scope !== "user") return;
    if (editingReminderId ? !permissions?.edit : !canCreateItem) return;
    setSaving(true);
    setError("");
    try {
      const remindAt = new Date(reminderDraft.remindAt);
      if (!Number.isFinite(remindAt.getTime())) throw new Error("Provide a valid reminder time.");
      const body = JSON.stringify({
        title: reminderDraft.title.trim(),
        description: reminderDraft.description,
        scope: editingReminderId
          ? reminderDraft.scope
          : personalEditsOnly
            ? "user"
            : "organization",
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
    if (personalEditsOnly && eventDraft?.scope !== "user") return;
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
    if (personalEditsOnly && reminderDraft?.scope !== "user") return;
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

  const renderEvent = (item: CalendarEvent, compact = false) => {
    const editable = canEditItem(item.scope);
    return (
      <button type="button" className={`calendar-event ${compact ? "compact" : ""} ${editable ? "" : "view-only"}`} key={`event-${item.id}`} style={{ "--event-color": palette[calendarColorKey(item.scope, "event")] } as CSSProperties} onClick={(clickEvent) => { clickEvent.stopPropagation(); openEvent(item); }} title={`${item.title} (${item.eventType})${item.description ? ` — ${item.description}` : ""}`}>
        <span className="calendar-event-dot" style={{ backgroundColor: item.color }} />
        <span className="calendar-event-title">{item.title}</span>
        {(item.reminders?.length ?? 0) > 0 && <span className="calendar-bell" title={item.reminders!.map(formatOffset).join(", ")}>🔔</span>}
        {!compact && !item.allDay && <time>{timeFormat.format(new Date(item.startAt))}</time>}
        {scopeBadge(item.scope)}
      </button>
    );
  };

  const renderReminder = (reminder: CalendarReminder, compact = false) => {
    const editable = canEditItem(reminder.scope);
    return (
      <button type="button" className={`calendar-event reminder ${compact ? "compact" : ""} ${editable ? "" : "view-only"}`} key={`reminder-${reminder.id}`} style={{ "--event-color": palette[calendarColorKey(reminder.scope, "reminder")] } as CSSProperties} onClick={(clickEvent) => { clickEvent.stopPropagation(); openReminderItem(reminder); }} title={`${reminder.title} (reminder)${reminder.description ? ` — ${reminder.description}` : ""}`}>
        <span className="calendar-event-dot" style={{ backgroundColor: reminder.color }} />
        <span className="calendar-event-title">{reminder.title}</span>
        {!compact && <time>{timeFormat.format(new Date(reminder.remindAt))}</time>}
        {scopeBadge(reminder.scope)}
      </button>
    );
  };

  const renderSideEvent = (item: CalendarEvent) => {
    const editable = canEditItem(item.scope);
    const start = new Date(item.startAt);
    const end = new Date(item.endAt);
    return (
      <button type="button" key={`side-event-${item.id}`} className={`calendar-side-item ${editable ? "" : "view-only"}`} style={{ "--event-color": palette[calendarColorKey(item.scope, "event")] } as CSSProperties} onClick={() => openEvent(item)}>
        <span className="calendar-event-dot" style={{ backgroundColor: item.color }} />
        <span className="calendar-side-item-body">
          <span className="calendar-side-item-title">{item.title}{scopeBadge(item.scope)}</span>
          <span className="calendar-side-item-meta">
            {EVENT_TYPES.find((option) => option.value === item.eventType)?.label ?? "Event"} · {item.allDay ? "All day" : sameDate(start, end) ? `${timeFormat.format(start)} – ${timeFormat.format(end)}` : `${shortDateFormat.format(start)} – ${shortDateFormat.format(end)}`}
            {(item.reminders?.length ?? 0) > 0 && ` · 🔔 ${item.reminders!.map(formatOffset).join(", ")}`}
          </span>
          {item.description && <span className="calendar-side-item-desc">{item.description}</span>}
        </span>
      </button>
    );
  };

  const renderSideReminder = (reminder: CalendarReminder) => {
    const editable = canEditItem(reminder.scope);
    return (
      <button type="button" key={`side-reminder-${reminder.id}`} className={`calendar-side-item is-reminder ${editable ? "" : "view-only"}`} style={{ "--event-color": palette[calendarColorKey(reminder.scope, "reminder")] } as CSSProperties} onClick={() => openReminderItem(reminder)}>
        <span className="calendar-event-dot" style={{ backgroundColor: reminder.color }} />
        <span className="calendar-side-item-body">
          <span className="calendar-side-item-title">{reminder.title}{scopeBadge(reminder.scope)}</span>
          <span className="calendar-side-item-meta">Reminder · {timeFormat.format(new Date(reminder.remindAt))}</span>
          {reminder.description && <span className="calendar-side-item-desc">{reminder.description}</span>}
        </span>
      </button>
    );
  };

  const itemsForDay = (day: Date) => {
    const dayEvents = events.filter((item) => eventVisibleOnDate(item, day)).map((item) => ({ kind: "event" as const, item, sortKey: new Date(item.startAt).getTime() }));
    const dayReminders = standaloneReminders.filter((reminder) => reminderVisibleOnDate(reminder, day)).map((reminder) => ({ kind: "reminder" as const, item: reminder, sortKey: new Date(reminder.remindAt).getTime() }));
    return [...dayEvents, ...dayReminders].sort((left, right) => left.sortKey - right.sortKey);
  };

  const selectedDayItems = itemsForDay(selectedDay);
  const viewingEvent = viewingItem?.kind === "event" ? viewingItem.item : null;
  const viewingReminder = viewingItem?.kind === "reminder" ? viewingItem.item : null;

  const renderYear = () => (
    <div className="year-grid">
      {Array.from({ length: 12 }, (_, month) => {
        const first = new Date(date.getFullYear(), month, 1);
        const firstGridDay = startOfWeek(first);
        return (
          <button className="year-month" key={month} onClick={() => { setDate(first); setSelectedDay(startOfDay(first)); setView("month"); }}>
            <strong>{new Intl.DateTimeFormat(undefined, { month: "long" }).format(first)}</strong>
            <div className="year-weekdays">{weekdays.map((day) => <span key={day}>{day[0]}</span>)}</div>
            <div className="year-days">
              {Array.from({ length: 42 }, (_, dayIndex) => {
                const day = addDays(firstGridDay, dayIndex);
                const items = itemsForDay(day);
                const categories = [...new Set(items.map(({ item, kind }) => calendarColorKey(item.scope, kind)))];
                return <span className={`${day.getMonth() === month ? "" : "outside"} ${sameDate(day, new Date()) ? "today" : ""}`} key={dayIndex} title={items.length ? items.map(({ item }) => item.title).join(", ") : undefined}>{day.getDate()}<i className="calendar-year-markers">{categories.map((key) => <i key={key} style={{ backgroundColor: palette[key] }} />)}</i></span>;
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
          const dayLabel = fullDayFormat.format(day);
          return (
            <div className={`calendar-day ${view === "month" && !inCurrentMonth ? "outside" : ""} ${sameDate(day, new Date()) ? "today" : ""} ${sameDate(day, selectedDay) ? "selected" : ""}`} key={day.toISOString()} role="button" tabIndex={0} aria-label={`Show events and reminders for ${dayLabel}`} onClick={() => setSelectedDay(startOfDay(day))} onKeyDown={(keyEvent) => { if (keyEvent.key === "Enter" || keyEvent.key === " ") { keyEvent.preventDefault(); setSelectedDay(startOfDay(day)); } }}>
              <span className="calendar-day-top">
                {canCreateItem && <button type="button" className="calendar-day-add" title={`Add an event on ${dayLabel}`} aria-label={`Add an event on ${dayLabel}`} onClick={(clickEvent) => { clickEvent.stopPropagation(); openCreateEvent(day); }}>＋</button>}
                <span className="calendar-day-number">{view === "week" && <small>{weekdays[day.getDay()]}</small>}{day.getDate()}</span>
              </span>
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
          <div className="eyebrow">{eyebrow}</div>
          <h1 className="page-title">{title}</h1>
          <p className="page-description">{description}</p>
          {showPermissionBadges && permissions && <div className="perm-badges" aria-label="Your calendar permissions">{(["view", "create", "edit", "delete", "publish"] as const).map((action) => <span className={`perm-badge ${permissions[action] ? "granted" : ""}`} key={action}>{action}</span>)}</div>}
        </div>
        {canCreateItem && <div className="calendar-create-group"><button className="button primary calendar-create" onClick={() => openCreateEvent()}>＋ Add event</button><button className="button secondary calendar-create" onClick={() => openCreateReminder()}>＋ Add reminder</button></div>}
      </div>

      <div className="calendar-body">
      <section className="panel calendar-panel">
        <div className="calendar-toolbar">
          <div className="calendar-date-navigation">
            <button className="calendar-arrow" aria-label="Previous period" onClick={() => move(-1)}>‹</button>
            <button className="calendar-today-button" onClick={goToday}>Today</button>
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
        <div className="calendar-legend">
          {CALENDAR_COLOR_CATEGORIES.map(({ key, label }) => <span key={key}><i className={`calendar-category-swatch ${key.endsWith("Reminder") ? "is-reminder" : ""}`} style={{ backgroundColor: palette[key] }} />{label}</span>)}
          <span>{personalEditsOnly ? "Organization items · Read-only" : "Shared with everyone"}</span>
        </div>
        <details className="calendar-color-settings">
          <summary>Customize highlight colors</summary>
          <p>Highlights identify ownership and type. Small item dots keep their saved color. These display preferences apply to Planner and Admin on this browser only.</p>
          <div className="calendar-color-options">
            {CALENDAR_COLOR_CATEGORIES.map(({ key, label }) => <label key={key}><input type="color" aria-label={`${label} highlight color`} value={palette[key]} onChange={(event) => updatePalette({ ...palette, [key]: event.target.value })} />{label}</label>)}
            <button type="button" className="button secondary" onClick={() => updatePalette({ ...DEFAULT_CALENDAR_PALETTE })}>Reset colors</button>
          </div>
        </details>
        {error && <div className="calendar-error" role="alert">{error}</div>}
        {loading ? <div className="calendar-loading"><i className="spinner" /> Loading your calendar…</div> : view === "year" ? renderYear() : renderDays()}
      </section>

      <aside className="panel calendar-side-panel" aria-label="Events and reminders for the selected day">
        <div className="calendar-side-heading">
          <div className="eyebrow">Selected day</div>
          <h2>{fullDayFormat.format(selectedDay)}</h2>
        </div>
        {selectedDayItems.length === 0 ? (
          <p className="calendar-side-empty">No events or reminders for this day.</p>
        ) : (
          <div className="calendar-side-list">
            {selectedDayItems.map((entry) => entry.kind === "event" ? renderSideEvent(entry.item as CalendarEvent) : renderSideReminder(entry.item as CalendarReminder))}
          </div>
        )}
        {canCreateItem && <div className="calendar-side-actions"><button type="button" className="button secondary" onClick={() => openCreateEvent(selectedDay)}>＋ Event</button><button type="button" className="button secondary" onClick={() => openCreateReminder(selectedDay)}>＋ Reminder</button></div>}
      </aside>
      </div>

      {viewingItem && <div className="calendar-modal-backdrop" role="presentation" onMouseDown={(mouseEvent) => { if (mouseEvent.target === mouseEvent.currentTarget) setViewingItem(null); }}>
        <section className="calendar-modal calendar-view-modal" role="dialog" aria-modal="true" aria-labelledby="view-item-title">
          <div className="calendar-modal-heading"><div><div className="eyebrow">{viewingItem.item.scope === "organization" ? "Organization" : "Personal"} {viewingItem.kind} · Read-only</div><h2 id="view-item-title">{viewingItem.item.title}</h2></div><button className="icon-button" aria-label="Close dialog" onClick={() => setViewingItem(null)}>×</button></div>
          <div className="calendar-view-body">
            <div className="calendar-view-row"><span className="calendar-view-label">When</span><span>{viewingEvent ? formatEventWhen(viewingEvent) : viewingReminder ? `${fullDayFormat.format(new Date(viewingReminder.remindAt))} · ${timeFormat.format(new Date(viewingReminder.remindAt))}` : ""}</span></div>
            {viewingEvent && <div className="calendar-view-row"><span className="calendar-view-label">Type</span><span>{EVENT_TYPES.find((option) => option.value === viewingEvent.eventType)?.label ?? viewingEvent.eventType}</span></div>}
            {viewingEvent && (viewingEvent.reminders?.length ?? 0) > 0 && <div className="calendar-view-row"><span className="calendar-view-label">Reminders</span><span>{viewingEvent.reminders!.map(formatOffset).join("; ")}</span></div>}
            <div className="calendar-view-row"><span className="calendar-view-label">Color</span><span><i className="calendar-view-swatch" style={{ backgroundColor: viewingItem.item.color }} />{viewingItem.item.color}</span></div>
            {viewingItem.item.description && <div className="calendar-view-row"><span className="calendar-view-label">Notes</span><span className="calendar-view-notes">{viewingItem.item.description}</span></div>}
          </div>
          <div className="calendar-form-footer"><div className="calendar-form-spacer" /><button className="button secondary" type="button" onClick={() => setViewingItem(null)}>Close</button></div>
        </section>
      </div>}

      {eventDraft && <div className="calendar-modal-backdrop" role="presentation" onMouseDown={(mouseEvent) => { if (mouseEvent.target === mouseEvent.currentTarget && !saving) setEventDraft(null); }}>
        <section className="calendar-modal" role="dialog" aria-modal="true" aria-labelledby="event-form-title">
          <div className="calendar-modal-heading"><div><div className="eyebrow">{editingEventId ? "Update event" : "Add to the calendar"}</div><h2 id="event-form-title">{editingEventId ? "Edit event" : "New event"}</h2></div><button className="icon-button" aria-label="Close dialog" onClick={() => setEventDraft(null)}>×</button></div>
          <form onSubmit={saveEvent}>
            <div className="form-content">
              <div className="two-columns">
                <div className="field"><label htmlFor="event-type">EVENT TYPE</label><select id="event-type" value={eventDraft.eventType} onChange={(changeEvent) => setEventDraft({ ...eventDraft, eventType: changeEvent.target.value as EventType })}>{EVENT_TYPES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
                <div className="field"><label htmlFor="event-scope">VISIBILITY</label><select id="event-scope" disabled={personalEditsOnly || !editingEventId} value={personalEditsOnly ? "user" : !editingEventId ? "organization" : eventDraft.scope} onChange={(changeEvent) => setEventDraft({ ...eventDraft, scope: changeEvent.target.value as CalendarScope })}>{!personalEditsOnly && editingEventId && <option value="user">Only me</option>}{!personalEditsOnly && (permissions?.publish || !editingEventId) && <option value="organization">Organization (everyone)</option>}{personalEditsOnly && <option value="user">Only me</option>}</select></div>
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
                <div className="field"><label htmlFor="reminder-scope">VISIBILITY</label><select id="reminder-scope" disabled={personalEditsOnly || !editingReminderId} value={personalEditsOnly ? "user" : !editingReminderId ? "organization" : reminderDraft.scope} onChange={(changeEvent) => setReminderDraft({ ...reminderDraft, scope: changeEvent.target.value as CalendarScope })}>{!personalEditsOnly && editingReminderId && <option value="user">Only me</option>}{!personalEditsOnly && (permissions?.publish || !editingReminderId) && <option value="organization">Organization (everyone)</option>}{personalEditsOnly && <option value="user">Only me</option>}</select></div>
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
