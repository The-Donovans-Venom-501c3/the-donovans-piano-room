"use client";
import AuthContentWrapper from "@/components/auth/AuthContentWrapper";
import AllSignupSteps from "./components/AllSignupSteps";

export default function SignUp() {
  return (
    <>
      <AuthContentWrapper>
        <AllSignupSteps/>
      </AuthContentWrapper>
    </>
  );
}
