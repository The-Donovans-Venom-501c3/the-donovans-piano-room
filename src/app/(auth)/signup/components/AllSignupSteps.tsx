"use client";

import { singupStepAtom } from "@/utils/stores";
import { useAtom } from "jotai";
import SignupForm from "./SignupForm";
import SignupMembershipContent from "./membership/SignupMembershipContent";
import EmailVerificationContent from "./email-verification/components/EmailVerificationContent";
import SignupPayment from "./SignupPayment";
import SignupSummary from "./SignupSummary";
import SignUpConfirmation from "./SignUpConfirmation";

export default function AllSignupSteps() {
  const [signupStep] = useAtom(singupStepAtom);

  return (
    <>
      {signupStep === 1 && <SignupForm />}
      {signupStep === 2 && <EmailVerificationContent />}
      {signupStep === 3 && <SignupMembershipContent />}
      {signupStep === 4 && <SignupPayment />}
      {signupStep === 5 && <SignupSummary />}
      {signupStep === 6 && <SignUpConfirmation />}
    </>
  );
}