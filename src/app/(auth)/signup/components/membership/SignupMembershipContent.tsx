"use client";

import MembershipIncludes from "./MembershipIncludes";
import MembershipSelectionLayout from "./MembershipSelectionLayout";

export default function SignupMembershipContent() {
  return (
    <section className="w-full max-w-6xl mx-auto py-8 md:py-12 px-4 flex flex-col justify-center">
      {/* Container wrapper for side-by-side or stacked membership panels */}
      <div className="flex w-full flex-col items-center justify-center gap-8 lg:flex-row lg:items-start lg:justify-between">
        <MembershipSelectionLayout />
        <MembershipIncludes />
      </div>
    </section>
  );
}