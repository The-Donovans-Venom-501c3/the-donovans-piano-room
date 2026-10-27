const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const ts = require("typescript");

function loadTypeScript(relativePath, overrides) {
  const filename = path.resolve(__dirname, "..", relativePath);
  const { outputText } = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
    fileName: filename,
  });
  const module = { exports: {} };
  new Function("require", "module", "exports", outputText)(
    (name) => overrides[name] ?? (name === "@/lib/calendarColors" ? loadTypeScript("src/lib/calendarColors.ts", {}) : require(name)), module, module.exports,
  );
  return module.exports.default ?? module.exports;
}

const empty = () => null;
const Wrapper = loadTypeScript("src/components/ContentWrappers/authorized-1/AuthorizedWrapper2.tsx", {
  "../../footers/Footer4": { default: empty, __esModule: true },
  "../../navbars/Navbar4Left": { default: empty, __esModule: true },
  "next/image": { default: empty, __esModule: true },
});
const component = (value) => ({ default: value, __esModule: true });
const Page = loadTypeScript("src/app/(authorized)/admin/page.tsx", {
  "@/components/ContentWrappers/authorized-1/AuthorizedWrapper2": component(Wrapper),
  "@/utils/general": { authorizedWrapperTitles: { Admin: "Admin" } },
  "@/utils/stores": { nav4leftLinks: { admin: "admin" } },
  "next/navigation": { useSearchParams: () => new URLSearchParams() },
  "./components/Calendar": component(() => React.createElement("form", null, "Panel content")),
  "./components/CouponsAdmin": component(empty),
  "./components/NotificationsAdmin": component(empty),
  "./components/RbacViewer": component(empty),
  "./components/RbacManager": component(empty),
});

test("admin navigation renders outside the independently scrolling panel", () => {
  const html = renderToStaticMarkup(React.createElement(Page));
  const navStart = html.indexOf('<nav aria-label="Admin sections"');
  const navEnd = html.indexOf("</nav>", navStart);
  const scrollStart = html.indexOf('id="wrapper-content-scroll"');
  assert.ok(navStart >= 0 && navEnd < scrollStart);
  assert.ok(html.indexOf("Panel content") > scrollStart);
  assert.match(html.slice(scrollStart), /min-h-0 flex-1/);
  for (const label of ["Calendar", "Coupons", "Notifications", "RBAC Viewer", "RBAC Manager"]) {
    assert.ok(html.slice(navStart, navEnd).includes(`>${label}</button>`));
  }
  assert.equal((html.slice(navStart, navEnd).match(/type="button"/g) ?? []).length, 5);
});

test("other wrapper pages retain their existing scroll sizing without a header", () => {
  const html = renderToStaticMarkup(React.createElement(Wrapper, { pageTitle: "Dashboard" }, "Dashboard content"));
  assert.match(html, /h-\[80\.8vh\]/);
  assert.doesNotMatch(html, /min-h-0 flex-1/);
});

const Calendar = loadTypeScript("src/app/(authorized)/admin/components/Calendar.tsx", {
  "@/lib/api/api": { apiRequest: () => { throw new Error("SSR must not fetch calendar data"); } },
});
const PlannerPage = loadTypeScript("src/app/(authorized)/planner/page.tsx", {
  "@/components/ContentWrappers/authorized-1/AuthorizedWrapper2": component(Wrapper),
  "../admin/components/Calendar": component(Calendar),
  "@/utils/general": { authorizedWrapperTitles: { Planner: "Planner" } },
  "@/utils/stores": { nav4leftLinks: { planner: "planner" } },
});

test("Planner renders the shared calendar with personalized copy and all calendar views", () => {
  const tree = PlannerPage();
  assert.equal(tree.props.openedLink, "planner");
  assert.equal(tree.props.pageTitle, "Planner");
  assert.equal(tree.props.children.type, Calendar);
  assert.equal(tree.props.children.props.showPermissionBadges, false);
  assert.equal(tree.props.children.props.personalEditsOnly, true);
  const html = renderToStaticMarkup(tree);
  assert.match(html, /My planner/);
  assert.match(html, /Make time for music/);
  for (const view of ["Day", "Week", "Month", "Year"]) assert.ok(html.includes(`>${view}</button>`));
  assert.match(html, /Refresh calendar/);
  assert.match(html, /Add event/);
  assert.match(html, /Add reminder/);
  assert.match(html, /Organization items · Read-only/);
  assert.doesNotMatch(html, /Shared with everyone/);
  assert.doesNotMatch(html, /Admin sections/);
});

test("shared calendar keeps Admin defaults and supports separate presentation", () => {
  const admin = renderToStaticMarkup(React.createElement(Calendar));
  assert.match(admin, /class="page-title">Calendar/);
  assert.match(admin, /Plan your practice/);
  assert.match(admin, /Shared with everyone/);
  const customized = renderToStaticMarkup(React.createElement(Calendar, {
    title: "Practice schedule", eyebrow: "Personal calendar", initialView: "week",
  }));
  assert.match(customized, /Practice schedule/);
  assert.match(customized, /class="selected">Week/);
});

test("Planner locks both visibility selectors even for users with publish permission", () => {
  let stateIndex = 0;
  const permissions = { view: true, create: true, edit: true, delete: true, publish: true };
  const event = { title: "Practice", description: "", scope: "user", eventType: "practice", startAt: "2026-10-27T09:00", endAt: "2026-10-27T10:00", allDay: false, color: "#24694e", reminders: [] };
  const reminder = { title: "Practice reminder", description: "", scope: "user", remindAt: "2026-10-27T09:00", color: "#24694e" };
  const CalendarWithForms = loadTypeScript("src/app/(authorized)/admin/components/Calendar.tsx", {
    react: {
      ...React,
      useState: (initial) => {
        const index = stateIndex++;
        return React.useState(index === 4 ? permissions : index === 7 ? event : index === 8 ? reminder : initial);
      },
    },
    "@/lib/api/api": { apiRequest: () => { throw new Error("SSR must not fetch"); } },
  });
  const privateHtml = renderToStaticMarkup(React.createElement(CalendarWithForms, { personalEditsOnly: true }));
  for (const id of ["event-scope", "reminder-scope"]) {
    assert.match(privateHtml, new RegExp(`<select id="${id}" disabled="">`));
  }
  assert.doesNotMatch(privateHtml, /Organization \(everyone\)/);
  stateIndex = 0;
  const adminHtml = renderToStaticMarkup(React.createElement(CalendarWithForms));
  assert.match(adminHtml, /Organization \(everyone\)/);
});

test("workspace CSS configuration registers Tailwind directives without disabling CSS validation", () => {
  const root = path.resolve(__dirname, "..");
  const settings = JSON.parse(readFileSync(path.join(root, ".vscode/settings.json"), "utf8"));
  const data = JSON.parse(readFileSync(path.join(root, settings["css.customData"][0]), "utf8"));
  assert.ok(data.atDirectives.some((directive) => directive.name === "@tailwind"));
  assert.notEqual(settings["css.validate"], false);
});

test("Planner renders organization events and reminders read-only while personal items stay editable", () => {
  let stateIndex = 0;
  const date = new Date("2026-10-27T09:00:00");
  const common = { description: "", color: "#24694e", startAt: date.toISOString(), endAt: date.toISOString(), eventType: "lesson", allDay: false };
  const events = [
    { ...common, id: "org-event", title: "Shared lesson", scope: "organization", userId: null },
    { ...common, id: "own-event", title: "My practice", scope: "user", userId: "user-1" },
  ];
  const reminders = [
    { ...common, id: "org-reminder", title: "Shared reminder", scope: "organization", remindAt: date.toISOString(), eventId: null },
    { ...common, id: "own-reminder", title: "My reminder", scope: "user", remindAt: date.toISOString(), eventId: null },
  ];
  const states = ["day", date, events, reminders, { view: true, create: true, edit: true, delete: true, publish: true }, false];
  const LoadedCalendar = loadTypeScript("src/app/(authorized)/admin/components/Calendar.tsx", {
    react: {
      ...React,
      useState: (initial) => {
        const index = stateIndex++;
        return React.useState(index < states.length ? states[index] : initial);
      },
    },
    "@/lib/api/api": { apiRequest: () => { throw new Error("SSR must not fetch"); } },
  });
  const html = renderToStaticMarkup(React.createElement(LoadedCalendar, { personalEditsOnly: true }));
  for (const [title, color] of [["Shared lesson", "#2563eb"], ["Shared reminder", "#9333ea"], ["My practice", "#15803d"], ["My reminder", "#b45309"]]) {
    assert.match(html, new RegExp(`<button[^>]*style="--event-color:${color}"[^>]*title="${title}`));
  }
  for (const title of ["Shared lesson", "Shared reminder"]) {
    assert.match(html, new RegExp(`<button[^>]*disabled=""[^>]*title="${title}`));
  }
  for (const title of ["My practice", "My reminder"]) {
    assert.match(html, new RegExp(`<button(?![^>]*disabled)[^>]*title="${title}`));
  }
  stateIndex = 0;
  const admin = renderToStaticMarkup(React.createElement(LoadedCalendar));
  assert.match(admin, /<button(?![^>]*disabled)[^>]*title="Shared lesson/);
});

test("calendar palette has four distinct validated customizable category colors", () => {
  const colors = loadTypeScript("src/lib/calendarColors.ts", {});
  assert.equal(new Set(Object.values(colors.DEFAULT_CALENDAR_PALETTE)).size, 4);
  assert.equal(colors.calendarColorKey("organization", "reminder"), "organizationReminder");
  assert.equal(colors.calendarColorKey("user", "event"), "userEvent");
  const custom = colors.parseCalendarPalette({ userEvent: "#123456", organizationEvent: "invalid" });
  assert.equal(custom.userEvent, "#123456");
  assert.equal(custom.organizationEvent, colors.DEFAULT_CALENDAR_PALETTE.organizationEvent);
  assert.deepEqual(colors.parseCalendarPalette(null), colors.DEFAULT_CALENDAR_PALETTE);
  const html = renderToStaticMarkup(React.createElement(Calendar));
  for (const { label } of colors.CALENDAR_COLOR_CATEGORIES) {
    assert.ok(html.includes(`${label} highlight color`));
  }
  assert.match(html, /Customize highlight colors/);
  assert.match(html, /Reset colors/);
});

test("Planner skips the permission endpoint while Admin still requests calendar RBAC", () => {
  const effects = [];
  const calls = [];
  const EffectCalendar = loadTypeScript("src/app/(authorized)/admin/components/Calendar.tsx", {
    react: { ...React, useEffect: (effect) => { effects.push(effect); } },
    "@/lib/api/api": { apiRequest: (url) => { calls.push(url); return Promise.resolve({ actions: {} }); } },
  });
  renderToStaticMarkup(React.createElement(EffectCalendar, { personalEditsOnly: true }));
  effects.at(-1)();
  assert.deepEqual(calls, []);
  effects.length = 0;
  renderToStaticMarkup(React.createElement(EffectCalendar));
  const cleanup = effects.at(-1)();
  assert.deepEqual(calls, ["/rbac/me/permissions/calendar"]);
  cleanup();
});