"use client";

import MembershipSelectionLayout from "./MembershipSelectionLayout";

export default function SignupMembershipContent() {
  return (
    <div className="w-full flex justify-center items-center bg-transparent">
      {/* Set isBeta to false to enable all options for Black Friday */}
      <MembershipSelectionLayout isBeta={false} />
    </div>
  );
}