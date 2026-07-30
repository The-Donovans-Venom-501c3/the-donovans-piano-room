"use client";

import MembershipSelectionLayout from "./MembershipSelectionLayout";

export default function SignupMembershipContent() {
  return (
    <div className="w-full flex justify-center items-center bg-transparent">
      <MembershipSelectionLayout isBeta={true} />
    </div>
  );
}