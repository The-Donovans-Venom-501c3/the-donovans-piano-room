"use client";

import AuthContentWrapper from "@/components/auth/AuthContentWrapper";
import SignUpConfirmation from "@/app/(auth)/signup/components/SignUpConfirmation";

export default function VaultCompletePage() {
  return (
    <AuthContentWrapper>
      <SignUpConfirmation destination="dashboard" />
    </AuthContentWrapper>
  );
}
