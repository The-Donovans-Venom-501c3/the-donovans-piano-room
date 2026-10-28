"use client";

import AuthorizedWrapper2 from "@/components/ContentWrappers/authorized-1/AuthorizedWrapper2";
import Calendar from "../admin/components/Calendar";
import { authorizedWrapperTitles } from "@/utils/general";
import { nav4leftLinks } from "@/utils/stores";

export default function PlannerPage() {
  return (
    <AuthorizedWrapper2
      pageTitle={authorizedWrapperTitles.Planner}
      openedLink={nav4leftLinks.planner}
    >
      <Calendar
        title="My planner"
        eyebrow="Make time for music"
        description="Create and manage your own private events and reminders. Organization events and reminders are visible here as read-only and are managed from Admin."
        showPermissionBadges={false}
        personalEditsOnly
      />
    </AuthorizedWrapper2>
  );
}