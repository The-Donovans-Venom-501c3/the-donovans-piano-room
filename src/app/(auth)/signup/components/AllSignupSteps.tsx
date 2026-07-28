<<<<<<< HEAD
"use client";

import { singupStepAtom } from "@/utils/stores";
import { useAtom } from "jotai";
import SignupForm from "./SignupForm";
import SignupMembershipContent from "./membership/SignupMembershipContent";
import EmailVerificationContent from "./email-verification/components/EmailVerificationContent";
import SignupPayment from "./SignupPayment";
import SignupSummary from "./SignupSummary";
import SignUpConfirmation from "./SignUpConfirmation";
=======
import { signupStepAtom } from '@/utils/stores'
import { useAtomValue, useSetAtom } from 'jotai'
import SignupForm from './SignupForm'
import SignupMembershipContent from './membership/SignupMembershipContent'
import EmailVerificationContent from './email-verification/components/EmailVerificationContent'
import SignupPayment from './SignupPayment'
>>>>>>> b2179fb (feat: add mobile warning popup and update signup, account, and layout UI components)

export default function AllSignupSteps() {
  const [signupStep] = useAtom(singupStepAtom);

<<<<<<< HEAD
=======
  const signupStep = useAtomValue(signupStepAtom)
>>>>>>> b2179fb (feat: add mobile warning popup and update signup, account, and layout UI components)
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