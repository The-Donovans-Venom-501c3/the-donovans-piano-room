"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useAtomValue } from "jotai";
import { apiRequest } from "@/lib/api/api";
import { profileAtom } from "@/utils/stores";

export type StudentCalendarView = "day" | "week" | "month" | "year";
export type SessionCategory =
  | "Unit/Lesson"
  | "Assignment"
  | "Project"
  | "Holiday/Event";

type ApiCalendarScope = "organization" | "user";
type ApiEventType =
  | "lesson"
  | "concert"
  | "recital"
  | "meeting"
  | "practice"
  | "other";

interface ApiCalendarReminder {
  id: string;
  userId: string | null;
  scope: ApiCalendarScope;
  eventId: string | null;
  title: string;
  description: string;
  daysBefore: number;
  hoursBefore: number;
  minutesBefore: number;
  remindAt: string;
  color: string;
}

interface ApiCalendarEvent {
  id: string;
  userId: string | null;
  scope: ApiCalendarScope;
  eventType: ApiEventType;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  allDay: boolean;
  color: string;
  reminders?: ApiCalendarReminder[];
}

export interface PlannerSession {
  id: string;
  title: string;
  badge: string;
  tagLabel: string;
  locationLabel: string;
  timeRange: string;
  dateLabel: string;
  isoDate: string;
  startHour: number;
  category: SessionCategory;
  dotColor: string;
  chipClass: string;
  about: string;
  whoThisIsFor: string;
  className: string;
  where: string;
  instructor: string;
  scheduleDetails: string;
  reminders: string[];
  isAdded: boolean;
  userCalendarEventId?: string | null;
}

export interface PlannerReminderItem {
  id: string;
  title: string;
  description: string;
  dateLabel: string;
  remindAtIso: string;
  daysBefore: number;
  hoursBefore: number;
  minutesBefore: number;
  cadence: string;
  eventId: string | null;
}

const LEGEND_ITEMS: Array<{ label: SessionCategory; dotColor: string }> = [
  { label: "Unit/Lesson", dotColor: "#F4C95D" },
  { label: "Project", dotColor: "#5EC27B" },
  { label: "Assignment", dotColor: "#F2994A" },
  { label: "Holiday/Event", dotColor: "#B48CF2" },
];

const ADDED_SESSIONS_STORAGE_KEY = "student_planner_added_session_ids_v1";

function toIsoDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseIsoDateLocal(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function startOfWeekSun(d: Date) {
  const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  copy.setDate(copy.getDate() - copy.getDay());
  return copy;
}

function formatHourLabel(hour: number) {
  if (hour === 0) return "12 AM";
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return "12 PM";
  return `${hour - 12} PM`;
}

function mapEventTypeToCategory(eventType: ApiEventType): SessionCategory {
  if (eventType === "lesson" || eventType === "practice") return "Unit/Lesson";
  if (eventType === "concert" || eventType === "recital") return "Holiday/Event";
  if (eventType === "meeting") return "Project";
  return "Assignment";
}

function formatOffsetLabel(rem: {
  daysBefore: number;
  hoursBefore: number;
  minutesBefore: number;
}) {
  const parts: string[] = [];
  if (rem.daysBefore) parts.push(`${rem.daysBefore}d`);
  if (rem.hoursBefore) parts.push(`${rem.hoursBefore}h`);
  if (rem.minutesBefore) parts.push(`${rem.minutesBefore}m`);
  return parts.length ? `${parts.join(" ")} before` : "At event time";
}

function getQueryRange(date: Date, view: StudentCalendarView) {
  if (view === "year") {
    return {
      from: new Date(date.getFullYear(), 0, 1),
      to: new Date(date.getFullYear() + 1, 0, 1),
    };
  }
  if (view === "day") {
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const end = new Date(start);
    end.setDate(start.getDate() + 1);
    return { from: start, to: end };
  }
  if (view === "week") {
    const start = startOfWeekSun(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    return { from: start, to: end };
  }
  const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const start = startOfWeekSun(firstOfMonth);
  const end = new Date(start);
  end.setDate(start.getDate() + 35);
  return { from: start, to: end };
}

async function calendarApiRequest<T>(
  pathWithoutPrefix: string,
  init?: RequestInit
): Promise<T> {
  return apiRequest<T>(`/calendar${pathWithoutPrefix}`, init);
}

function buildFallbackSessions(
  cursorDate: Date,
  addedIds: Set<string>
): PlannerSession[] {
  const y = cursorDate.getFullYear();
  const mIdx = cursorDate.getMonth();
  const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    new Date(y, mIdx, 1)
  );
  const fmtDate = (day: number) => `${day} ${monthName} ${y}`;
  const fmtIso = (day: number) =>
    `${y}-${String(mIdx + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const raw: PlannerSession[] = [
    {
      id: `sess-${y}-${mIdx + 1}-14-a`,
      title: "Beginner Piano",
      badge: "Live Class",
      tagLabel: "Beginner Piano",
      locationLabel: "Rhythm Lab",
      timeRange: "5:00 PM - 7:00 PM",
      dateLabel: fmtDate(14),
      isoDate: fmtIso(14),
      startHour: 9,
      category: "Assignment",
      dotColor: "#F2994A",
      chipClass: "bg-[#EFE3FC] text-[#4C2A7A] border-[#D9C3F7]",
      about:
        "Build a strong rhythmic foundation through guided listening, clapping, and keyboard exercises.",
      whoThisIsFor: "Beginner students and their parents",
      className: "Beginner Piano",
      where: "Online",
      instructor: "Ms. Harper",
      scheduleDetails: "Eastern Time (ET) · Does not repeat · 24 spots",
      reminders: ["24 hours before", "10 minutes before"],
      isAdded: true,
    },
    {
      id: `sess-${y}-${mIdx + 1}-14-b`,
      title: "Beginner Piano",
      badge: "Live Class",
      tagLabel: "Music Theory Study Hall",
      locationLabel: "Rhythm Lab",
      timeRange: "5:00 PM - 7:00 PM",
      dateLabel: fmtDate(14),
      isoDate: fmtIso(14),
      startHour: 10,
      category: "Unit/Lesson",
      dotColor: "#F4C95D",
      chipClass: "bg-[#DCF0DA] text-[#2D5A2C] border-[#BBE0B7]",
      about:
        "Guided keyboard rhythm drills and sight-reading practice with live feedback.",
      whoThisIsFor: "Beginner students and their parents",
      className: "Beginner Piano",
      where: "Online",
      instructor: "Ms. Harper",
      scheduleDetails: "Eastern Time (ET) · Does not repeat · 24 spots",
      reminders: ["24 hours before", "10 minutes before"],
      isAdded: false,
    },
    {
      id: `sess-${y}-${mIdx + 1}-14-c`,
      title: "Vocals",
      badge: "Live Class",
      tagLabel: "Intermediate",
      locationLabel: "Rhythm Lab",
      timeRange: "5:00 PM - 7:00 PM",
      dateLabel: fmtDate(14),
      isoDate: fmtIso(14),
      startHour: 11,
      category: "Holiday/Event",
      dotColor: "#B48CF2",
      chipClass: "bg-[#F9E8BE] text-[#6E4D12] border-[#EED292]",
      about:
        "Breath control, vocal warm-ups, and phrasing in an interactive group room.",
      whoThisIsFor: "Beginner students and their parents",
      className: "Beginner Piano",
      where: "Online",
      instructor: "Ms. Harper",
      scheduleDetails: "Eastern Time (ET) · Does not repeat · 24 spots",
      reminders: ["24 hours before", "10 minutes before"],
      isAdded: false,
    },
    {
      id: `sess-${y}-${mIdx + 1}-18-a`,
      title: "Behind the Music: Jazz",
      badge: "Live Class",
      tagLabel: "Advanced Composition",
      locationLabel: "Rhythm Lab",
      timeRange: "2:00 PM - 3:00 PM",
      dateLabel: fmtDate(18),
      isoDate: fmtIso(18),
      startHour: 14,
      category: "Unit/Lesson",
      dotColor: "#F4C95D",
      chipClass: "bg-[#EFE3FC] text-[#532E82] border-[#D9C3F7]",
      about:
        "Explore jazz harmony, swing feel, and improvisation ideas with live examples.",
      whoThisIsFor: "Students exploring jazz & improvisation",
      className: "Jazz & Improvisation",
      where: "Online",
      instructor: "Ms. Harper",
      scheduleDetails: "Eastern Time (ET) · Weekly · 24 spots",
      reminders: ["1 week in advance", "24 hours before"],
      isAdded: true,
    },
    {
      id: `sess-${y}-${mIdx + 1}-18-b`,
      title: "Vocal Lab",
      badge: "Live Class",
      tagLabel: "Vocal",
      locationLabel: "Rhythm Lab",
      timeRange: "4:00 PM - 5:00 PM",
      dateLabel: fmtDate(18),
      isoDate: fmtIso(18),
      startHour: 16,
      category: "Project",
      dotColor: "#5EC27B",
      chipClass: "bg-[#F5ECFF] text-[#4D2A7A] border-[#E2D0F8]",
      about:
        "Collaborative vocal ensemble workshop focusing on dynamics and ensemble blend.",
      whoThisIsFor: "Vocal students",
      className: "Vocals",
      where: "Online",
      instructor: "Ms. Harper",
      scheduleDetails: "Eastern Time (ET) · Does not repeat · 24 spots",
      reminders: ["24 hours before"],
      isAdded: false,
    },
  ];

  return raw.map((s) => ({
    ...s,
    isAdded: addedIds.has(s.id) ? true : s.isAdded,
  }));
}

function buildFallbackReminders(cursorDate: Date): PlannerReminderItem[] {
  const y = cursorDate.getFullYear();
  const mIdx = cursorDate.getMonth();
  const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    new Date(y, mIdx, 1)
  );
  const makeIso = (day: number) =>
    new Date(y, mIdx, day, 9, 0, 0).toISOString();

  return [
    {
      id: "rem-1",
      title: "Beginner Piano: Rhythm Lab",
      description: "Practice rhythm drills",
      dateLabel: `${monthName} 14, ${y}`,
      remindAtIso: makeIso(14),
      daysBefore: 1,
      hoursBefore: 0,
      minutesBefore: 10,
      cadence: "24 hours before · 10 minutes before",
      eventId: null,
    },
    {
      id: "rem-2",
      title: "Behind the Music: Jazz",
      description: "Review jazz harmony notes",
      dateLabel: `${monthName} 18, ${y}`,
      remindAtIso: makeIso(18),
      daysBefore: 7,
      hoursBefore: 24,
      minutesBefore: 0,
      cadence: "1 week in advance · 24 hours before",
      eventId: null,
    },
    {
      id: "rem-3",
      title: "Advanced Rhythm Workshop",
      description: "Metronome warm-up",
      dateLabel: `${monthName} 24, ${y}`,
      remindAtIso: makeIso(24),
      daysBefore: 1,
      hoursBefore: 0,
      minutesBefore: 0,
      cadence: "24 hours before",
      eventId: null,
    },
  ];
}

function mapApiEventToSession(
  ev: ApiCalendarEvent,
  addedIds: Set<string>
): PlannerSession {
  const start = new Date(ev.startAt);
  const end = new Date(ev.endAt);
  const category = mapEventTypeToCategory(ev.eventType);
  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const timeRange = ev.allDay
    ? "All day"
    : `${timeFormatter.format(start)} - ${timeFormatter.format(end)}`;

  const dotColor =
    ev.color ||
    LEGEND_ITEMS.find((item) => item.label === category)?.dotColor ||
    "#5B2C83";

  const chipClass =
    category === "Unit/Lesson"
      ? "bg-[#EFE3FC] text-[#532E82] border-[#D9C3F7]"
      : category === "Project"
        ? "bg-[#DCF0DA] text-[#2D5A2C] border-[#BBE0B7]"
        : "bg-[#F5ECFF] text-[#4C2A7A] border-[#E2D0F8]";

  return {
    id: ev.id,
    title: ev.title,
    badge: ev.scope === "organization" ? "Live Class" : "My Event",
    tagLabel: ev.title,
    locationLabel: ev.scope === "organization" ? "Rhythm Lab" : "Personal",
    timeRange,
    dateLabel: dateFormatter.format(start),
    isoDate: toIsoDate(start),
    startHour: ev.allDay ? 9 : start.getHours(),
    category,
    dotColor,
    chipClass,
    about: ev.description || "No additional description provided.",
    whoThisIsFor:
      ev.scope === "organization"
        ? "Beginner students and their parents"
        : "Personal schedule",
    className: ev.title,
    where: ev.scope === "organization" ? "Online" : "Personal",
    instructor: ev.scope === "organization" ? "Ms. Harper" : "You",
    scheduleDetails: ev.allDay
      ? `${dateFormatter.format(start)} · All day`
      : `${dateFormatter.format(start)} · ${timeRange}`,
    reminders: (ev.reminders ?? []).map(formatOffsetLabel),
    isAdded: ev.scope === "user" || addedIds.has(ev.id),
    userCalendarEventId: ev.scope === "user" ? ev.id : null,
  };
}

export default function StudentPlanner() {
  const profile = useAtomValue(profileAtom);
  const [todayIso, setTodayIso] = useState<string>(() => toIsoDate(new Date()));

  const [view, setView] = useState<StudentCalendarView>("month");
  const [cursorDate, setCursorDate] = useState<Date>(() => new Date());
  const [selectedIsoDate, setSelectedIsoDate] = useState<string>(() =>
    toIsoDate(new Date())
  );
  const [popoverIsoDate, setPopoverIsoDate] = useState<string | null>(null);
  const [sessions, setSessions] = useState<PlannerSession[]>([]);
  const [reminders, setReminders] = useState<PlannerReminderItem[]>([]);
  const [addedIds, setAddedIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(ADDED_SESSIONS_STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as string[]) : [];
      return new Set(Array.isArray(parsed) ? parsed : []);
    } catch {
      return new Set();
    }
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [activeDrawerSessionId, setActiveDrawerSessionId] = useState<
    string | null
  >(null);

  const [reminderModalOpen, setReminderModalOpen] = useState<boolean>(false);
  const [editingReminder, setEditingReminder] =
    useState<PlannerReminderItem | null>(null);
  const [remTitle, setRemTitle] = useState<string>("");
  const [remDescription, setRemDescription] = useState<string>("");
  const [remDateIso, setRemDateIso] = useState<string>(() =>
    toIsoDate(new Date())
  );
  const [remDaysBefore, setRemDaysBefore] = useState<number>(1);
  const [remHoursBefore, setRemHoursBefore] = useState<number>(0);
  const [remMinutesBefore, setRemMinutesBefore] = useState<number>(0);
  const [savingReminder, setSavingReminder] = useState<boolean>(false);

  useEffect(() => {
    const syncDay = () => {
      setTodayIso(toIsoDate(new Date()));
    };
    const intervalId = window.setInterval(syncDay, 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  const studentName =
    (profile as { fullName?: string; name?: string } | null)?.fullName ||
    (profile as { fullName?: string; name?: string } | null)?.name ||
    "Jack Stuart";

  const queryRange = useMemo(
    () => getQueryRange(cursorDate, view),
    [cursorDate, view]
  );

  const loadCalendarData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        from: queryRange.from.toISOString(),
        to: queryRange.to.toISOString(),
      });
      const [eventRows, reminderRows] = await Promise.all([
        calendarApiRequest<ApiCalendarEvent[]>(`/events?${params.toString()}`, {
          cache: "no-store",
        }),
        calendarApiRequest<ApiCalendarReminder[]>(
          `/reminders?${params.toString()}`,
          { cache: "no-store" }
        ),
      ]);

      const dateFormatter = new Intl.DateTimeFormat(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      const timeFormatter = new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit",
      });

      setSessions(
        (Array.isArray(eventRows) ? eventRows : []).map((ev) =>
          mapApiEventToSession(ev, addedIds)
        )
      );

      const mappedReminders: PlannerReminderItem[] = (
        Array.isArray(reminderRows) ? reminderRows : []
      ).map((rem) => {
        const remindDate = new Date(rem.remindAt);
        const offsetText = formatOffsetLabel(rem);
        return {
          id: rem.id,
          title: rem.title,
          description: rem.description || "",
          dateLabel: dateFormatter.format(remindDate),
          remindAtIso: rem.remindAt,
          daysBefore: rem.daysBefore ?? 0,
          hoursBefore: rem.hoursBefore ?? 0,
          minutesBefore: rem.minutesBefore ?? 0,
          cadence: rem.eventId
            ? `${offsetText} · ${timeFormatter.format(remindDate)}`
            : offsetText || timeFormatter.format(remindDate),
          eventId: rem.eventId,
        };
      });
      setReminders(mappedReminders);
    } catch {
      setSessions(buildFallbackSessions(cursorDate, addedIds));
      setReminders(buildFallbackReminders(cursorDate));
    } finally {
      setLoading(false);
    }
  }, [addedIds, cursorDate, queryRange.from, queryRange.to]);

  useEffect(() => {
    void loadCalendarData();
  }, [loadCalendarData]);

  const toggleAdded = async (session: PlannerSession) => {
    const nextAdded = !session.isAdded;

    setAddedIds((prev) => {
      const next = new Set(prev);
      if (nextAdded) next.add(session.id);
      else next.delete(session.id);
      try {
        localStorage.setItem(
          ADDED_SESSIONS_STORAGE_KEY,
          JSON.stringify([...next])
        );
      } catch {
        // Ignore storage errors
      }
      return next;
    });

    setSessions((prev) =>
      prev.map((s) => (s.id === session.id ? { ...s, isAdded: nextAdded } : s))
    );

    try {
      if (nextAdded) {
        const created = await calendarApiRequest<ApiCalendarEvent>("/events", {
          method: "POST",
          body: JSON.stringify({
            scope: "user",
            eventType: "lesson",
            title: session.title,
            description: session.about,
            startAt: new Date(`${session.isoDate}T09:00:00`).toISOString(),
            endAt: new Date(`${session.isoDate}T10:00:00`).toISOString(),
            allDay: false,
            color: session.dotColor,
          }),
        });
        if (created?.id) {
          setSessions((prev) =>
            prev.map((s) =>
              s.id === session.id
                ? { ...s, userCalendarEventId: created.id }
                : s
            )
          );
        }
      } else if (session.userCalendarEventId) {
        await calendarApiRequest(`/events/${session.userCalendarEventId}`, {
          method: "DELETE",
        });
      }
    } catch {
      // Keep optimistic UI state when backend endpoint isn't active yet
    }
  };

  const openNewReminderModal = () => {
    setEditingReminder(null);
    setRemTitle("");
    setRemDescription("");
    setRemDateIso(selectedIsoDate || todayIso);
    setRemDaysBefore(1);
    setRemHoursBefore(0);
    setRemMinutesBefore(0);
    setReminderModalOpen(true);
  };

  const handleSaveReminder = async (e: FormEvent) => {
    e.preventDefault();
    if (!remTitle.trim()) return;
    setSavingReminder(true);

    const remindDate = new Date(`${remDateIso}T09:00:00`);
    const dateLabel = new Intl.DateTimeFormat(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(remindDate);
    const cadence = formatOffsetLabel({
      daysBefore: remDaysBefore,
      hoursBefore: remHoursBefore,
      minutesBefore: remMinutesBefore,
    });

    const payload = {
      scope: "user" as ApiCalendarScope,
      eventId: editingReminder?.eventId ?? null,
      title: remTitle.trim(),
      description: remDescription.trim(),
      daysBefore: Number(remDaysBefore) || 0,
      hoursBefore: Number(remHoursBefore) || 0,
      minutesBefore: Number(remMinutesBefore) || 0,
      remindAt: remindDate.toISOString(),
      color: "#7E57C2",
    };

    try {
      if (editingReminder) {
        const updated = await calendarApiRequest<ApiCalendarReminder>(
          `/reminders/${editingReminder.id}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );
        setReminders((prev) =>
          prev.map((r) =>
            r.id === editingReminder.id
              ? {
                  ...r,
                  id: updated?.id ?? r.id,
                  title: payload.title,
                  description: payload.description,
                  dateLabel,
                  remindAtIso: payload.remindAt,
                  daysBefore: payload.daysBefore,
                  hoursBefore: payload.hoursBefore,
                  minutesBefore: payload.minutesBefore,
                  cadence,
                }
              : r
          )
        );
      } else {
        const created = await calendarApiRequest<ApiCalendarReminder>(
          "/reminders",
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
        );
        setReminders((prev) => [
          {
            id: created?.id ?? `rem-${Date.now()}`,
            title: payload.title,
            description: payload.description,
            dateLabel,
            remindAtIso: payload.remindAt,
            daysBefore: payload.daysBefore,
            hoursBefore: payload.hoursBefore,
            minutesBefore: payload.minutesBefore,
            cadence,
            eventId: null,
          },
          ...prev,
        ]);
      }
    } catch {
      if (editingReminder) {
        setReminders((prev) =>
          prev.map((r) =>
            r.id === editingReminder.id
              ? {
                  ...r,
                  title: payload.title,
                  description: payload.description,
                  dateLabel,
                  remindAtIso: payload.remindAt,
                  daysBefore: payload.daysBefore,
                  hoursBefore: payload.hoursBefore,
                  minutesBefore: payload.minutesBefore,
                  cadence,
                }
              : r
          )
        );
      } else {
        setReminders((prev) => [
          {
            id: `rem-${Date.now()}`,
            title: payload.title,
            description: payload.description,
            dateLabel,
            remindAtIso: payload.remindAt,
            daysBefore: payload.daysBefore,
            hoursBefore: payload.hoursBefore,
            minutesBefore: payload.minutesBefore,
            cadence,
            eventId: null,
          },
          ...prev,
        ]);
      }
    } finally {
      setSavingReminder(false);
      setReminderModalOpen(false);
      setEditingReminder(null);
    }
  };

  const stepPeriod = (delta: number) => {
    setCursorDate((prev) => {
      const next = new Date(prev);
      if (view === "day") {
        next.setDate(next.getDate() + delta);
        setSelectedIsoDate(toIsoDate(next));
      } else if (view === "week") {
        next.setDate(next.getDate() + delta * 7);
      } else if (view === "month") {
        next.setMonth(next.getMonth() + delta);
      } else {
        next.setFullYear(next.getFullYear() + delta);
      }
      return next;
    });
  };

  const headingLabel = useMemo(() => {
    if (view === "year") return String(cursorDate.getFullYear());
    if (view === "week") {
      const ws = startOfWeekSun(cursorDate);
      const we = new Date(ws);
      we.setDate(ws.getDate() + 6);
      const startMonth = ws.toLocaleString("en-US", { month: "long" });
      const endMonth = we.toLocaleString("en-US", { month: "long" });
      return startMonth === endMonth
        ? `${startMonth} ${ws.getDate()} - ${we.getDate()}, ${we.getFullYear()}`
        : `${startMonth} ${ws.getDate()} - ${endMonth} ${we.getDate()}, ${we.getFullYear()}`;
    }
    return cursorDate.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
  }, [cursorDate, view]);

  const monthCells = useMemo(() => {
    const year = cursorDate.getFullYear();
    const month = cursorDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const gridStart = startOfWeekSun(firstOfMonth);
    return Array.from({ length: 35 }, (_, idx) => {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + idx);
      return {
        date: d,
        iso: toIsoDate(d),
        dayNumber: d.getDate(),
        inMonth: d.getMonth() === month,
      };
    });
  }, [cursorDate]);

  const weekDays = useMemo(() => {
    const ws = startOfWeekSun(cursorDate);
    return Array.from({ length: 7 }, (_, idx) => {
      const d = new Date(ws);
      d.setDate(ws.getDate() + idx);
      return {
        date: d,
        iso: toIsoDate(d),
        weekdayShort: d
          .toLocaleString("en-US", { weekday: "short" })
          .toUpperCase(),
        dayNumber: d.getDate(),
      };
    });
  }, [cursorDate]);

  const sessionsByIso = useMemo(() => {
    const map = new Map<string, PlannerSession[]>();
    for (const s of sessions) {
      const list = map.get(s.isoDate) ?? [];
      list.push(s);
      map.set(s.isoDate, list);
    }
    return map;
  }, [sessions]);

  const selectedDateObj = useMemo(
    () => parseIsoDateLocal(selectedIsoDate),
    [selectedIsoDate]
  );

  const selectedDaySessions = useMemo(
    () => sessionsByIso.get(selectedIsoDate) ?? [],
    [sessionsByIso, selectedIsoDate]
  );

  const popoverDateObj = useMemo(
    () => (popoverIsoDate ? parseIsoDateLocal(popoverIsoDate) : null),
    [popoverIsoDate]
  );

  const popoverSessions = useMemo(
    () => (popoverIsoDate ? sessionsByIso.get(popoverIsoDate) ?? [] : []),
    [sessionsByIso, popoverIsoDate]
  );

  const activeDrawerSession = useMemo(
    () => sessions.find((s) => s.id === activeDrawerSessionId) ?? null,
    [sessions, activeDrawerSessionId]
  );

  const dayHours = Array.from({ length: 11 }, (_, i) => i);
  const weekHours = Array.from({ length: 7 }, (_, i) => i + 9);
  const todayParts = useMemo(() => {
    const [y, m, d] = todayIso.split("-").map(Number);
    return { year: y, monthIndex: (m || 1) - 1, day: d };
  }, [todayIso]);

  const renderSelectedDaySidebar = () => (
    <div className="space-y-4 lg:col-span-4">
      <div className="rounded-2xl border border-[#F0E2CF] bg-[#FCF4E8] p-5">
        <p className="text-xs font-semibold tracking-[0.12em] text-[#8C6849] uppercase">
          {selectedDateObj.toLocaleString("en-US", { weekday: "long" })}
        </p>
        <h4 className="mb-4 mt-0.5 text-2xl font-bold text-[#4A2511]">
          {selectedDateObj.toLocaleString("en-US", {
            month: "long",
            day: "numeric",
          })}
        </h4>

        {selectedDaySessions.length === 0 ? (
          <p className="text-sm text-[#7B6049]">
            No scheduled classes or events on this date.
          </p>
        ) : (
          <div className="divide-y divide-[#EAD8C0]">
            {selectedDaySessions.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0"
              >
                <button
                  type="button"
                  onClick={() => setActiveDrawerSessionId(item.id)}
                  className="text-left"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.dotColor }}
                    />
                    <span className="text-base font-semibold text-[#4A2511] hover:underline">
                      {item.title}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#7B6049]">
                    ◎ {item.locationLabel}
                  </p>
                  <p className="mt-0.5 text-sm text-[#7B6049]">
                    ◷ {item.timeRange}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => void toggleAdded(item)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                    item.isAdded
                      ? "bg-[#E7D8FA] text-[#5B2C83]"
                      : "bg-[#5B2C83] text-white hover:bg-[#49216A]"
                  }`}
                >
                  {item.isAdded ? "Added" : "Add"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-[#F0E2CF] bg-white p-4">
        <p className="mb-2.5 text-sm font-semibold text-[#4A2511]">Legend</p>
        <div className="grid grid-cols-2 gap-2.5 text-sm text-[#6E533E]">
          {LEGEND_ITEMS.map((leg) => (
            <div key={leg.label} className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: leg.dotColor }}
              />
              <span>{leg.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFDF7] via-[#FDF6E8] to-[#FBF1DF] px-5 py-6 text-base text-[#4A2511]">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-[#8C6849] uppercase">
            THE DONOVAN&apos;S PIANO ROOM
          </p>
          <h1 className="mt-0.5 text-3xl font-bold tracking-tight text-[#4A2511]">
            Welcome Back, {studentName}
          </h1>
        </div>

        <div className="flex items-center gap-2.5 text-sm text-[#6E533E]">
          <span>Viewing as</span>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#EAD9C3] bg-white px-4 py-1.5 text-sm font-medium text-[#4A2511] shadow-2xs">
            Student
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EFE6FA] text-xs text-[#5B2C83]">
              ⌄
            </span>
          </span>
        </div>
      </header>

      <section className="mb-5">
        <p className="text-xs font-semibold tracking-[0.14em] text-[#8C6849] uppercase">
          LEARN, GATHER, GROW
        </p>
        <h2 className="mt-1 text-4xl font-bold tracking-tight text-[#4A2511]">
          Live Classes &amp; Special Programs
        </h2>
        <p className="mt-1.5 text-base text-[#6E533E]">
          Schedule your live classes and special programs here.
        </p>
      </section>

      <section className="relative rounded-3xl border border-[#F0E1CC] bg-[#FFFDF9] p-5 sm:p-6 shadow-xs">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-[#8C6849] uppercase">
              PLANNER CALENDAR
            </p>
            <h3 className="mt-0.5 text-3xl font-bold text-[#4A2511]">
              {headingLabel}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => stepPeriod(-1)}
                aria-label="Previous"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EAD9C3] bg-white text-sm font-semibold text-[#5B2C83] hover:bg-[#FAF3E8]"
              >
                &lt;
              </button>
              <button
                type="button"
                onClick={() => {
                  const freshNow = new Date();
                  setTodayIso(toIsoDate(freshNow));
                  setCursorDate(freshNow);
                  setSelectedIsoDate(toIsoDate(freshNow));
                }}
                className="rounded-full border border-[#EAD9C3] bg-white px-4 py-1.5 text-sm font-semibold text-[#5B2C83] hover:bg-[#FAF3E8]"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => stepPeriod(1)}
                aria-label="Next"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EAD9C3] bg-white text-sm font-semibold text-[#5B2C83] hover:bg-[#FAF3E8]"
              >
                &gt;
              </button>
            </div>

            <div className="inline-flex rounded-full bg-[#F5E6D3] p-1">
              {(["day", "week", "month", "year"] as StudentCalendarView[]).map(
                (mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setView(mode)}
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition ${
                      view === mode
                        ? "bg-[#5B2C83] text-white"
                        : "text-[#6E533E] hover:text-[#4A2511]"
                    }`}
                  >
                    {mode}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-[#F2E5D2] bg-[#FCF4E8] p-10 text-center text-sm font-medium text-[#6E533E]">
            Loading calendar schedule...
          </div>
        ) : (
          <>
            {view === "day" && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="max-h-[540px] overflow-y-auto rounded-2xl border border-[#F2E5D2] bg-[#FCF4E8] p-5 lg:col-span-8">
                  <div className="divide-y divide-[#EAD8C0]">
                    {dayHours.map((hr) => {
                      const hourItems = selectedDaySessions.filter(
                        (s) => s.startHour === hr
                      );
                      return (
                        <div
                          key={hr}
                          className="flex min-h-12 items-start gap-4 pt-1 text-xs text-[#8C6E54]"
                        >
                          <span className="w-14 shrink-0 text-xs font-medium">
                            {formatHourLabel(hr)}
                          </span>
                          <div className="flex flex-1 flex-wrap gap-2">
                            {hourItems.map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => setActiveDrawerSessionId(item.id)}
                                className="rounded-xl border border-[#D9C3F7] bg-[#EFE3FC] px-3 py-1.5 text-left text-xs font-semibold text-[#4C2A7A] shadow-2xs hover:bg-[#E5D3FA]"
                              >
                                {item.title} · {item.timeRange}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {renderSelectedDaySidebar()}
              </div>
            )}

            {view === "week" && (
              <div className="overflow-x-auto rounded-2xl border border-[#F2E5D2] bg-white">
                <div className="min-w-[760px]">
                  <div className="grid grid-cols-8 border-b border-[#EFE3D2] bg-[#FFFDF9] text-center">
                    <div className="border-r border-[#EFE3D2] p-3" />
                    {weekDays.map((wd) => {
                      const isToday = wd.iso === todayIso;
                      return (
                        <div
                          key={wd.iso}
                          className={`border-r border-[#EFE3D2] py-2.5 last:border-r-0 ${
                            isToday ? "bg-[#F4EBFF]" : ""
                          }`}
                        >
                          <div className="text-xs font-semibold tracking-wider text-[#8C6E54]">
                            {wd.weekdayShort}
                          </div>
                          <div
                            className={`mx-auto mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-base font-bold ${
                              isToday
                                ? "bg-[#B78CF3] text-white"
                                : "text-[#4A2511]"
                            }`}
                          >
                            {wd.dayNumber}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="divide-y divide-[#EFE3D2]">
                    {weekHours.map((hr) => (
                      <div key={hr} className="grid min-h-[76px] grid-cols-8">
                        <div className="border-r border-[#EFE3D2] px-2.5 pt-2 text-xs font-medium text-[#8C6E54]">
                          {formatHourLabel(hr)}
                        </div>
                        {weekDays.map((wd) => {
                          const slotSessions = (
                            sessionsByIso.get(wd.iso) ?? []
                          ).filter((s) => s.startHour === hr);
                          return (
                            <div
                              key={`${wd.iso}-${hr}`}
                              onClick={() => setSelectedIsoDate(wd.iso)}
                              className="cursor-pointer border-r border-[#EFE3D2] p-1.5 last:border-r-0 hover:bg-[#FAF4FF]"
                            >
                              {slotSessions.map((item) => (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveDrawerSessionId(item.id);
                                  }}
                                  className={`mb-1 block w-full rounded-lg border p-2 text-left text-xs ${
                                    item.category === "Unit/Lesson"
                                      ? "border-[#D6C1F7] bg-[#ECE0FC] text-[#4C2A7A]"
                                      : "border-[#EED0B5] bg-[#FCE8D5] text-[#6E4726]"
                                  }`}
                                >
                                  <div className="font-semibold leading-tight">
                                    {item.title}: {item.locationLabel}
                                  </div>
                                  <div className="mt-1 text-xs opacity-80">
                                    {formatHourLabel(item.startHour)}
                                  </div>
                                </button>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {view === "month" && (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                <div className="rounded-2xl border border-[#F0E2CF] bg-[#FCF4E8] p-4 sm:p-5 lg:col-span-8">
                  <div className="mb-3 grid grid-cols-7 text-center text-sm font-medium text-[#6E533E]">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (d) => (
                        <div key={d} className="py-1">
                          {d}
                        </div>
                      )
                    )}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {monthCells.map((cell) => {
                      const isSelected = cell.iso === selectedIsoDate;
                      const isToday = cell.iso === todayIso;
                      const daySessions = sessionsByIso.get(cell.iso) ?? [];

                      return (
                        <button
                          key={cell.iso}
                          type="button"
                          onClick={() => {
                            setSelectedIsoDate(cell.iso);
                            if (daySessions.length > 0) {
                              setPopoverIsoDate(cell.iso);
                            }
                          }}
                          className={`relative flex h-20 flex-col justify-between rounded-lg border p-2 text-left transition ${
                            isToday
                              ? "border-[#A67BF0] bg-[#B78CF3] font-semibold text-white"
                              : isSelected
                                ? "border-[#E5D5C0] bg-white font-semibold text-[#4A2511] shadow-2xs"
                                : cell.inMonth
                                  ? "border-[#D6BCEF] bg-[#EEDFF9] text-[#4A2511] hover:bg-[#E5D0F6]"
                                  : "border-[#EFE1CE] bg-[#FBF4EA] text-[#9A826B]"
                          }`}
                        >
                          <span className="text-sm">{cell.dayNumber}</span>
                          {daySessions.length > 0 && (
                            <span className="flex items-center justify-end gap-1">
                              {daySessions.slice(0, 3).map((s) => (
                                <span
                                  key={s.id}
                                  className="h-2 w-2 rounded-full"
                                  style={{ backgroundColor: s.dotColor }}
                                />
                              ))}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {renderSelectedDaySidebar()}
              </div>
            )}

            {view === "year" && (
              <div className="grid grid-cols-1 gap-4 rounded-2xl border border-[#F2E5D2] bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 12 }, (_, mIdx) => {
                  const mDate = new Date(cursorDate.getFullYear(), mIdx, 1);
                  const mName = mDate.toLocaleString("en-US", { month: "long" });
                  const firstDow = mDate.getDay();
                  const daysInMonth = new Date(
                    cursorDate.getFullYear(),
                    mIdx + 1,
                    0
                  ).getDate();
                  const isCurrentMonth =
                    cursorDate.getFullYear() === todayParts.year &&
                    mIdx === todayParts.monthIndex;

                  return (
                    <div
                      key={mName}
                      className={`rounded-xl p-3 ${
                        isCurrentMonth ? "bg-[#F3E9FF]" : "bg-white"
                      }`}
                    >
                      <div className="mb-2 text-sm font-bold text-[#4A2511]">
                        {mName}
                      </div>
                      <div className="mb-1 grid grid-cols-7 text-center text-xs font-medium text-[#9A826B]">
                        {["S", "M", "T", "W", "T", "F", "S"].map((ch, i) => (
                          <span key={i}>{ch}</span>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-y-1 text-center text-xs text-[#5A4330]">
                        {Array.from({ length: firstDow }, (_, i) => (
                          <span key={`empty-${i}`} />
                        ))}
                        {Array.from({ length: daysInMonth }, (_, dIdx) => {
                          const dNum = dIdx + 1;
                          const iso = `${cursorDate.getFullYear()}-${String(
                            mIdx + 1
                          ).padStart(2, "0")}-${String(dNum).padStart(2, "0")}`;
                          const hasEvents = (sessionsByIso.get(iso) ?? [])
                            .length > 0;
                          const isToday = iso === todayIso;

                          return (
                            <button
                              key={iso}
                              type="button"
                              onClick={() => {
                                setSelectedIsoDate(iso);
                                if (hasEvents) setPopoverIsoDate(iso);
                              }}
                              className={`mx-auto flex h-6 w-6 items-center justify-center rounded-md ${
                                isToday
                                  ? "bg-[#B78CF3] font-semibold text-white"
                                  : hasEvents
                                    ? "border border-[#9A826B] bg-white font-semibold text-[#4A2511]"
                                    : "hover:bg-[#EEDFF9]"
                              }`}
                            >
                              {dNum}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {popoverIsoDate && popoverDateObj && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/15 p-4"
            onClick={() => setPopoverIsoDate(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[250px] rounded-2xl border border-[#EAE0D2] bg-white p-4 shadow-lg"
            >
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-[#8C6E54] uppercase">
                    {popoverDateObj
                      .toLocaleString("en-US", { weekday: "short" })
                      .toUpperCase()}
                  </p>
                  <p className="text-2xl font-bold text-[#4A2511]">
                    {popoverDateObj.getDate()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPopoverIsoDate(null)}
                  className="text-sm text-[#6E533E] hover:text-[#4A2511]"
                  aria-label="Close day popover"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-1.5">
                {popoverSessions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setPopoverIsoDate(null);
                      setActiveDrawerSessionId(s.id);
                    }}
                    className={`block w-full rounded-md border px-2.5 py-1.5 text-left text-xs font-medium ${s.chipClass}`}
                  >
                    {s.tagLabel}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="mt-6 rounded-3xl border border-[#F2E2CC] bg-[#FBEAD3] p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-[#8C6849] uppercase">
              STAY ON TRACK
            </p>
            <h3 className="mt-0.5 text-2xl font-bold text-[#4A2511]">
              Reminders
            </h3>
            <p className="text-sm text-[#6E533E]">
              Schedule notifications and reminders here.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-[#E6CEAF] bg-[#FFF8EE] px-4 py-1 text-sm font-medium text-[#6E533E]">
              {reminders.length} scheduled
            </span>
            <button
              type="button"
              onClick={openNewReminderModal}
              className="rounded-full bg-[#5B2C83] px-3.5 py-1 text-xs font-semibold text-white transition hover:bg-[#49216A]"
            >
              + Reminder
            </button>
          </div>
        </div>

        {reminders.length === 0 ? (
          <div className="rounded-2xl border border-[#F3E5D2] bg-[#FFFDF9] p-4 text-sm text-[#7B6049]">
            No reminders scheduled for this period.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-3">
            {reminders.map((rem) => (
              <div
                key={rem.id}
                className="flex items-start gap-3 rounded-2xl border border-[#F3E5D2] bg-[#FFFDF9] p-4"
              >
                <span className="mt-1.5 h-3 w-3 shrink-0 rounded-full border-2 border-[#7E57C2]" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-sm font-bold text-[#4A2511]">
                      {rem.title}
                    </p>
                    <span className="shrink-0 text-xs text-[#8C6E54]">
                      {rem.dateLabel}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#7B6049]">{rem.cadence}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {reminderModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/25 p-4"
          onClick={() => setReminderModalOpen(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => void handleSaveReminder(e)}
            className="w-full max-w-md rounded-2xl border border-[#EAE0D2] bg-[#FFFDF9] p-6 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-xl font-bold text-[#4A2511]">New Reminder</h4>
              <button
                type="button"
                onClick={() => setReminderModalOpen(false)}
                className="text-sm text-[#6E533E] hover:text-[#4A2511]"
                aria-label="Close reminder modal"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-sm">
              <div>
                <label className="block text-xs font-semibold tracking-wider text-[#8C6849] uppercase">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={remTitle}
                  onChange={(e) => setRemTitle(e.target.value)}
                  placeholder="e.g., Piano Scales Practice"
                  className="mt-1 w-full rounded-xl border border-[#E5D5C0] bg-white px-3.5 py-2 text-[#4A2511] focus:border-[#5B2C83] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider text-[#8C6849] uppercase">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={remDateIso}
                  onChange={(e) => setRemDateIso(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E5D5C0] bg-white px-3.5 py-2 text-[#4A2511] focus:border-[#5B2C83] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-[#8C6849]">
                    Days before
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={remDaysBefore}
                    onChange={(e) => setRemDaysBefore(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-[#E5D5C0] bg-white px-3 py-1.5 text-[#4A2511]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8C6849]">
                    Hours before
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={remHoursBefore}
                    onChange={(e) => setRemHoursBefore(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-[#E5D5C0] bg-white px-3 py-1.5 text-[#4A2511]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8C6849]">
                    Mins before
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={remMinutesBefore}
                    onChange={(e) => setRemMinutesBefore(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-[#E5D5C0] bg-white px-3 py-1.5 text-[#4A2511]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider text-[#8C6849] uppercase">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={remDescription}
                  onChange={(e) => setRemDescription(e.target.value)}
                  placeholder="Optional reminder note..."
                  className="mt-1 w-full rounded-xl border border-[#E5D5C0] bg-white px-3.5 py-2 text-[#4A2511] focus:border-[#5B2C83] focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setReminderModalOpen(false)}
                className="rounded-full border border-[#EAD9C3] bg-white px-4 py-2 text-sm font-semibold text-[#6E533E] hover:bg-[#FAF3E8]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingReminder}
                className="rounded-full bg-[#5B2C83] px-5 py-2 text-sm font-semibold text-white hover:bg-[#49216A] disabled:opacity-60"
              >
                {savingReminder ? "Saving..." : "Create Reminder"}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeDrawerSession && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-end bg-black/25 p-4 sm:p-6"
          onClick={() => setActiveDrawerSessionId(null)}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            className="max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] w-full max-w-[540px] overflow-y-auto rounded-2xl bg-[#FAF4EC] p-5 sm:p-6 shadow-2xl lg:w-[46%]"
          >
            <div className="rounded-2xl bg-gradient-to-br from-[#FDEFE2] via-[#F7ECFA] to-[#EADBF9] p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-[#E7D8FA] px-3 py-1 text-xs font-semibold text-[#5B2C83]">
                  {activeDrawerSession.badge}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveDrawerSessionId(null)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EFE7F8] text-xs font-semibold text-[#6E533E] hover:text-[#4A2511]"
                  aria-label="Close details"
                >
                  ✕
                </button>
              </div>

              <h4 className="text-2xl font-bold text-[#4A2511]">
                {activeDrawerSession.title}
              </h4>

              <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#6E533E]">
                <span>◎ {activeDrawerSession.locationLabel}</span>
                <span>◷ {activeDrawerSession.timeRange}</span>
                <span>▦ {activeDrawerSession.dateLabel}</span>
              </div>

              <button
                type="button"
                onClick={() => void toggleAdded(activeDrawerSession)}
                className={`mt-4 w-full rounded-full py-2.5 text-sm font-semibold transition ${
                  activeDrawerSession.isAdded
                    ? "border border-[#8E5BC2] bg-[#FAF4FC] text-[#5B2C83] hover:bg-[#EFE2FA]"
                    : "bg-[#5B2C83] text-white hover:bg-[#482068]"
                }`}
              >
                {activeDrawerSession.isAdded
                  ? "Added - Remove from Calendar"
                  : "Add to Calendar"}
              </button>

              <p className="mt-2 text-center text-xs text-[#7B6049]">
                Added events will show on your Dashboard Calendar
              </p>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="rounded-xl border border-[#EFE2D0] bg-white p-4">
                <p className="text-xs font-semibold tracking-wider text-[#8C6E54] uppercase">
                  ABOUT THIS LIVE CLASS
                </p>
                <p className="mt-1.5 leading-relaxed text-[#4A2511]">
                  {activeDrawerSession.about}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#EFE2D0] bg-white p-3.5">
                  <p className="text-xs font-semibold tracking-wider text-[#8C6E54] uppercase">
                    WHO THIS IS FOR
                  </p>
                  <p className="mt-1 font-medium text-[#4A2511]">
                    {activeDrawerSession.whoThisIsFor}
                  </p>
                </div>

                <div className="rounded-xl border border-[#EFE2D0] bg-white p-3.5">
                  <p className="text-xs font-semibold tracking-wider text-[#8C6E54] uppercase">
                    CLASS
                  </p>
                  <p className="mt-1 font-medium text-[#4A2511]">
                    {activeDrawerSession.className}
                  </p>
                </div>

                <div className="rounded-xl border border-[#EFE2D0] bg-white p-3.5">
                  <p className="text-xs font-semibold tracking-wider text-[#8C6E54] uppercase">
                    WHERE
                  </p>
                  <p className="mt-1 font-medium text-[#4A2511]">
                    {activeDrawerSession.where}
                  </p>
                </div>

                <div className="rounded-xl border border-[#EFE2D0] bg-white p-3.5">
                  <p className="text-xs font-semibold tracking-wider text-[#8C6E54] uppercase">
                    INSTRUCTOR / HOST
                  </p>
                  <p className="mt-1 font-medium text-[#4A2511]">
                    {activeDrawerSession.instructor}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-[#EFE2D0] bg-white p-4">
                <p className="text-xs font-semibold tracking-wider text-[#8C6E54] uppercase">
                  SCHEDULE DETAILS
                </p>
                <p className="mt-1 text-[#4A2511]">
                  {activeDrawerSession.scheduleDetails}
                </p>
              </div>

              <div className="rounded-xl border border-[#EFE2D0] bg-white p-4">
                <p className="text-xs font-semibold tracking-wider text-[#8C6E54] uppercase">
                  SCHEDULED REMINDERS
                </p>
                {activeDrawerSession.reminders.length === 0 ? (
                  <p className="mt-1.5 text-xs text-[#7B6049]">
                    No reminders set for this item.
                  </p>
                ) : (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {activeDrawerSession.reminders.map((rem) => (
                      <span
                        key={rem}
                        className="rounded-md bg-[#F7EFE4] px-2.5 py-1 text-xs font-medium text-[#5E4734]"
                      >
                        {rem}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}