"use client";

import AuthorizedWrapper2 from "@/components/ContentWrappers/authorized-1/AuthorizedWrapper2";
import StudentPlanner from "./StudentPlanner";
import { authorizedWrapperTitles } from "@/utils/general";
import { nav4leftLinks } from "@/utils/stores";

export default function PlannerPage() {
  return (
    <AuthorizedWrapper2
      pageTitle={authorizedWrapperTitles.Planner}
      openedLink={nav4leftLinks.planner}
    >
      <StudentPlanner />
    </AuthorizedWrapper2>
  );
}