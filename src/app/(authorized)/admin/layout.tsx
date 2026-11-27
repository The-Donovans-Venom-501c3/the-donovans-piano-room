import type { ReactNode } from "react";

// Route-scoped styles for the admin area. Every selector in this file is
// prefixed with `.admin-ui` (applied via AuthorizedWrapper2's contentClassName),
// so the styles cannot leak into other routes.
import "@/styles/admin-ui.css";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
