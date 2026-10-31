import type { ReactNode } from "react";

// The planner reuses the admin Calendar component, so it opts into the same
// route-scoped admin-ui styles (all selectors are prefixed with `.admin-ui`).
import "@/styles/admin-ui.css";

export default function PlannerLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
