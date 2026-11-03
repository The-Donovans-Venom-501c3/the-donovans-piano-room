export const CALENDAR_COLOR_CATEGORIES = [
  { key: "userEvent", label: "My events", color: "#6f219e" },
  { key: "userReminder", label: "My reminders", color: "#e98427" },
  { key: "organizationEvent", label: "Organization events", color: "#2563eb" },
  {
    key: "organizationReminder",
    label: "Organization reminders",
    color: "#c026d3",
  },
] as const;

export type CalendarColorKey =
  (typeof CALENDAR_COLOR_CATEGORIES)[number]["key"];
export type CalendarPalette = Record<CalendarColorKey, string>;
export const CALENDAR_PALETTE_STORAGE_KEY = "calendar-display-palette-v1";
export const DEFAULT_CALENDAR_PALETTE = Object.fromEntries(
  CALENDAR_COLOR_CATEGORIES.map(({ key, color }) => [key, color]),
) as CalendarPalette;

export function calendarColorKey(
  scope: "user" | "organization",
  kind: "event" | "reminder",
): CalendarColorKey {
  return `${scope}${kind === "event" ? "Event" : "Reminder"}` as CalendarColorKey;
}

export function parseCalendarPalette(value: unknown): CalendarPalette {
  const palette = { ...DEFAULT_CALENDAR_PALETTE };
  if (!value || typeof value !== "object") return palette;
  for (const { key } of CALENDAR_COLOR_CATEGORIES) {
    const color = (value as Record<string, unknown>)[key];
    if (typeof color === "string" && /^#[0-9a-f]{6}$/i.test(color))
      palette[key] = color;
  }
  return palette;
}
