"use client";

import { useAtomValue } from "jotai";
import { signupStepAtom } from "@/utils/stores";

import SignupForm from "./SignupForm";
import EmailVerificationContent from "./email-verification/components/EmailVerificationContent";
import SignupMembershipContent from "./membership/SignupMembershipContent";
import SignupPayment from "./SignupPayment";
import SignupSummary from "./SignupSummary";
import SignUpConfirmation from "./SignUpConfirmation";

export default function AllSignupSteps() {
  const step = useAtomValue(signupStepAtom);

  return (
    <div className="w-full min-h-[calc(100vh-160px)] flex flex-col items-center justify-center px-4 py-8">
      {step === 1 && <SignupForm />}
      {step === 2 && <EmailVerificationContent />}
      {step === 3 && <SignupMembershipContent />}
      {step === 4 && <SignupPayment />}
      {step === 5 && <SignupSummary />}
      {step === 6 && <SignUpConfirmation />}
    </div>
  );
}