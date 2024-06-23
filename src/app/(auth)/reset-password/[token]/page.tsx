'use client'
import AuthContentWrapper from "@/components/auth/AuthContentWrapper";
import ResetPasswordContent from "./components/ResetPasswordContent";
import AllResetPasswordSteps from "./components/AllResetPasswordSteps";

export default function page() {
  return (
    <AuthContentWrapper>
      <AllResetPasswordSteps/>
    </AuthContentWrapper>
  )
}
