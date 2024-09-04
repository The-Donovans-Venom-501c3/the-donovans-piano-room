
"use client";
import { useSearchParams } from "next/navigation";
import { useAtom, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import SignupMembershipContent from './components/SignupMembershipContent';
import SignupPayment from '@/app/(auth)/signup/components/SignupPayment';
import { singupStepAtom } from '@/utils/stores';
import AuthContentWrapper from "@/components/auth/AuthContentWrapper";

export default function MembershipPage() {
  const searchParams = useSearchParams();
  const [signupStep, setSignupStep] = useAtom(singupStepAtom);
  const fromSignup = searchParams.get("from") === "signup";
  const totalSteps = fromSignup ? 4 : 2;
  const stepNum = fromSignup ? 3 : 1;

  return (
    <>
      <AuthContentWrapper>
        {signupStep === 3 && <SignupMembershipContent stepNum={stepNum} totalSteps={totalSteps}/>}
        {signupStep === 4 && <SignupPayment stepNum={stepNum+1} totalSteps={totalSteps}/>}
      </AuthContentWrapper>
    </>
  );
}
